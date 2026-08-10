import { Router } from 'express'
import { listAddresses, addAddress, removeAddress } from '../controllers/address.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()
router.use(requireAuth)
router.get('/', listAddresses)
router.post('/', addAddress)
router.delete('/:id', removeAddress)

export default router