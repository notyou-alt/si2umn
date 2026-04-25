import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/src/services/auth.service'

export async function POST(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get('sessionToken')?.value
    if (sessionToken) {
      await authService.logout(sessionToken)
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