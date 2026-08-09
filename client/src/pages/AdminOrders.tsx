import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'

export function AdminOrders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.get('/admin/orders').then((res) => res.data),
  })

  if (isLoading) return <p>Loading orders...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o: any) => (
            <div key={o.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Order #{o.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">{o.user.name} · {o.user.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${Number(o.total).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{o.status}</p>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-500">
                {o.items.map((i: any) => (
                  <p key={i.id}>{i.quantity} × {i.product.name}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}