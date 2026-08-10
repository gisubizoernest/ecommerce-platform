import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { getUserAddresses, createAddress, deleteAddress } from '../services/address.service'

export async function listAddresses(req: AuthRequest, res: Response) {
  res.json(await getUserAddresses(req.user!.id))
}

export async function addAddress(req: AuthRequest, res: Response) {
  const { line1, city, state, postalCode, country } = req.body
  if (!line1 || !city || !state || !postalCode || !country) {
    return res.status(400).json({ message: 'All address fields are required' })
  }
  res.status(201).json(await createAddress(req.user!.id, req.body))
}

export async function removeAddress(req: AuthRequest, res: Response) {
  await deleteAddress(req.user!.id, req.params.id as string)
  res.status(204).send()
}