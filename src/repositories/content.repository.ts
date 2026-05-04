import { prisma } from '@/src/lib/prisma'
import { Prisma } from '@prisma/client'

export const contentRepository = {
  async findById(id: string) {
    return prisma.content.findUnique({
      where: { id },
      include: { section: true }
    })
  },

  async findBySectionAndOrder(sectionId: string, orderNo: number) {
    return prisma.content.findFirst({
      where: { sectionId, order_no: orderNo }
    })
  },

  async create(data: Prisma.ContentCreateInput) {
    return prisma.content.create({ data })
  },

  async update(id: string, data: Prisma.ContentUpdateInput) {
    return prisma.content.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.content.delete({ where: { id } })
  }
}