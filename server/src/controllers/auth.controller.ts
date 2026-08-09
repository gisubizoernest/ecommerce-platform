import { Request, Response } from 'express'
import { registerSchema, loginSchema } from '../validators/auth.validator'
import { registerUser, loginUser } from '../services/auth.service'

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() })

  try {
    const result = await registerUser(parsed.data.name, parsed.data.email, parsed.data.password)
    res.status(201).json(result)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() })

  try {
    const result = await loginUser(parsed.data.email, parsed.data.password)
    res.json(result)
  } catch (err: any) {
    res.status(401).json({ message: err.message })
  }
}