import { NextResponse } from 'next/server'
import { roleRepository } from '@/src/repositories/role.repository'
import { requireRole } from '@/src/lib/auth'
import { ROLES } from '@/src/constants/roles'

export async function GET() {
  try {
    await requireRole([ROLES.ADMIN, ROLES.SUPERADMIN])
    const roles = await roleRepository.findAll()
    return NextResponse.json({ success: true, data: roles })
  } catch (error: any) {
    const status = error.statusCode || 500
    return NextResponse.json({ success: false, message: error.message }, { status })
  }
}