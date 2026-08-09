import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { api } from '../lib/axios'

export function CheckoutSuccess() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading')
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) return setStatus('error')

    api.post('/checkout/confirm', { sessionId })
      .then((res) => {
        setOrder(res.data)
        setStatus('done')
      })
      .catch(() => setStatus('error'))
  }, [searchParams])

  if (status === 'loading') return <p className="text-center py-24">Confirming your order...</p>
  if (status === 'error') return <p className="text-center py-24 text-red-500">Something went wrong confirming your order.</p>

  return (
    <div className="text-center py-24">
      <h1 className="text-3xl font-bold">Order confirmed 🎉</h1>
      <p className="text-gray-500 mt-2">Order #{order.id.slice(0, 8)} — total ${Number(order.total).toFixed(2)}</p>
      <Link to="/products" className="mt-6 inline-block bg-gray-900 text-white rounded-lg px-6 py-3 font-medium hover:bg-gray-800">
        Continue Shopping
      </Link>
    </div>
  )
}