import { prisma } from '@/src/lib/prisma'
import { Prisma } from '@prisma/client'

export const documentCategoryRepository = {
  async findAll() {
    return prisma.documentCategory.findMany({
      orderBy: { categories_name: 'asc' }
    })
  },

  async findById(id: string) {
    return prisma.documentCategory.findUnique({ where: { id } })
  },

  async create(data: Prisma.DocumentCategoryCreateInput) {
    return prisma.documentCategory.create({ data })
  },

  async update(id: string, data: Prisma.DocumentCategoryUpdateInput) {
    return prisma.documentCategory.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.documentCategory.delete({ where: { id } })
  }
}