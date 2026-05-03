import { NextRequest, NextResponse } from 'next/server'
import { faqService } from '@/src/services/faq.service'
import { requireRole } from '@/src/lib/auth'
import { ROLES } from '@/src/constants/roles'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole([ROLES.ADMIN, ROLES.SUPERADMIN])
    const { id } = params
    const { status } = await req.json()
    const updated = await faqService.updateStatus(id, status, user.id)
    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    const statusCode = error.statusCode || 400
    return NextResponse.json({ success: false, message: error.message }, { status: statusCode })
  }
}