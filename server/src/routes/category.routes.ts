import { Router } from 'express'
import { listCategories, addCategory } from '../controllers/category.controller'
import { requireAuth, requireAdmin } from '../middleware/auth.middleware'

const router = Router()

router.get('/', listCategories)
router.post('/', requireAuth, requireAdmin, addCategory)

export default router