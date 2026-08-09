import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { getProductReviews, createReview, deleteReview } from '../services/review.service'

export async function listReviews(req: AuthRequest, res: Response) {
  const reviews = await getProductReviews(req.params.productId as string)
  res.json(reviews)
}

export async function addReview(req: AuthRequest, res: Response) {
  const { rating, comment } = req.body
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'rating must be 1-5' })
  const review = await createReview(req.user!.id, req.params.productId as string, rating, comment)
  res.status(201).json(review)
}

export async function removeReview(req: AuthRequest, res: Response) {
  await deleteReview(req.user!.id, req.params.reviewId as string)
  res.status(204).send()
}