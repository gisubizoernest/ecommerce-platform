import { prisma } from '../config/prisma'

export async function getDashboardStats() {
  const [totalOrders, totalProducts, totalUsers, orders] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.findMany({ where: { status: 'PAID' }, include: { items: { include: { product: true } } } }),
  ])

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0)

  const revenueByDay: Record<string, number> = {}
  orders.forEach((o) => {
    const day = o.createdAt.toISOString().slice(0, 10)
    revenueByDay[day] = (revenueByDay[day] || 0) + Number(o.total)
  })
  const revenueTrend = Object.entries(revenueByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, revenue]) => ({ date, revenue }))

  const productSales: Record<string, { name: string; qty: number; revenue: number }> = {}
  orders.forEach((o) => {
    o.items.forEach((item) => {
      const key = item.productId
      if (!productSales[key]) productSales[key] = { name: item.product.name, qty: 0, revenue: 0 }
      productSales[key].qty += item.quantity
      productSales[key].revenue += Number(item.price) * item.quantity
    })
  })
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  return { totalOrders, totalProducts, totalUsers, totalRevenue, revenueTrend, topProducts }
}

export const getAllOrders = () =>
  prisma.order.findMany({
    include: { user: true, items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })