import { z } from 'zod'
import { ROLES } from '@/src/constants/roles'

export const createUserSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
  password: z.string().min(6).optional(),
  name: z.string().optional(),
  role: z.enum([ROLES.USER, ROLES.ADMIN, ROLES.SUPERADMIN]).default(ROLES.USER),
})

export const updateUserSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()).optional(),
  password: z.string().min(6).optional(),
  name: z.string().optional(),
  role: z.enum([ROLES.USER, ROLES.ADMIN, ROLES.SUPERADMIN]).optional(),
})