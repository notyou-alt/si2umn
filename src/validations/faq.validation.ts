import { z } from 'zod'

export const createFaqSchema = z.object({
  question: z.string().min(3).max(255),
  answer: z.string().min(3),
  status: z.enum(['draft', 'published', 'archived']).default('draft')
})

export const updateFaqSchema = z.object({
  question: z.string().min(3).max(255).optional(),
  answer: z.string().min(3).optional()
})