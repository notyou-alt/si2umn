import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  const body = await req.json()
  const { email, password, name } = body

  if (!email || !password) {
    return NextResponse.json({ error: "Data tidak lengkap" })
  }

  const existing = await prisma.user.findUnique({
    where: { email }
  })

  if (existing) {
    return NextResponse.json({ error: "Email sudah digunakan" })
  }

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name
    }
  })

  return NextResponse.json(user)
}