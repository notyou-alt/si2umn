import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/src/services/auth.service'  // perbaiki path jika perlu

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const { user, sessionToken } = await authService.login(body, ip)
    const response = NextResponse.json({ success: true, data: user })
    response.cookies.set('sessionToken', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })
    return response
  } catch (error: any) {
    const status = error.statusCode || 400
    return NextResponse.json({ success: false, message: error.message }, { status })
  }
}

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Login menggunakan email dan password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login berhasil
 *       401:
 *         description: Email atau password salah
 */