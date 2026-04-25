import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/src/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    return NextResponse.json({ success: true, data: user })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal error' },
      { status: 500 }
    )
  }
}