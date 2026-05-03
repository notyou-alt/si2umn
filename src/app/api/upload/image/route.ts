import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/src/lib/cloudinary'
import { requireAuth } from '@/src/lib/auth'

export async function POST(req: NextRequest) {
  try {
    // Auth check
    await requireAuth()

    const formData = await req.formData()
    const file = formData.get('file')

    // Validate file existence & type
    if (!file || !(file instanceof File)) {
      throw new Error('No file uploaded')
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('File harus berupa gambar')
    }

    if (file.size > 2 * 1024 * 1024) {
      throw new Error('Ukuran file maksimal 2MB')
    }

    // Convert to base64
    const buffer = Buffer.from(await file.arrayBuffer())
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    // Upload
    let url: string
    try {
      const result = await uploadImage(base64, 'uploads')
      url = result.url
    } catch (err: any) {
      // ✅ preserve original error
      throw new Error(err?.message || 'Upload gagal')
    }

    return NextResponse.json({
      success: true,
      data: { url }
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Internal server error'
      },
      { status: 400 }
    )
  }
}