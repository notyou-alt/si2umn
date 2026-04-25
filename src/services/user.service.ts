import bcrypt from 'bcrypt'
import { userRepository } from '@/src/repositories/user.repository'
import { roleRepository } from '@/src/repositories/role.repository'
import { activityLogRepository } from '@/src/repositories/activity-log.repository'
import { createUserSchema, updateUserSchema } from '@/src/validations/user.validation'
import { omitPassword, normalizeEmail } from '@/src/lib/utils'
import { NotFoundError, ConflictError, AppError } from '@/src/lib/errors'

export const userService = {
  async getAllUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    const [users, total] = await Promise.all([
      userRepository.findAll(skip, limit),
      userRepository.count()
    ])
    return {
      data: users.map(omitPassword),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    }
  },

  async getUserById(id: string) {
    const user = await userRepository.findById(id)
    if (!user) throw new NotFoundError('User tidak ditemukan')
    return omitPassword(user)
  },

  async createUser(data: unknown, actorId?: string) {
    const validated = createUserSchema.parse(data)
    const email = normalizeEmail(validated.email)
    const existing = await userRepository.findByEmail(email)
    if (existing) throw new ConflictError('Email sudah terdaftar')

    const role = await roleRepository.findByName(validated.role)
    if (!role) throw new AppError('Role tidak valid', 400)

    let hashedPassword = null
    if (validated.password) {
      hashedPassword = await bcrypt.hash(validated.password, 10)
    } else if (!validated.password && validated.role !== 'user') {
      // Jika tidak ada password, hanya diperbolehkan untuk SSO, Di sini wajibkan password untuk admin create.
      throw new AppError('Password wajib diisi untuk user baru', 400)
    }

    const user = await userRepository.create({
      email,
      password: hashedPassword,
      name: validated.name,
      role: { connect: { id: role.id } }
    })

    if (actorId) {
      await activityLogRepository.create({
        userId: actorId,
        action: 'create_user',
        target: `User ${user.id} created`
      })
    }

    return omitPassword(user)
  },

  async updateUser(id: string, data: unknown, actorId?: string) {
    const validated = updateUserSchema.parse(data)
    const existing = await userRepository.findById(id)
    if (!existing) throw new NotFoundError('User tidak ditemukan')

    if (validated.email && validated.email !== existing.email) {
      const emailTaken = await userRepository.findByEmail(validated.email)
      if (emailTaken) throw new ConflictError('Email sudah digunakan')
    }

    let roleConnect = undefined
    if (validated.role) {
      const role = await roleRepository.findByName(validated.role)
      if (!role) throw new AppError('Role tidak valid', 400)
      roleConnect = { connect: { id: role.id } }
    }

    const hashedPassword = validated.password ? await bcrypt.hash(validated.password, 10) : undefined

    const updated = await userRepository.update(id, {
      email: validated.email ?? undefined,
      password: hashedPassword,
      name: validated.name ?? undefined,
      role: roleConnect
    })

    if (actorId) {
      await activityLogRepository.create({
        userId: actorId,
        action: 'update_user',
        target: `User ${id} updated`
      })
    }

    return omitPassword(updated)
  },

  async deleteUser(id: string, actorId?: string) {
    const user = await userRepository.findById(id)
    if (!user) throw new NotFoundError('User tidak ditemukan')
    await userRepository.delete(id)

    if (actorId) {
      await activityLogRepository.create({
        userId: actorId,
        action: 'delete_user',
        target: `User ${id} deleted`
      })
    }
    return true
  }
}