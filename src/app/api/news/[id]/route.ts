import { NextRequest, NextResponse } from 'next/server'
import { newsService } from '@/src/services/news.service'
import { requireRole } from '@/src/lib/auth'
import { ROLES } from '@/src/constants/roles'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const news = await newsService.getById(id)
    return NextResponse.json({ success: true, data: news })
  } catch (error: any) {
    const status = error.statusCode || 500
    return NextResponse.json({ success: false, message: error.message }, { status })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole([ROLES.ADMIN, ROLES.SUPERADMIN])
    const { id } = params
    const formData = await req.formData()
    const rawData = formData.get('data')
    let body = {}
    try {
      body = rawData ? JSON.parse(rawData as string) : {}
    } catch {
      throw new Error('Invalid JSON format')
    }
    const imageFile = formData.get('image') as File | null
    let imageBase64: string | undefined
    if (imageFile) {
      if (!imageFile.type.startsWith('image/')) {
        throw new Error('File harus berupa gambar')
      }
      if (imageFile.size > 2 * 1024 * 1024) {
        throw new Error('Ukuran file maksimal 2MB')
      }
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      imageBase64 = `data:${imageFile.type};base64,${buffer.toString('base64')}`
    }
    const updated = await newsService.update(id, body, user.id, imageBase64)
    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    const status = error.statusCode || 400
    return NextResponse.json({ success: false, message: error.message }, { status })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole([ROLES.ADMIN, ROLES.SUPERADMIN])
    const { id } = params
    await newsService.delete(id, user.id)
    return NextResponse.json({ success: true, data: null })
  } catch (error: any) {
    const status = error.statusCode || 500
    return NextResponse.json({ success: false, message: error.message }, { status })
  }
}