import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { getWishlist, addToWishlist, removeFromWishlist } from '../services/wishlist.service'

export async function listWishlist(req: AuthRequest, res: Response) {
  res.json(await getWishlist(req.user!.id))
}

export async function addWishlistItem(req: AuthRequest, res: Response) {
  const { productId } = req.body
  if (!productId) return res.status(400).json({ message: 'productId required' })
  res.status(201).json(await addToWishlist(req.user!.id, productId))
}

export async function removeWishlistItem(req: AuthRequest, res: Response) {
  await removeFromWishlist(req.user!.id, req.params.productId as string)
  res.status(204).send()
}