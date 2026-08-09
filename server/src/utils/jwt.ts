import jwt from 'jsonwebtoken'

export function signToken(payload: { id: string; role: string }) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string }
}