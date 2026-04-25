import { NextRequest, NextResponse } from 'next/server'
import { userService } from '@/src/services/user.service'
import { requireRole } from '@/src/lib/auth'
import { ROLES } from '@/src/constants/roles'

export async function GET(req: NextRequest) {
  try {
    await requireRole([ROLES.ADMIN, ROLES.SUPERADMIN])
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const result = await userService.getAllUsers(page, limit)
    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    const status = error.message === 'UNAUTHORIZED' ? 401 : error.message === 'FORBIDDEN' ? 403 : 500
    const message = error.message === 'UNAUTHORIZED' ? 'Unauthorized' : error.message === 'FORBIDDEN' ? 'Forbidden' : error.message || 'Failed to fetch users'
    return NextResponse.json({ success: false, message }, { status })
  }
}

export async function POST(req: NextRequest) {
  try {
    const actor = await requireRole([ROLES.ADMIN, ROLES.SUPERADMIN]) 
    const body = await req.json()
    const newUser = await userService.createUser(body, actor.id)
    return NextResponse.json({ success: true, data: newUser }, { status: 201 })
  } catch (error: any) {
    const status = error.message === 'FORBIDDEN' ? 403 : error.message === 'Email sudah terdaftar' ? 409 : 400
    return NextResponse.json({ success: false, message: error.message }, { status })
  }
}