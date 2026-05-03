import { prisma } from '@/src/lib/prisma'
import { Prisma, FaqStatus } from '@prisma/client'

export const faqRepository = {
  async findAllPublished() {
    return prisma.faq.findMany({
      where: { status: 'published' },
      orderBy: { id: 'asc' } // ganti dengan field yang ada, misal id
    })
  },

  async findById(id: string) {
    return prisma.faq.findUnique({ where: { id } })
  },

  async findAllAdmin() {
    return prisma.faq.findMany({ orderBy: { id: 'desc' } })
  },

  async create(data: Prisma.FaqUncheckedCreateInput) {
    return prisma.faq.create({ data })
  },

  async update(id: string, data: Prisma.FaqUncheckedUpdateInput) {
    return prisma.faq.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.faq.delete({ where: { id } })
  },

  async updateStatus(id: string, status: FaqStatus) {
    return prisma.faq.update({ where: { id }, data: { status } })
  }
}