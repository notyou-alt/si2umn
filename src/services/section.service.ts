import { sectionRepository } from '@/src/repositories/section.repository'
import { createSectionSchema, updateSectionSchema } from '@/src/validations/section.validation'
import { NotFoundError } from '@/src/lib/errors'

export const sectionService = {
  async getAll() {
    return sectionRepository.findAll()
  },

  async getById(id: string) {
    const section = await sectionRepository.findById(id)
    if (!section) throw new NotFoundError('Section tidak ditemukan')
    return section
  },

  async create(data: unknown) {
    const validated = createSectionSchema.parse(data)
    return sectionRepository.create(validated)
  },

  async update(id: string, data: unknown) {
    const existing = await sectionRepository.findById(id)
    if (!existing) throw new NotFoundError('Section tidak ditemukan')
    const validated = updateSectionSchema.parse(data)
    return sectionRepository.update(id, validated)
  },

  async delete(id: string) {
    const existing = await sectionRepository.findById(id)
    if (!existing) throw new NotFoundError('Section tidak ditemukan')
    await sectionRepository.delete(id)
    return true
  }
}