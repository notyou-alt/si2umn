import { prisma } from '@/src/lib/prisma'
import { Prisma } from '@prisma/client'

export const activityLogRepository = {
  async create(data: Prisma.ActivityLogUncheckedCreateInput) {
    return prisma.activityLog.create({ data })
  }
}