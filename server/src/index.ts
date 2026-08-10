import dotenv from 'dotenv'
dotenv.config()
import checkoutRoutes from './routes/checkout.routes'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes'
import categoryRoutes from './routes/category.routes'
import productRoutes from './routes/product.routes'
import cartRoutes from './routes/cart.routes'
import adminRoutes from './routes/admin.routes'
import reviewRoutes from './routes/review.routes'
import wishlistRoutes from './routes/wishlist.routes'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/checkout', checkoutRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/wishlist', wishlistRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})