import { prisma } from '../config/prisma'

interface ProductQuery {
  search?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  sort?: string
}

export const getAllProducts = (query: ProductQuery = {}) => {
  const { search, categoryId, minPrice, maxPrice, sort } = query

  const where: any = {}

  if (search) {
    where.name = { contains: search }
  }
  if (categoryId) {
    where.categoryId = categoryId
  }
  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) where.price.gte = minPrice
    if (maxPrice) where.price.lte = maxPrice
  }

  let orderBy: any = { createdAt: 'desc' }
  if (sort === 'price_asc') orderBy = { price: 'asc' }
  if (sort === 'price_desc') orderBy = { price: 'desc' }
  if (sort === 'name_asc') orderBy = { name: 'asc' }

  return prisma.product.findMany({ where, orderBy, include: { category: true } })
}

export const getProductBySlug = (slug: string) =>
  prisma.product.findUnique({
    where: { slug },
    include: { category: true, reviews: { include: { user: true } } },
  })

export const createProduct = (data: any) => prisma.product.create({ data })

export const updateProduct = (id: string, data: any) =>
  prisma.product.update({ where: { id }, data })

export const deleteProduct = (id: string) =>
  prisma.product.delete({ where: { id } })