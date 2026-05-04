import { prisma } from '@/src/lib/prisma'

export const curriculumTypeRepository = {
  async findAll() {
    return prisma.curriculumType.findMany({
      orderBy: { course_type_name: 'asc' }
    })
  }
}