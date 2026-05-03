import { NextRequest, NextResponse } from 'next/server'
import { faqService } from '@/src/services/faq.service'
import { requireRole } from '@/src/lib/auth'
import { ROLES } from '@/src/constants/roles'

export async function GET() {
  try {
    const faqs = await faqService.getAllPublic()
    return NextResponse.json({ success: true, data: faqs })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole([ROLES.ADMIN, ROLES.SUPERADMIN])
    const body = await req.json()
    const faq = await faqService.create(body, user.id)
    return NextResponse.json({ success: true, data: faq }, { status: 201 })
  } catch (error: any) {
    const status = error.statusCode || 400
    return NextResponse.json({ success: false, message: error.message }, { status })
  }
}