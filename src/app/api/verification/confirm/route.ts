import { NextRequest, NextResponse } from 'next/server'
import { verificationService } from '@/src/services/verification.service'
import { confirmVerificationSchema } from '@/src/validations/auth.validation'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, token } = confirmVerificationSchema.parse(body)
    await verificationService.confirmVerification(email, token)
    return NextResponse.json({ success: true, data: { message: 'Email verified' } })
  } catch (error: any) {
    const status = error.statusCode || 400
    return NextResponse.json({ success: false, message: error.message }, { status })
  }
}