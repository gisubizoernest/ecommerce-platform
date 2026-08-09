import { Router } from 'express'
import { stats, orders } from '../controllers/admin.controller'
import { requireAuth, requireAdmin } from '../middleware/auth.middleware'

const router = Router()

router.use(requireAuth, requireAdmin)
router.get('/stats', stats)
router.get('/orders', orders)

export default router