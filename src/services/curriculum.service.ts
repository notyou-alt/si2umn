import { curriculumRepository } from '@/src/repositories/curriculum.repository'
import { createCurriculumSchema, updateCurriculumSchema } from '@/src/validations/curriculum.validation'
import { NotFoundError } from '@/src/lib/errors'

export const curriculumService = {
  async getAll(page: number = 1, limit: number = 10) {
    const safeLimit = Math.max(1, limit)
    const skip = (Math.max(1, page) - 1) * safeLimit
    const [items, total] = await Promise.all([
      curriculumRepository.findAll(skip, safeLimit),
      curriculumRepository.count()
    ])
    return {
      data: items,
      pagination: { page, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) }
    }
  },

  async getById(id: string) {
    const item = await curriculumRepository.findById(id)
    if (!item) throw new NotFoundError('Mata kuliah tidak ditemukan')
    return item
  },

  async create(data: unknown) {
    const validated = createCurriculumSchema.parse(data)
    return curriculumRepository.create({
      course_id: validated.course_id,
      course_name: validated.course_name,
      courseType: { connect: { id: validated.course_type_id } },
      lecture_credit: validated.lecture_credit,
      lab_credit: validated.lab_credit,
      ects: validated.ects,
      notes: validated.notes
    })
  },

  async update(id: string, data: unknown) {
    const existing = await curriculumRepository.findById(id)
    if (!existing) throw new NotFoundError('Mata kuliah tidak ditemukan')
    const validated = updateCurriculumSchema.parse(data)
    const updateData: any = {}
    if (validated.course_id !== undefined) updateData.course_id = validated.course_id
    if (validated.course_name !== undefined) updateData.course_name = validated.course_name
    if (validated.course_type_id !== undefined) {
      updateData.courseType = { connect: { id: validated.course_type_id } }
    }
    if (validated.lecture_credit !== undefined) updateData.lecture_credit = validated.lecture_credit
    if (validated.lab_credit !== undefined) updateData.lab_credit = validated.lab_credit
    if (validated.ects !== undefined) updateData.ects = validated.ects
    if (validated.notes !== undefined) updateData.notes = validated.notes
    return curriculumRepository.update(id, updateData)
  },

  async delete(id: string) {
    const existing = await curriculumRepository.findById(id)
    if (!existing) throw new NotFoundError('Mata kuliah tidak ditemukan')
    await curriculumRepository.delete(id)
    return true
  }
}