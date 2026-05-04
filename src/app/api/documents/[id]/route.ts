import { NextRequest, NextResponse } from 'next/server'
import { documentService } from '@/src/services/document.service'
import { requireRole } from '@/src/lib/auth'
import { ROLES } from '@/src/constants/roles'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const document = await documentService.getById(id)
    return NextResponse.json({ success: true, data: document })
  } catch (error: any) {
    const status = error.statusCode || 500
    return NextResponse.json({ success: false, message: error.message }, { status })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole([ROLES.ADMIN, ROLES.SUPERADMIN])
    const id = params.id
    await documentService.delete(id)
    return NextResponse.json({ success: true, data: null })
  } catch (error: any) {
    const status = error.statusCode || 500
    return NextResponse.json({ success: false, message: error.message }, { status })
  }
}