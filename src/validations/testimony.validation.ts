import { z } from 'zod'

export const createTestimonySchema = z.object({
  sender_name: z.string().min(2).max(100),
  sender_position: z.string().min(2).max(100),
  photo: z.string().url().optional(),
  full_testimony: z.string().min(10),
  date: z.string().or(z.date()).transform((v) => new Date(v)),
  status: z.enum(['draft', 'published', 'archived']).default('draft')
})

export const updateTestimonySchema = z.object({
  sender_name: z.string().min(2).max(100).optional(),
  sender_position: z.string().min(2).max(100).optional(),
  photo: z.string().url().optional(),
  full_testimony: z.string().min(10).optional(),
  date: z.string().or(z.date()).transform((v) => new Date(v)).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional()
})