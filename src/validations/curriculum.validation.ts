import { z } from 'zod'

export const createCurriculumSchema = z.object({
  course_id: z.string().min(1).max(20),
  course_name: z.string().min(3).max(200),
  course_type_id: z.string().uuid(),
  lecture_credit: z.number().int().min(0),
  lab_credit: z.number().int().min(0),
  ects: z.number().int().min(0),
  notes: z.string().optional()
})

export const updateCurriculumSchema = z.object({
  course_id: z.string().min(1).max(20).optional(),
  course_name: z.string().min(3).max(200).optional(),
  course_type_id: z.string().uuid().optional(),
  lecture_credit: z.number().int().min(0).optional(),
  lab_credit: z.number().int().min(0).optional(),
  ects: z.number().int().min(0).optional(),
  notes: z.string().optional()
})