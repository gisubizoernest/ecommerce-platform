import { Router } from 'express'
import { stats, orders } from '../controllers/admin.controller'
import { listCustomers, removeCustomer } from '../controllers/adminCustomer.controller'
import { requireAuth, requireAdmin } from '../middleware/auth.middleware'

const router = Router()

router.use(requireAuth, requireAdmin)
router.get('/stats', stats)
router.get('/orders', orders)
router.get('/customers', listCustomers)
router.delete('/customers/:id', removeCustomer)

export default router