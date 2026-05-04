import { NextRequest, NextResponse } from 'next/server'
import { documentCategoryService } from '@/src/services/document-category.service'
import { requireRole } from '@/src/lib/auth'
import { ROLES } from '@/src/constants/roles'

export async function GET() {
  try {
    const categories = await documentCategoryService.getAll()
    return NextResponse.json({ success: true, data: categories })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole([ROLES.ADMIN, ROLES.SUPERADMIN])
    const body = await req.json()
    const category = await documentCategoryService.create(body)
    return NextResponse.json({ success: true, data: category }, { status: 201 })
  } catch (error: any) {
    const status = error.statusCode || 400
    return NextResponse.json({ success: false, message: error.message }, { status })
  }
}