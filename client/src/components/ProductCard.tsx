import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'

interface ProductCardProps {
  product: {
    id: string
    slug: string
    name: string
    price: number | string
    discount?: number | string | null
    images: string
    reviews?: { rating: number }[]
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const price = Number(product.price)
  const discount = product.discount ? Number(product.discount) : 0
  const finalPrice = discount ? price - (price * discount) / 100 : price

  const reviews = product.reviews || []
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group bg-white rounded-lg border overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={product.images}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <span
            className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded"
            style={{ background: 'var(--color-accent)' }}
          >
            -{discount}%
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.name}
        </h3>

        {reviews.length > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={12}
                fill={i <= Math.round(avgRating) ? 'var(--color-star)' : 'none'}
                color="var(--color-star)"
              />
            ))}
            <span className="text-xs text-gray-400 ml-1">({reviews.length})</span>
          </div>
        )}

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-bold" style={{ color: 'var(--color-accent-dark)' }}>
            ${finalPrice.toFixed(2)}
          </span>
          {discount > 0 && (
            <span className="text-xs text-gray-400 line-through">${price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}