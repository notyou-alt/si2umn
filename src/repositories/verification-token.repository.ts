import { prisma } from '@/src/lib/prisma'

export const verificationTokenRepository = {
  async create(identifier: string, token: string, expires: Date) {
    return prisma.verificationToken.create({
      data: { identifier, token, expires }
    })
  },
  async findUnique(identifier: string, token: string) {
    return prisma.verificationToken.findUnique({
      where: { identifier_token: { identifier, token } }
    })
  },
  async delete(identifier: string, token: string) {
    return prisma.verificationToken.delete({
      where: { identifier_token: { identifier, token } }
    })
  }
}