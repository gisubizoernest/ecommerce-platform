import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'
import { api } from '../lib/axios'

export function AdminCoupons() {
  const queryClient = useQueryClient()
  const [code, setCode] = useState('')
  const [discountPct, setDiscountPct] = useState('')

  const { data: coupons, isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: () => api.get('/coupons').then((res) => res.data),
  })

  const addMutation = useMutation({
    mutationFn: () => api.post('/coupons', { code, discountPct: Number(discountPct) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      toast.success('Coupon created')
      setCode('')
      setDiscountPct('')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create coupon'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/coupons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      toast.success('Coupon deleted')
    },
  })

  if (isLoading) return <p>Loading...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Discount Coupons</h1>

      <div className="flex gap-3 mb-8">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Coupon code (e.g. SAVE10)"
          className="border rounded-lg px-3 py-2 text-sm"
          style={{ borderColor: 'var(--color-border)' }}
        />
        <input
          value={discountPct}
          onChange={(e) => setDiscountPct(e.target.value)}
          type="number"
          placeholder="Discount %"
          className="border rounded-lg px-3 py-2 text-sm w-32"
          style={{ borderColor: 'var(--color-border)' }}
        />
        <button
          onClick={() => addMutation.mutate()}
          disabled={!code || !discountPct}
          className="text-white rounded-lg px-4 py-2 text-sm font-medium"
          style={{ background: 'var(--color-accent)' }}
        >
          Create Coupon
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
        <table className="w-full text-sm">
          <thead style={{ background: 'var(--color-bg)' }}>
            <tr className="text-left text-gray-500">
              <th className="p-3">Code</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons?.map((c: any) => (
              <tr key={c.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                <td className="p-3 font-mono font-medium">{c.code}</td>
                <td className="p-3">{c.discountPct}%</td>
                <td className="p-3">{c.isActive ? 'Active' : 'Inactive'}</td>
                <td className="p-3 text-right">
                  <button onClick={() => deleteMutation.mutate(c.id)} className="text-red-500 hover:text-red-700">
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