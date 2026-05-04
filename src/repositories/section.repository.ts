import { prisma } from '@/src/lib/prisma'
import { Prisma } from '@prisma/client'

export const sectionRepository = {
  async findAll() {
    return prisma.section.findMany({
      orderBy: { created_at: 'asc' }
    })
  },

  async findById(id: string) {
    return prisma.section.findUnique({
      where: { id },
      include: {
        contents: {
          orderBy: { order_no: 'asc' }
        }
      }
    })
  },

  async create(data: Prisma.SectionCreateInput) {
    return prisma.section.create({ data })
  },

  async update(id: string, data: Prisma.SectionUpdateInput) {
    return prisma.section.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.section.delete({ where: { id } })
  }
}