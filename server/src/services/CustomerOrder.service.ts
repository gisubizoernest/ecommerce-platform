import { prisma } from '../config/prisma'

export const getUserOrders = (userId: string) =>
  prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })