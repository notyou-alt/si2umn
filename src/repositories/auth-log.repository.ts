import { prisma } from '@/src/lib/prisma'
import { Prisma } from '@prisma/client'

export const authLogRepository = {
  async create(data: Prisma.AuthLogUncheckedCreateInput) {
    return prisma.authLog.create({ data })
  }
}