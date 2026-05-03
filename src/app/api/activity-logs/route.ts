import { NextRequest, NextResponse } from 'next/server'
import { activityLogRepository } from '@/src/repositories/log.repository'
import { requireRole } from '@/src/lib/auth'
import { ROLES } from '@/src/constants/roles'

export async function GET(req: NextRequest) {
  try {
    await requireRole([ROLES.ADMIN, ROLES.SUPERADMIN])
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit
    const [logs, total] = await Promise.all([
      activityLogRepository.findAll(skip, limit),
      activityLogRepository.count()
    ])
    return NextResponse.json({
      success: true,
      data: {
        data: logs,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      }
    })
  } catch (error: any) {
    const status = error.statusCode || 500
    return NextResponse.json({ success: false, message: error.message }, { status })
  }
}