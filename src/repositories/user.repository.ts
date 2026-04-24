import prisma from '@/lib/prisma'
import { Prisma, User } from '@prisma/client'

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email ?? undefined },
      include: { role: true }
    })
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { role: true }
    })
  },

  async findAll(skip?: number, take?: number) {
    return prisma.user.findMany({
      skip,
      take,
      include: { role: true },
      orderBy: { createdAt: 'desc' }
    })
  },

  async count() {
    return prisma.user.count()
  },

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      include: { role: true }
    })
  },

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      include: { role: true }
    })
  },

  async delete(id: string) {
    return prisma.user.delete({ where: { id } })
  }
}