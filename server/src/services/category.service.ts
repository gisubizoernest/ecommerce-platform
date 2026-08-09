import { prisma } from '../config/prisma'

export const getAllCategories = () => prisma.category.findMany()

export const createCategory = (name: string, slug: string) =>
  prisma.category.create({ data: { name, slug } })