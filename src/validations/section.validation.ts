import { z } from 'zod'

export const createSectionSchema = z.object({
  name: z.string().min(2).max(100),
  type: z.enum(['single', 'list', 'content'])
})

export const updateSectionSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  type: z.enum(['single', 'list', 'content']).optional()
})