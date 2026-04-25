import { User, Role } from '@prisma/client'

export type UserWithoutPassword = Omit<User, 'password'>
export type UserWithRole = UserWithoutPassword & { role: Role }