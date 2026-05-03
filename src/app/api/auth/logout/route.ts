import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/src/services/auth.service'
import { getCurrentUser } from '@/src/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get('sessionToken')?.value
    if (sessionToken) {
      const user = await getCurrentUser()
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
      if (user) {
        await authService.logout(sessionToken, user.id, user.email!, ip)
      } else {
        // userId undefined, akan di-handle service dengan fallback 'unknown'
        await authService.logout(sessionToken, undefined, 'unknown', ip)
      }
    }
    const response = NextResponse.json({ success: true, data: null })
    response.cookies.delete('sessionToken')
    return response
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Logout failed' },
      { status: 500 }
    )
  }
}