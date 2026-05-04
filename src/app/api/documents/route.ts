import { NextRequest, NextResponse } from 'next/server'
import { documentService } from '@/src/services/document.service'
import { requireRole } from '@/src/lib/auth'
import { ROLES } from '@/src/constants/roles'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const safeLimit = Math.max(1, limit)

    const categoryId = searchParams.get('categoryId') || undefined

    const result = await documentService.getAll(page, safeLimit, categoryId)

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole([ROLES.ADMIN, ROLES.SUPERADMIN])
    const formData = await req.formData()
    const rawData = formData.get('data')

    let data = {}
    try {
    data = rawData ? JSON.parse(rawData as string) : {}
    } catch {
    return NextResponse.json(
        { success: false, message: 'Format JSON tidak valid' },
        { status: 400 }
        )
    }
    const file = formData.get('file') as File
    if (!file) throw new Error('File wajib diupload')
    if (!(file instanceof File)) {
  return NextResponse.json(
        { success: false, message: 'File tidak valid' },
        { status: 400 }
    )
    }

    const allowedTypes = ['application/pdf']
    if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
        { success: false, message: 'Tipe file tidak didukung' },
        { status: 400 }
    )
    }

    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_SIZE) {
    return NextResponse.json(
        { success: false, message: 'File terlalu besar (max 5MB)' },
        { status: 400 }
    )
    }
    const document = await documentService.create(data, file)
    return NextResponse.json({ success: true, data: document }, { status: 201 })
  } catch (error: any) {
    const status = error.statusCode || 400
    return NextResponse.json({ success: false, message: error.message }, { status })
  }
}