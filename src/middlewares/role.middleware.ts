import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/src/lib/auth'

export function withRole(allowedRoles: string[]) {
  return async (req: NextRequest, handler: (req: NextRequest, user: any) => Promise<NextResponse>) => {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    const roleName = user.role?.role_name
    if (!allowedRoles.includes(roleName)) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: insufficient role' },
        { status: 403 }
      )
    }
    return handler(req, user)
  }
}