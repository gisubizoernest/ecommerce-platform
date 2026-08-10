import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { uploadImage } from '../services/upload.service'

export async function handleUpload(req: AuthRequest, res: Response) {
  if (!req.file) return res.status(400).json({ message: 'No file provided' })
  try {
    const url = await uploadImage(req.file.buffer)
    res.json({ url })
  } catch (err) {
    console.error('Upload error:', err)
    res.status(500).json({ message: 'Upload failed' })
  }
}