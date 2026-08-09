import { Request, Response } from 'express'
import {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/product.service'

export async function listProducts(req: Request, res: Response) {
  const { search, categoryId, minPrice, maxPrice, sort } = req.query

  const products = await getAllProducts({
    search: search as string,
    categoryId: categoryId as string,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort: sort as string,
  })
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

export async function editProduct(req: Request, res: Response) {
  try {
    const product = await updateProduct(req.params.id as string, req.body)
    res.json(product)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export async function removeProduct(req: Request, res: Response) {
  try {
    await deleteProduct(req.params.id as string)
    res.status(204).send()
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}