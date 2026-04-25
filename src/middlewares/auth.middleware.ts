import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/src/lib/auth'

export async function withAuth(
  req: NextRequest,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    return handler(req, user)
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}