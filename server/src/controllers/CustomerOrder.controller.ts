import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { getUserOrders } from '../services/customerOrder.service'

export async function myOrders(req: AuthRequest, res: Response) {
  res.json(await getUserOrders(req.user!.id))
}