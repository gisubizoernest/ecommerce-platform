import { Router } from 'express'
import { myOrders } from '../controllers/customerOrder.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()
router.get('/', requireAuth, myOrders)

export default router