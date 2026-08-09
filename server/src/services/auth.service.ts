import bcrypt from 'bcryptjs'
import { prisma } from '../config/prisma'
import { signToken } from '../utils/jwt'

export async function registerUser(name: string, email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error('Email already in use')

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  })

  const token = signToken({ id: user.id, role: user.role })
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token }
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('Invalid credentials')

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw new Error('Invalid credentials')

  const token = signToken({ id: user.id, role: user.role })
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token }
}