import dotenv from 'dotenv'
dotenv.config()

import request from 'supertest'
import express from 'express'
import cors from 'cors'
import authRoutes from '../src/routes/auth.routes'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)

describe('Auth API', () => {
  const testEmail = `test-${Date.now()}@example.com`

  it('registers a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Jest Tester', email: testEmail, password: 'password123' })

    expect(res.status).toBe(201)
    expect(res.body.token).toBeDefined()
    expect(res.body.user.email).toBe(testEmail)
  })

  it('rejects login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'wrong-password' })

    expect(res.status).toBe(401)
  })

  it('logs in successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'password123' })

    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
  })
})