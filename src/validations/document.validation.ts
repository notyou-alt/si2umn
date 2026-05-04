import { z } from 'zod'

export const createDocumentSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  documentCategoriesId: z.string().uuid(),
  // file akan di-handle terpisah
})

export const updateDocumentSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().optional(),
  documentCategoriesId: z.string().uuid().optional()
})