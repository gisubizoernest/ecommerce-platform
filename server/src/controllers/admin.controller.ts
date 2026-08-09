import { Request, Response } from 'express'
import { getDashboardStats, getAllOrders } from '../services/admin.service'

export async function stats(_req: Request, res: Response) {
  const data = await getDashboardStats()
  res.json(data)
}

export async function orders(_req: Request, res: Response) {
  const data = await getAllOrders()
  res.json(data)
}