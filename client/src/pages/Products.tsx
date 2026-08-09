import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'

export function Products() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/products').then((res) => res.data),
  })

  if (isLoading) return <p>Loading products...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      {data?.length === 0 ? (
        <p className="text-gray-500">No products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data?.map((p: any) => (
            <div key={p.id} className="border border-gray-200 rounded-xl p-4">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-gray-500 text-sm">${p.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}