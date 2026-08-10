import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Star, Heart } from 'lucide-react'
import { api } from '../lib/axios'
import { useAuthStore } from '../store/auth.store'

export function ProductDetail() {
  const { slug } = useParams()
  const { token } = useAuthStore()
  const queryClient = useQueryClient()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}`).then((res) => res.data),
  })

  const { data: wishlist } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => api.get('/wishlist').then((res) => res.data),
    enabled: !!token,
  })
  const isWishlisted = wishlist?.some((w: any) => w.productId === product?.id)

  const addToCartMutation = useMutation({
    mutationFn: (productId: string) => api.post('/cart', { productId, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Added to cart')
    },
    onError: () => toast.error('Failed to add to cart'),
  })

  const wishlistMutation = useMutation({
    mutationFn: () =>
      isWishlisted
        ? api.delete(`/wishlist/${product.id}`)
        : api.post('/wishlist', { productId: product.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
    },
    onError: () => toast.error('Wishlist action failed'),
  })

  const reviewMutation = useMutation({
    mutationFn: () => api.post(`/reviews/${product.id}`, { rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', slug] })
      toast.success('Review submitted')
      setRating(0)
      setComment('')
    },
    onError: () => toast.error('Failed to submit review'),
  })

  if (isLoading) return <p>Loading...</p>
  if (!product) return <p>Product not found.</p>

  const reviews = product.reviews || []
  const avgRating = reviews.length
    ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length
    : 0

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <img src={product.images} alt={product.name} className="w-full rounded-xl object-cover aspect-square bg-gray-100" />
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={16} fill={i <= Math.round(avgRating) ? 'var(--color-star)' : 'none'} color="var(--color-star)" />
                ))}
              </div>
              <span className="text-sm text-gray-500">{avgRating.toFixed(1)} ({reviews.length} reviews)</span>
            </div>
          )}

          <p className="text-xl font-bold mt-3" style={{ color: 'var(--color-accent-dark)' }}>${product.price}</p>
          <p className="text-gray-500 mt-4">{product.description}</p>
          <p className="text-sm text-gray-400 mt-2">SKU: {product.sku} · Stock: {product.stock}</p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                if (!token) return toast.error('Please sign in first')
                addToCartMutation.mutate(product.id)
              }}
              className="text-white rounded-lg px-6 py-3 font-medium"
              style={{ background: 'var(--color-accent)' }}
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                if (!token) return toast.error('Please sign in first')
                wishlistMutation.mutate()
              }}
              className="rounded-lg px-4 py-3 border flex items-center justify-center"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <Heart size={20} fill={isWishlisted ? 'var(--color-accent)' : 'none'} color="var(--color-accent)" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t pt-8" style={{ borderColor: 'var(--color-border)' }}>
        <h2 className="text-xl font-bold mb-6">Customer Reviews</h2>

        {token && (
          <div className="border rounded-lg p-4 mb-8" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-sm font-medium mb-2">Leave a review</p>
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <button key={i} onClick={() => setRating(i)}>
                  <Star size={22} fill={i <= rating ? 'var(--color-star)' : 'none'} color="var(--color-star)" />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts (optional)"
              className="w-full border rounded-lg px-3 py-2 text-sm mb-3"
              style={{ borderColor: 'var(--color-border)' }}
            />
            <button
              onClick={() => {
                if (rating === 0) return toast.error('Please select a rating')
                reviewMutation.mutate()
              }}
              disabled={reviewMutation.isPending}
              className="text-white rounded-lg px-4 py-2 text-sm font-medium"
              style={{ background: 'var(--color-header)' }}
            >
              Submit Review
            </button>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this product.</p>
        ) : (
          <div className="space-y-5">
            {reviews.map((r: any) => (
              <div key={r.id} className="border-b pb-5" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={13} fill={i <= r.rating ? 'var(--color-star)' : 'none'} color="var(--color-star)" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{r.user.name}</span>
                </div>
                {r.comment && <p className="text-sm text-gray-600 mt-1.5">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}