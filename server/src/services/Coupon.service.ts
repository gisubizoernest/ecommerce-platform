import { prisma } from '../config/prisma'

export const getAllCoupons = () => prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })

export const createCoupon = (code: string, discountPct: number, expiresAt?: string) =>
  prisma.coupon.create({
    data: { code: code.toUpperCase(), discountPct, expiresAt: expiresAt ? new Date(expiresAt) : null },
  })

export const deleteCoupon = (id: string) => prisma.coupon.delete({ where: { id } })

export async function validateCoupon(code: string) {
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } })
  if (!coupon || !coupon.isActive) throw new Error('Invalid coupon code')
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new Error('Coupon has expired')
  return coupon
}