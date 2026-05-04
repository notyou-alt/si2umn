import { NextResponse } from 'next/server'
import { curriculumTypeService } from '@/src/services/curriculum-type.service'

export async function GET() {
  try {
    const types = await curriculumTypeService.getAll()
    return NextResponse.json({ success: true, data: types })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}