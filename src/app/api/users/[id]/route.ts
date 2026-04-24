import { NextRequest, NextResponse } from 'next/server'
import { userService } from '@/src/services/user.service'
import { requireRole } from '@/src/lib/auth'
import { ROLES } from '@/src/constants/roles'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole([ROLES.ADMIN, ROLES.SUPERADMIN])
    const { id } = await params
    const user = await userService.getUserById(id)
    return NextResponse.json({ success: true, data: user })
  } catch (error: any) {
    const status = error.statusCode || 500
    return NextResponse.json({ success: false, message: error.message }, { status })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireRole([ROLES.ADMIN, ROLES.SUPERADMIN])
    const { id } = await params
    const body = await req.json()
    const updated = await userService.updateUser(id, body, actor.id)
    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    const status = error.statusCode || 400
    return NextResponse.json({ success: false, message: error.message }, { status })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireRole([ROLES.ADMIN, ROLES.SUPERADMIN])
    const { id } = await params
    await userService.deleteUser(id, actor.id)
    return NextResponse.json({ success: true, data: null })
  } catch (error: any) {
    const status = error.statusCode || 500
    return NextResponse.json({ success: false, message: error.message }, { status })
  }
}
