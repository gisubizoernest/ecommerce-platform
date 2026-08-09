import { Router } from 'express'
import { startCheckout, completeCheckout } from '../controllers/checkout.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()

router.use(requireAuth)
router.post('/create-session', startCheckout)
router.post('/confirm', completeCheckout)

export default router