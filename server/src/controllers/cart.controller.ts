import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { getCart, addToCart, updateCartItem, removeFromCart } from '../services/cart.service'

export async function listCart(req: AuthRequest, res: Response) {
  const items = await getCart(req.user!.id)
  res.json(items)
}

export async function addItem(req: AuthRequest, res: Response) {
  const { productId, quantity } = req.body
  if (!productId) return res.status(400).json({ message: 'productId is required' })
  const item = await addToCart(req.user!.id, productId, quantity || 1)
  res.status(201).json(item)
}

export async function updateItem(req: AuthRequest, res: Response) {
  const { productId, quantity } = req.body
  if (!productId || quantity == null) return res.status(400).json({ message: 'productId and quantity are required' })
  const item = await updateCartItem(req.user!.id, productId, quantity)
  res.json(item)
}

export async function removeItem(req: AuthRequest, res: Response) {
  await removeFromCart(req.user!.id, req.params.productId)
  res.status(204).send()
}