import { Router } from 'express'
import { listReviews, addReview, removeReview } from '../controllers/review.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()

router.get('/:productId', listReviews)
router.post('/:productId', requireAuth, addReview)
router.delete('/:reviewId', requireAuth, removeReview)

export default router