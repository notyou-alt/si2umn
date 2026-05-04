import { prisma } from '@/src/lib/prisma'
import { Prisma } from '@prisma/client'

export const curriculumRepository = {
  async findAll(skip?: number, take?: number) {
    return prisma.curriculum.findMany({
      skip,
      take,
      orderBy: { course_name: 'asc' },
      include: { courseType: true }
    })
  },

  async findById(id: string) {
    return prisma.curriculum.findUnique({
      where: { id },
      include: { courseType: true }
    })
  },

  async count() {
    return prisma.curriculum.count()
  },

  async create(data: Prisma.CurriculumCreateInput) {
    return prisma.curriculum.create({ data })
  },

  async update(id: string, data: Prisma.CurriculumUpdateInput) {
    return prisma.curriculum.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.curriculum.delete({ where: { id } })
  }
}