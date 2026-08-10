import { prisma } from '../config/prisma'

export const getWishlist = (userId: string) =>
  prisma.wishlistItem.findMany({ where: { userId }, include: { product: true } })

export const addToWishlist = (userId: string, productId: string) =>
  prisma.wishlistItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: {},
    create: { userId, productId },
  })

export const removeFromWishlist = (userId: string, productId: string) =>
  prisma.wishlistItem.delete({ where: { userId_productId: { userId, productId } } })