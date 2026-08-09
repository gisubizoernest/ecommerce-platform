import { prisma } from '../config/prisma'

export const getProductReviews = (productId: string) =>
  prisma.review.findMany({
    where: { productId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })

export const createReview = (userId: string, productId: string, rating: number, comment?: string) =>
  prisma.review.upsert({
    where: { userId_productId: { userId, productId } },
    update: { rating, comment },
    create: { userId, productId, rating, comment },
  })

export const deleteReview = (userId: string, reviewId: string) =>
  prisma.review.deleteMany({ where: { id: reviewId, userId } })