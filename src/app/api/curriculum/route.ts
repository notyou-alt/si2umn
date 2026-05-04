import { NextRequest, NextResponse } from 'next/server'
import { curriculumService } from '@/src/services/curriculum.service'
import { requireRole } from '@/src/lib/auth'
import { ROLES } from '@/src/constants/roles'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const safeLimit = Math.max(1, limit)

    const result = await curriculumService.getAll(page, safeLimit)

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole([ROLES.ADMIN, ROLES.SUPERADMIN])
    let body
    try {
    body = await req.json()
    } catch {
    return NextResponse.json(
        { success: false, message: 'Body JSON tidak valid' },
        { status: 400 }
    )
    }
    const curriculum = await curriculumService.create(body)
    return NextResponse.json({ success: true, data: curriculum }, { status: 201 })
  } catch (error: any) {
    const status = error.statusCode || 400
    return NextResponse.json({ success: false, message: error.message }, { status })
  }
}