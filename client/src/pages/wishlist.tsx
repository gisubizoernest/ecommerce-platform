import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { api } from '../lib/axios'
import { useAuthStore } from '../store/auth.store'

export function Wishlist() {
  const { token } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: items, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => api.get('/wishlist').then((res) => res.data),
    enabled: !!token,
  })

  const removeMutation = useMutation({
    mutationFn: (productId: string) => api.delete(`/wishlist/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      toast.success('Removed from wishlist')
    },
  })

  if (!token) return <p className="text-center py-24 text-gray-500">Please sign in to view your wishlist.</p>
  if (isLoading) return <p>Loading...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>
      {items?.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {items?.map((item: any) => (
            <div key={item.id} className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
              <Link to={`/products/${item.product.slug}`}>
                <img src={item.product.images} className="w-full aspect-square object-cover" />
              </Link>
              <div className="p-3">
                <p className="text-sm font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-500">${item.product.price}</p>
                <button
                  onClick={() => removeMutation.mutate(item.productId)}
                  className="text-xs text-red-500 mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}