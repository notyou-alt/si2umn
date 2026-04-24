import { randomBytes, createHash } from 'crypto'

export const generateToken = (length: number = 32): string => {
  return randomBytes(length).toString('hex')
}

export const hashToken = (token: string): string => {
  return createHash('sha256').update(token).digest('hex')
}

export const omitPassword = <T extends { password?: string | null }>(user: T): Omit<T, 'password'> => {
  const { password, ...rest } = user
  return rest
}

export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim()
}