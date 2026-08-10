import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'
import { api } from '../lib/axios'

export function AdminCustomers() {
  const queryClient = useQueryClient()

  const { data: customers, isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: () => api.get('/admin/customers').then((res) => res.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/customers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] })
      toast.success('Customer removed')
    },
    onError: () => toast.error('Cannot delete a customer with existing orders'),
  })

  if (isLoading) return <p>Loading...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
        <table className="w-full text-sm">
          <thead style={{ background: 'var(--color-bg)' }}>
            <tr className="text-left text-gray-500">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Orders</th>
              <th className="p-3">Joined</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers?.map((c: any) => (
              <tr key={c.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-gray-500">{c.email}</td>
                <td className="p-3">{c._count.orders}</td>
                <td className="p-3 text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => {
                      if (confirm(`Remove customer "${c.name}"?`)) deleteMutation.mutate(c.id)
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}