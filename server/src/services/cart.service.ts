import { prisma } from '../config/prisma'

export const getCart = (userId: string) =>
  prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  })

export async function addToCart(userId: string, productId: string, quantity: number) {
  return prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: { quantity: { increment: quantity } },
    create: { userId, productId, quantity },
    include: { product: true },
  })
}

export const updateCartItem = (userId: string, productId: string, quantity: number) =>
  prisma.cartItem.update({
    where: { userId_productId: { userId, productId } },
    data: { quantity },
  })

export const removeFromCart = (userId: string, productId: string) =>
  prisma.cartItem.delete({
    where: { userId_productId: { userId, productId } },
  })