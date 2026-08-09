import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../lib/axios'
import { useAuthStore } from '../store/auth.store'

export function Cart() {
  const { token } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: items, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.get('/cart').then((res) => res.data),
    enabled: !!token,
  })

  const removeMutation = useMutation({
    mutationFn: (productId: string) => api.delete(`/cart/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Removed from cart')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      api.put('/cart', { productId, quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  if (!token) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-500">Please sign in to view your cart.</p>
        <Link to="/login" className="text-gray-900 font-medium underline mt-2 inline-block">Sign in</Link>
      </div>
    )
  }

  if (isLoading) return <p>Loading cart...</p>

  const total = items?.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0) || 0

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {items?.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items?.map((item: any) => (
            <div key={item.id} className="flex items-center gap-4 border border-gray-200 rounded-xl p-4">
              <img src={item.product.images} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-gray-500 text-sm">${item.product.price}</p>
              </div>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateMutation.mutate({ productId: item.productId, quantity: Number(e.target.value) })}
                className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-center"
              />
              <button
                onClick={() => removeMutation.mutate(item.productId)}
                className="text-red-500 text-sm font-medium hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="text-right text-xl font-bold pt-4">Total: ${total.toFixed(2)}</div>
        </div>
      )}
    </div>
  )
}