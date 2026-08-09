import { Request, Response } from 'express'
import { getAllCategories, createCategory } from '../services/category.service'

export async function listCategories(_req: Request, res: Response) {
  const categories = await getAllCategories()
  res.json(categories)
}

export async function addCategory(req: Request, res: Response) {
  const { name, slug } = req.body
  if (!name || !slug) return res.status(400).json({ message: 'name and slug are required' })
  const category = await createCategory(name, slug)
  res.status(201).json(category)
}