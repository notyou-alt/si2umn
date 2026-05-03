import { prisma } from '@/src/lib/prisma'
import { Prisma } from '@prisma/client'

export const newsRepository = {
  async findAll(skip?: number, take?: number) {
    return prisma.news.findMany({
      skip,
      take,
      orderBy: { created_at: 'desc' },
      include: { author: { select: { id: true, name: true } } }
    })
  },

  async findById(id: string) {
    return prisma.news.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true } } }
    })
  },

  async findBySlug(slug: string) {
    return prisma.news.findUnique({ where: { slug } })
  },

  async count() {
    return prisma.news.count()
  },

  async create(data: Prisma.NewsUncheckedCreateInput) {
    return prisma.news.create({ data })
  },

  async update(id: string, data: Prisma.NewsUncheckedUpdateInput) {
    return prisma.news.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.news.delete({ where: { id } })
  }
}