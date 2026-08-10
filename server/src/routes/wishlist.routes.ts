import { Router } from 'express'
import { listWishlist, addWishlistItem, removeWishlistItem } from '../controllers/wishlist.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()
router.use(requireAuth)
router.get('/', listWishlist)
router.post('/', addWishlistItem)
router.delete('/:productId', removeWishlistItem)

export default router