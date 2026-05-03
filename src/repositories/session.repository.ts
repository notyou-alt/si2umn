import { prisma } from '@/src/lib/prisma'
import { hashToken } from '@/src/lib/utils'

export const sessionRepository = {
  async create(userId: string, rawToken: string, expires: Date) {
    const hashedToken = hashToken(rawToken)
    return prisma.session.create({
      data: {
        sessionToken: hashedToken,
        userId,
        expires
      }
    })
  },
  async findByRawToken(rawToken: string) {
    const hashedToken = hashToken(rawToken)
    return prisma.session.findUnique({
      where: { sessionToken: hashedToken },
      include: { user: { include: { role: true } } }
    })
  },
  async deleteByRawToken(rawToken: string) {
    const hashedToken = hashToken(rawToken)
    return prisma.session.delete({ where: { sessionToken: hashedToken } })
  }
}
