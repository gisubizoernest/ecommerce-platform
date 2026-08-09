import { prisma } from '../config/prisma'

export const getAllProducts = () =>
  prisma.product.findMany({ include: { category: true } })

export const getProductBySlug = (slug: string) =>
  prisma.product.findUnique({ where: { slug }, include: { category: true, reviews: true } })

export const createProduct = (data: any) => prisma.product.create({ data })