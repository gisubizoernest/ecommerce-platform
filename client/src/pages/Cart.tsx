import { useState } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import { api } from '../lib/axios'
import { useAuthStore } from '../store/auth.store'

export function Cart() {
  const { token } = useAuthStore()
  const queryClient = useQueryClient()
  const [checkingOut, setCheckingOut] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm, setAddressForm] = useState({ line1: '', city: '', state: '', postalCode: '', country: '' })

  const { data: items, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.get('/cart').then((res) => res.data),
    enabled: !!token,
  })

  const { data: addresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => api.get('/addresses').then((res) => res.data),
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

  const addAddressMutation = useMutation({
    mutationFn: () => api.post('/addresses', addressForm),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      setSelectedAddressId(res.data.id)
      setShowAddressForm(false)
      setAddressForm({ line1: '', city: '', state: '', postalCode: '', country: '' })
      toast.success('Address saved')
    },
    onError: () => toast.error('Failed to save address'),
  })

  async function handleCheckout() {
    if (!selectedAddressId) return toast.error('Please select a delivery address')
    setCheckingOut(true)
    try {
      const res = await api.post('/checkout/create-session', { addressId: selectedAddressId })
      window.location.href = res.data.url
    } catch {
      toast.error('Failed to start checkout')
      setCheckingOut(false)
    }
  }

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items?.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4 border rounded-xl p-4" style={{ borderColor: 'var(--color-border)' }}>
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
                  className="w-16 border rounded-lg px-2 py-1 text-center"
                  style={{ borderColor: 'var(--color-border)' }}
                />
                <button onClick={() => removeMutation.mutate(item.productId)} className="text-red-500 text-sm font-medium hover:underline">
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="border rounded-xl p-5 h-fit" style={{ borderColor: 'var(--color-border)' }}>
            <p className="font-semibold mb-3">Delivery Address</p>

            {addresses?.length > 0 && (
              <div className="space-y-2 mb-3">
                {addresses.map((a: any) => (
                  <label key={a.id} className="flex items-start gap-2 border rounded-lg p-2.5 text-sm cursor-pointer" style={{ borderColor: selectedAddressId === a.id ? 'var(--color-accent)' : 'var(--color-border)' }}>
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === a.id}
                      onChange={() => setSelectedAddressId(a.id)}
                      className="mt-1"
                    />
                    <span>{a.line1}, {a.city}, {a.state} {a.postalCode}, {a.country}</span>
                  </label>
                ))}
              </div>
            )}

            {!showAddressForm ? (
              <button onClick={() => setShowAddressForm(true)} className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 mb-4">
                <Plus size={15} /> Add new address
              </button>
            ) : (
              <div className="space-y-2 mb-4">
                <input placeholder="Street address" value={addressForm.line1} onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })} className="w-full border rounded-lg px-3 py-1.5 text-sm" style={{ borderColor: 'var(--color-border)' }} />
                <input placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="w-full border rounded-lg px-3 py-1.5 text-sm" style={{ borderColor: 'var(--color-border)' }} />
                <input placeholder="State/Province" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="w-full border rounded-lg px-3 py-1.5 text-sm" style={{ borderColor: 'var(--color-border)' }} />
                <input placeholder="Postal code" value={addressForm.postalCode} onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })} className="w-full border rounded-lg px-3 py-1.5 text-sm" style={{ borderColor: 'var(--color-border)' }} />
                <input placeholder="Country" value={addressForm.country} onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} className="w-full border rounded-lg px-3 py-1.5 text-sm" style={{ borderColor: 'var(--color-border)' }} />
                <button
                  onClick={() => addAddressMutation.mutate()}
                  className="text-white rounded-lg px-3 py-1.5 text-sm font-medium"
                  style={{ background: 'var(--color-header)' }}
                >
                  Save Address
                </button>
              </div>
            )}

            <div className="border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
              <p className="text-xl font-bold mb-3">Total: ${total.toFixed(2)}</p>
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full text-white rounded-lg py-3 font-medium"
                style={{ background: 'var(--color-accent)' }}
              >
                {checkingOut ? 'Redirecting...' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}