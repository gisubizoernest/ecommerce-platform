import { Request, Response } from 'express'
import { getAllProducts, getProductBySlug, createProduct } from '../services/product.service'

export async function listProducts(_req: Request, res: Response) {
  const products = await getAllProducts()
  res.json(products)
}

export async function getProduct(req: Request, res: Response) {
 const product = await getProductBySlug(req.params.slug as string)
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json(product)
}

export async function addProduct(req: Request, res: Response) {
  try {
    const product = await createProduct(req.body)
    res.status(201).json(product)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}