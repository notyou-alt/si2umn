import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/src/services/auth.service'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const user = await authService.register(body)
    return NextResponse.json({ success: true, data: user }, { status: 201 })
  } catch (error: any) {
    const message = error.message || 'Registration failed'
    const status = message === 'Email sudah terdaftar' ? 409 : 400
    return NextResponse.json({ success: false, message }, { status })
  }
}