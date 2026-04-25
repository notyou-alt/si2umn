import { cookies } from 'next/headers'
import { prisma } from './prisma' 
import { UnauthorizedError, ForbiddenError } from './errors'
import { hashToken, omitPassword } from './utils'
import { User, Role } from '@prisma/client'

// tipe untuk user yang sudah termasuk role dan tanpa password
export type UserWithRole = Omit<User, 'password'> & { role: Role }

export async function getCurrentUser(): Promise<UserWithRole | null> {
  const cookieStore = await cookies()
  const rawToken = cookieStore.get('sessionToken')?.value
  if (!rawToken) return null

  const hashedToken = hashToken(rawToken)
  const session = await prisma.session.findUnique({
    where: { sessionToken: hashedToken },
    include: {
      user: {
        include: { role: true }
      }
    }
  })

  if (!session || session.expires < new Date()) {
    if (session) await prisma.session.delete({ where: { sessionToken: hashedToken } })
    return null
  }

  return omitPassword(session.user) as UserWithRole
}

export async function requireAuth(): Promise<UserWithRole> {
  const user = await getCurrentUser()
  if (!user) throw new UnauthorizedError()
  return user
}

export async function requireRole(allowedRoles: string[]): Promise<UserWithRole> {
  const user = await requireAuth()
  const roleName = user.role?.role_name
  if (!roleName || !allowedRoles.includes(roleName)) {
    throw new ForbiddenError('Insufficient role')
  }
  return user
}