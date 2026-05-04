import { z } from 'zod'

export const createDocumentCategorySchema = z.object({
  categories_name: z.string().min(2).max(100),
  categories_desc: z.string().optional()
})

export const updateDocumentCategorySchema = z.object({
  categories_name: z.string().min(2).max(100).optional(),
  categories_desc: z.string().optional()
})