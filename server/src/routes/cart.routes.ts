import { Router } from 'express'
import { listCart, addItem, updateItem, removeItem } from '../controllers/cart.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()

router.use(requireAuth)
router.get('/', listCart)
router.post('/', addItem)
router.put('/', updateItem)
router.delete('/:productId', removeItem)

export default router