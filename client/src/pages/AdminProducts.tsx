import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Pencil, Trash2 } from 'lucide-react'
import { api } from '../lib/axios'

export function AdminProducts() {
  const queryClient = useQueryClient()

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/products').then((res) => res.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product deleted')
    },
    onError: () => toast.error('Failed to delete product'),
  })

  if (isLoading) return <p>Loading...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Link
          to="/admin/products/new"
          className="text-white text-sm font-medium rounded-lg px-4 py-2"
          style={{ background: 'var(--color-accent)' }}
        >
          + Add Product
        </Link>
      </div>

      <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
        <table className="w-full text-sm">
          <thead style={{ background: 'var(--color-bg)' }}>
            <tr className="text-left text-gray-500">
              <th className="p-3">Product</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">SKU</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p: any) => (
              <tr key={p.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                <td className="p-3 flex items-center gap-3">
                  <img src={p.images} className="w-10 h-10 rounded object-cover bg-gray-100" />
                  {p.name}
                </td>
                <td className="p-3">${Number(p.price).toFixed(2)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3 text-gray-500">{p.sku}</td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link to={`/admin/products/${p.id}/edit`} className="text-gray-500 hover:text-gray-900">
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${p.name}"?`)) deleteMutation.mutate(p.id)
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}