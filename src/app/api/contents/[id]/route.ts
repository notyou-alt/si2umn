import { NextRequest, NextResponse } from 'next/server'
import { contentService } from '@/src/services/content.service'
import { requireRole } from '@/src/lib/auth'
import { ROLES } from '@/src/constants/roles'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole([ROLES.ADMIN, ROLES.SUPERADMIN])
    const id = params.id
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
    const imageFile = formData.get('image') as File | null
    let imageBase64: string | undefined
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      imageBase64 = `data:${imageFile.type};base64,${buffer.toString('base64')}`
    }
    const updated = await contentService.update(id, data, imageBase64)
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
    await contentService.delete(id)
    return NextResponse.json({ success: true, data: null })
  } catch (error: any) {
    const status = error.statusCode || 500
    return NextResponse.json({ success: false, message: error.message }, { status })
  }
}