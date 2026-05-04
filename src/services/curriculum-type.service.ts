import { curriculumTypeRepository } from '@/src/repositories/curriculum-type.repository'

export const curriculumTypeService = {
  async getAll() {
    return curriculumTypeRepository.findAll()
  }
}