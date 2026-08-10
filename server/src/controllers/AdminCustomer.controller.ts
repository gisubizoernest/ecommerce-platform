import { Request, Response } from 'express'
import { getAllCustomers, deleteCustomer } from '../services/adminCustomer.service'

export async function listCustomers(_req: Request, res: Response) {
  res.json(await getAllCustomers())
}

export async function removeCustomer(req: Request, res: Response) {
  try {
    await deleteCustomer(req.params.id as string)
    res.status(204).send()
  } catch (err: any) {
    res.status(400).json({ message: 'Cannot delete customer with existing orders' })
  }
}