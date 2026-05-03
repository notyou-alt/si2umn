import { prisma } from '@/src/lib/prisma'
import { Prisma, TestimonyStatus } from '@prisma/client'

export const testimonyRepository = {
  async findAllPublished(skip?: number, take?: number) {
    return prisma.testimony.findMany({
      where: { status: 'published' },
      skip,
      take,
      orderBy: { created_at: 'desc' }
    })
  },

  async findById(id: string) {
    return prisma.testimony.findUnique({ where: { id } })
  },

  async findAllAdmin(skip?: number, take?: number) {
    return prisma.testimony.findMany({
      skip,
      take,
      orderBy: { created_at: 'desc' }
    })
  },

  async countPublished() {
    return prisma.testimony.count({ where: { status: 'published' } })
  },

  async create(data: Prisma.TestimonyCreateInput) {
    return prisma.testimony.create({ data })
  },

  async update(id: string, data: Prisma.TestimonyUpdateInput) {
    return prisma.testimony.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.testimony.delete({ where: { id } })
  },

  async updateStatus(id: string, status: TestimonyStatus) {
    return prisma.testimony.update({ where: { id }, data: { status } })
  }
}