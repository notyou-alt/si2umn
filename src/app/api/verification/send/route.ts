import { NextRequest, NextResponse } from 'next/server'
import { verificationService } from '@/src/services/verification.service'
import { sendVerificationSchema } from '@/src/validations/auth.validation'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = sendVerificationSchema.parse(body)
    await verificationService.sendVerification(email)
    return NextResponse.json({ success: true, data: { message: 'Verification email sent' } })
  } catch (error: any) {
    const status = error.statusCode || 400
    return NextResponse.json({ success: false, message: error.message }, { status })
  }
}