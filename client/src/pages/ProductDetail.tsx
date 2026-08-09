import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'

export function ProductDetail() {
  const { slug } = useParams()
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}`).then((res) => res.data),
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
        <button className="mt-6 bg-gray-900 text-white rounded-lg px-6 py-3 font-medium hover:bg-gray-800">
          Add to Cart
        </button>
      </div>
    </div>
  )
}