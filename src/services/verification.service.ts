import { verificationTokenRepository } from '@/src/repositories/verification-token.repository'
import { userRepository } from '@/src/repositories/user.repository'
import { generateToken } from '@/src/lib/utils'
import { NotFoundError, AppError } from '@/src/lib/errors'

export const verificationService = {
  async sendVerification(email: string) {
    const user = await userRepository.findByEmail(email)
    if (!user) throw new NotFoundError('User tidak ditemukan')
    if (user.emailVerified) throw new AppError('Email sudah terverifikasi', 400)

    const token = generateToken(32)
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 jam

    await verificationTokenRepository.create(email, token, expires)

    // TODO: kirim email berisi link verifikasi dengan token
    console.log(`Verification link: /api/verification/confirm?email=${email}&token=${token}`)

    return { message: 'Verification email sent' }
  },

  async confirmVerification(email: string, token: string) {
    const record = await verificationTokenRepository.findUnique(email, token)
    if (!record || record.expires < new Date()) {
      throw new AppError('Token tidak valid atau kadaluwarsa', 400)
    }

    await userRepository.update(email, { emailVerified: new Date() })
    await verificationTokenRepository.delete(email, token)

    return { message: 'Email verified successfully' }
  }
}
