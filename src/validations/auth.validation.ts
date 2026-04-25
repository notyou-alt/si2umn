// src/validations/auth.validation.ts (tambah verification schemas)
import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
  password: z.string().min(6),
  name: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
  password: z.string().min(1),
})

export const sendVerificationSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
})

export const confirmVerificationSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
  token: z.string().min(1),
})