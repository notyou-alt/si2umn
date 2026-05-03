import { prisma } from '@/src/lib/prisma'
import { Prisma } from '@prisma/client'

export const authLogRepository = {
  async create(data: Prisma.AuthLogUncheckedCreateInput) {
    return prisma.authLog.create({ data })
  },

  async findAll(skip?: number, take?: number) {
    return prisma.authLog.findMany({
      skip,
      take,
      orderBy: { created_at: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } }
    })
  },

  async count() {
    return prisma.authLog.count()
  }
}

export const activityLogRepository = {
  async create(data: Prisma.ActivityLogUncheckedCreateInput) {
    return prisma.activityLog.create({ data })
  },

  async findAll(skip?: number, take?: number) {
    return prisma.activityLog.findMany({
      skip,
      take,
      orderBy: { created_at: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } }
    })
  },

  async count() {
    return prisma.activityLog.count()
  }
}