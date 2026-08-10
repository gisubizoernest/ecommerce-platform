import { Router } from 'express'
import multer from 'multer'
import { handleUpload } from '../controllers/upload.controller'
import { requireAuth, requireAdmin } from '../middleware/auth.middleware'

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })
const router = Router()

router.post('/', requireAuth, requireAdmin, upload.single('image'), handleUpload)

export default router