import dotenv from 'dotenv'
dotenv.config()

import { signToken, verifyToken } from '../src/utils/jwt'

describe('JWT utils', () => {
  it('signs and verifies a token correctly', () => {
    const payload = { id: 'user-123', role: 'CUSTOMER' }
    const token = signToken(payload)
    const decoded = verifyToken(token)

    expect(decoded.id).toBe(payload.id)
    expect(decoded.role).toBe(payload.role)
  })

  it('throws on an invalid token', () => {
    expect(() => verifyToken('not-a-real-token')).toThrow()
  })
})