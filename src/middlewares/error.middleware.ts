// src/middlewares/role.middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/src/lib/auth'

/**
 * Middleware untuk membatasi akses berdasarkan role.
 * Gunakan dengan membungkus handler di route.
 *
 * Contoh:
 * export const GET = withRole(['admin', 'superadmin'])(async (req, user) => {
 *   return NextResponse.json({ success: true, data: user })
 * })
 */
export function withRole(allowedRoles: string[]) {
  return async (
    req: NextRequest,
    handler: (req: NextRequest, user: any) => Promise<NextResponse>
  ) => {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    const roleName = user.role?.role_name as string
    if (!allowedRoles.includes(roleName)) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: insufficient role' },
        { status: 403 }
      )
    }
    return handler(req, user)
  }
}