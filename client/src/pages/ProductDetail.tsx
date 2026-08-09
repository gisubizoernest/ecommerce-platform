import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { api } from '../lib/axios'
import { useAuthStore } from '../store/auth.store'

export function ProductDetail() {
  const { slug } = useParams()
  const { token } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}`).then((res) => res.data),
  })

  const addToCartMutation = useMutation({
    mutationFn: (productId: string) => api.post('/cart', { productId, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Added to cart')
    },
    onError: () => toast.error('Failed to add to cart'),
  })

  if (isLoading) return <p>Loading...</p>
  if (!product) return <p>Product not found.</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <img src={product.images} alt={product.name} className="w-full rounded-xl object-cover aspect-square bg-gray-100" />
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-xl text-gray-700 mt-2">${product.price}</p>
        <p className="text-gray-500 mt-4">{product.description}</p>
        <p className="text-sm text-gray-400 mt-2">SKU: {product.sku} · Stock: {product.stock}</p>
        <button
          onClick={() => {
            if (!token) return toast.error('Please sign in first')
            addToCartMutation.mutate(product.id)
          }}
          className="mt-6 bg-gray-900 text-white rounded-lg px-6 py-3 font-medium hover:bg-gray-800"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}