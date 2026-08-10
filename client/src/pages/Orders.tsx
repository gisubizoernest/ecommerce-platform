import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'
import { useAuthStore } from '../store/auth.store'

export function Orders() {
  const { token } = useAuthStore()

  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.get('/my-orders').then((res) => res.data),
    enabled: !!token,
  })

  if (!token) return <p className="text-center py-24 text-gray-500">Please sign in to view your orders.</p>
  if (isLoading) return <p>Loading...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders?.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders?.map((o: any) => (
            <div key={o.id} className="border rounded-xl p-4" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold">Order #{o.id.slice(0, 8)}</p>
                  <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${Number(o.total).toFixed(2)}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--color-success)', color: 'white' }}>
                    {o.status}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500 border-t pt-2" style={{ borderColor: 'var(--color-border)' }}>
                {o.items.map((i: any) => (
                  <p key={i.id}>{i.quantity} × {i.product.name}</p>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Shipping to: {o.shippingLine1}, {o.shippingCity}, {o.shippingState} {o.shippingZip}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}