import bcrypt from 'bcrypt'
import { userRepository } from '@/src/repositories/user.repository'
import { sessionRepository } from '@/src/repositories/session.repository'
import { roleRepository } from '@/src/repositories/role.repository'
import { authLogRepository } from '@/src/repositories/auth-log.repository'
import { generateToken, omitPassword, normalizeEmail } from '@/src/lib/utils'
import { registerSchema, loginSchema } from '@/src/validations/auth.validation'
import { ConflictError, UnauthorizedError, NotFoundError, AppError } from '@/src/lib/errors'

export const authService = {
  async register(data: unknown) {
    const validated = registerSchema.parse(data)
    const email = normalizeEmail(validated.email)
    const existing = await userRepository.findByEmail(email)
    if (existing) throw new ConflictError('Email sudah terdaftar')

    const hashedPassword = await bcrypt.hash(validated.password, 10)
    const userRole = await roleRepository.getDefaultRole()
    if (!userRole) throw new AppError('Role default tidak ditemukan', 500)

    const user = await userRepository.create({
      email,
      password: hashedPassword,
      name: validated.name,
      role: { connect: { id: userRole.id } }
    })

    // Log
    await authLogRepository.create({ userId: user.id, email, ip_address: 'system', event: 'register' })

    return omitPassword(user)
  },

  async login(data: unknown, ipAddress: string = 'unknown') {
    const validated = loginSchema.parse(data)
    const email = normalizeEmail(validated.email)
    const user = await userRepository.findByEmail(email)
    if (!user || !user.password) throw new UnauthorizedError('Email atau password salah')

    const isValid = await bcrypt.compare(validated.password, user.password)
    if (!isValid) throw new UnauthorizedError('Email atau password salah')

    const rawToken = generateToken()
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await sessionRepository.create(user.id, rawToken, expires)

    // Log
    await authLogRepository.create({ userId: user.id, email, ip_address: ipAddress, event: 'login_success' })

    return { user: omitPassword(user), sessionToken: rawToken }
  },

  async logout(rawToken: string) {
    await sessionRepository.deleteByRawToken(rawToken)
    return true
  },

  async getMe(userId: string) {
    const user = await userRepository.findById(userId)
    if (!user) throw new NotFoundError('User tidak ditemukan')
    return omitPassword(user)
  }
}