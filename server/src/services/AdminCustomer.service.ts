import { prisma } from '../config/prisma'

export const getAllCustomers = () =>
  prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

export const deleteCustomer = (id: string) => prisma.user.delete({ where: { id } })