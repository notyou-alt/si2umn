import { NextRequest, NextResponse } from 'next/server'
import { documentCategoryService } from '@/src/services/document-category.service'
import { requireRole } from '@/src/lib/auth'
import { ROLES } from '@/src/constants/roles'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole([ROLES.ADMIN, ROLES.SUPERADMIN])
    const id = params.id
    const body = await req.json()
    const updated = await documentCategoryService.update(id, body)
    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    const status = error.statusCode || 400
    return NextResponse.json({ success: false, message: error.message }, { status })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole([ROLES.ADMIN, ROLES.SUPERADMIN])
    const id = params.id
    await documentCategoryService.delete(id)
    return NextResponse.json({ success: true, data: null })
  } catch (error: any) {
    const status = error.statusCode || 500
    return NextResponse.json({ success: false, message: error.message }, { status })
  }
}