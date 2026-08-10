import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { createCheckoutSession, confirmOrder } from '../services/order.service'

export async function startCheckout(req: AuthRequest, res: Response) {
  const { addressId, couponCode } = req.body
  if (!addressId) return res.status(400).json({ message: 'addressId is required' })
  try {
    const url = await createCheckoutSession(req.user!.id, addressId, couponCode)
    res.json({ url })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export async function completeCheckout(req: AuthRequest, res: Response) {
  const { sessionId } = req.body
  if (!sessionId) return res.status(400).json({ message: 'sessionId is required' })
  try {
    const order = await confirmOrder(sessionId)
    res.json(order)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}