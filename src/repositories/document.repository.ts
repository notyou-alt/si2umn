import { prisma } from '@/src/lib/prisma'
import { Prisma } from '@prisma/client'

export const documentRepository = {
  async findAll(categoryId?: string, skip?: number, take?: number) {
    return prisma.document.findMany({
      where: categoryId ? { documentCategoriesId: categoryId } : undefined,
      skip,
      take,
      orderBy: { created_at: 'desc' },
      include: { category: true }
    })
  },

  async findById(id: string) {
    return prisma.document.findUnique({
      where: { id },
      include: { category: true }
    })
  },

  async count(categoryId?: string) {
    return prisma.document.count({
      where: categoryId ? { documentCategoriesId: categoryId } : undefined
    })
  },

  async create(data: Prisma.DocumentCreateInput) {
    return prisma.document.create({ data })
  },

  async delete(id: string) {
    return prisma.document.delete({ where: { id } })
  }
}