import { prisma } from '../config/prisma'

export const getUserAddresses = (userId: string) =>
  prisma.address.findMany({ where: { userId }, orderBy: { isDefault: 'desc' } })

export const createAddress = (userId: string, data: any) =>
  prisma.address.create({ data: { ...data, userId } })

export const deleteAddress = (userId: string, id: string) =>
  prisma.address.deleteMany({ where: { id, userId } })