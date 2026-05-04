import { NextRequest, NextResponse } from 'next/server'
import { uploadFile, deleteFile } from '@/src/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')

    // validasi file
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: 'File tidak valid' },
        { status: 400 }
      )
    }

    // validasi tipe file
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg']
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

    const url = await uploadFile(file, 'uploads')

    return NextResponse.json({
      success: true,
      data: { url }
    })

  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Internal Server Error'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const url = body?.url

    if (!url) {
      return NextResponse.json(
        { success: false, message: 'URL diperlukan' },
        { status: 400 }
      )
    }

    await deleteFile(url)

    return NextResponse.json({
      success: true
    })

  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Internal Server Error'
      },
      { status: 500 }
    )
  }
}