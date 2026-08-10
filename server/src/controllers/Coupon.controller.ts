import { Request, Response } from 'express'
import { getAllCoupons, createCoupon, deleteCoupon, validateCoupon } from '../services/coupon.service'

export async function listCoupons(_req: Request, res: Response) {
  res.json(await getAllCoupons())
}

export async function addCoupon(req: Request, res: Response) {
  const { code, discountPct, expiresAt } = req.body
  if (!code || !discountPct) return res.status(400).json({ message: 'code and discountPct are required' })
  try {
    const coupon = await createCoupon(code, discountPct, expiresAt)
    res.status(201).json(coupon)
  } catch (err: any) {
    res.status(400).json({ message: 'Coupon code already exists' })
  }
}

export async function removeCoupon(req: Request, res: Response) {
  await deleteCoupon(req.params.id as string)
  res.status(204).send()
}

export async function checkCoupon(req: Request, res: Response) {
  try {
    const coupon = await validateCoupon(req.body.code)
    res.json(coupon)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}