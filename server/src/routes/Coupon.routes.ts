import { Router } from 'express'
import { listCoupons, addCoupon, removeCoupon, checkCoupon } from '../controllers/coupon.controller'
import { requireAuth, requireAdmin } from '../middleware/auth.middleware'

const router = Router()

router.post('/validate', requireAuth, checkCoupon)
router.get('/', requireAuth, requireAdmin, listCoupons)
router.post('/', requireAuth, requireAdmin, addCoupon)
router.delete('/:id', requireAuth, requireAdmin, removeCoupon)

export default router