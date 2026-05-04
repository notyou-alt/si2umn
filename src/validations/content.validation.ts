import { z } from 'zod'

export const createContentSchema = z.object({
  sectionId: z.string().uuid(),
  title: z.string().optional(),
  content: z.string().optional(),
  image: z.string().url().optional(),
  order_no: z.number().int().min(0)
})

export const updateContentSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  image: z.string().url().optional(),
  order_no: z.number().int().min(0).optional()
})