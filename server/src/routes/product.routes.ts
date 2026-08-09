import { Router } from 'express'
import { listProducts, getProduct, addProduct } from '../controllers/product.controller'
import { requireAuth, requireAdmin } from '../middleware/auth.middleware'

const router = Router()

router.get('/', listProducts)
router.get('/:slug', getProduct)
router.post('/', requireAuth, requireAdmin, addProduct)

export default router