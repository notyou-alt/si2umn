import { NextRequest, NextResponse } from 'next/server'
import { testimonyService } from '@/src/services/testimony.service'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const result = await testimonyService.getAllPublic(page, limit)
    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    let userId: string | undefined
    try {
      const { requireAuth } = await import('@/src/lib/auth')
      const user = await requireAuth()
      userId = user.id
    } catch {
      // anonymous
    }
    const formData = await req.formData()
    const rawData = formData.get('data')
    let body = {}
    try {
      body = rawData ? JSON.parse(rawData as string) : {}
    } catch {
      throw new Error('Invalid JSON format')
    }
    const imageFile = formData.get('photo') as File | null
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
    const testimony = await testimonyService.create(body, userId, imageBase64)
    return NextResponse.json({ success: true, data: testimony }, { status: 201 })
  } catch (error: any) {
    const status = error.statusCode || 400
    return NextResponse.json({ success: false, message: error.message }, { status })
  }
}