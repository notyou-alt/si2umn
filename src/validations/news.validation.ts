import { z } from 'zod'

export const createNewsSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10),
  image: z.string().url().optional(),
})

export const updateNewsSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  content: z.string().min(10).optional(),
  image: z.string().url().optional(),
})