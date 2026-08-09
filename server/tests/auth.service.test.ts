import bcrypt from 'bcryptjs'

describe('password hashing', () => {
  it('hashes a password and can verify it', async () => {
    const password = 'password123'
    const hash = await bcrypt.hash(password, 10)

    expect(hash).not.toBe(password)
    const isValid = await bcrypt.compare(password, hash)
    expect(isValid).toBe(true)
  })

  it('rejects an incorrect password', async () => {
    const hash = await bcrypt.hash('correct-password', 10)
    const isValid = await bcrypt.compare('wrong-password', hash)
    expect(isValid).toBe(false)
  })
})