import { documentRepository } from '@/src/repositories/document.repository'
import { createDocumentSchema } from '@/src/validations/document.validation'
import { uploadFile, deleteFile } from '@/src/lib/supabase'
import { NotFoundError } from '@/src/lib/errors'

export const documentService = {
  async getAll(page: number = 1, limit: number = 10, categoryId?: string) {
    const safeLimit = Math.max(1, limit)
    const skip = (Math.max(1, page) - 1) * safeLimit
    const [documents, total] = await Promise.all([
      documentRepository.findAll(categoryId, skip, safeLimit),
      documentRepository.count(categoryId)
    ])
    return {
      data: documents,
      pagination: { page, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) }
    }
  },

  async getById(id: string) {
    const document = await documentRepository.findById(id)
    if (!document) throw new NotFoundError('Dokumen tidak ditemukan')
    return document
  },

async create(data: unknown, file: File) {
  const validated = createDocumentSchema.parse(data)

  // ✅ langsung kirim File ke Supabase (tanpa buffer)
  const fileUrl = await uploadFile(file, 'documents')

  const doc = await documentRepository.create({
    title: validated.title,
    description: validated.description,
    file_path: fileUrl,
    file_type: file.type,
    category: { connect: { id: validated.documentCategoriesId } }
  })

  return doc
},

  async delete(id: string) {
    const existing = await documentRepository.findById(id)
    if (!existing) throw new NotFoundError('Dokumen tidak ditemukan')
    if (existing.file_path) {
      await deleteFile(existing.file_path)
    }
    await documentRepository.delete(id)
    return true
  }
}