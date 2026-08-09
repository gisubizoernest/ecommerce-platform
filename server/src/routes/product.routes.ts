import { Router } from 'express'
import { listProducts, getProduct, addProduct, editProduct, removeProduct } from '../controllers/product.controller'
import { requireAuth, requireAdmin } from '../middleware/auth.middleware'

const router = Router()

router.get('/', listProducts)
router.get('/:slug', getProduct)
router.post('/', requireAuth, requireAdmin, addProduct)
router.put('/:id', requireAuth, requireAdmin, editProduct)
router.delete('/:id', requireAuth, requireAdmin, removeProduct)

export default router