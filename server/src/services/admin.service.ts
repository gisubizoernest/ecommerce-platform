import { prisma } from '../config/prisma'

export async function getDashboardStats() {
  const [totalOrders, totalProducts, totalUsers, orders] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.findMany({ where: { status: 'PAID' } }),
  ])

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0)

  return { totalOrders, totalProducts, totalUsers, totalRevenue }
}

export const getAllOrders = () =>
  prisma.order.findMany({
    include: { user: true, items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })