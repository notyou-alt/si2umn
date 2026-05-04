import { documentCategoryRepository } from '@/src/repositories/document-category.repository'
import { createDocumentCategorySchema, updateDocumentCategorySchema } from '@/src/validations/document-category.validation'
import { NotFoundError } from '@/src/lib/errors'

export const documentCategoryService = {
  async getAll() {
    return documentCategoryRepository.findAll()
  },

  async getById(id: string) {
    const category = await documentCategoryRepository.findById(id)
    if (!category) throw new NotFoundError('Kategori dokumen tidak ditemukan')
    return category
  },

  async create(data: unknown) {
    const validated = createDocumentCategorySchema.parse(data)
    return documentCategoryRepository.create(validated)
  },

  async update(id: string, data: unknown) {
    const existing = await documentCategoryRepository.findById(id)
    if (!existing) throw new NotFoundError('Kategori dokumen tidak ditemukan')
    const validated = updateDocumentCategorySchema.parse(data)
    return documentCategoryRepository.update(id, validated)
  },

  async delete(id: string) {
    const existing = await documentCategoryRepository.findById(id)
    if (!existing) throw new NotFoundError('Kategori dokumen tidak ditemukan')
    await documentCategoryRepository.delete(id)
    return true
  }
}