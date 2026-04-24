import { prisma } from '@/src/lib/prisma' 
import { RoleName } from '@prisma/client'

export const roleRepository = {
  async findByName(name: RoleName | string) {
    return prisma.role.findFirst({
      where: { role_name: name as RoleName }
    })
  },

  async findAll() {
    return prisma.role.findMany()
  },

  async getDefaultRole() {
    return this.findByName('user')
  }
}