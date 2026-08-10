import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { api } from '../lib/axios'

export function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/stats').then((res) => res.data),
  })

  if (isLoading) return <p>Loading dashboard...</p>

  const cards = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}` },
    { label: 'Total Orders', value: stats.totalOrders },
    { label: 'Total Products', value: stats.totalProducts },
    { label: 'Total Users', value: stats.totalUsers },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="border rounded-xl p-5" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 border rounded-xl p-5" style={{ borderColor: 'var(--color-border)' }}>
          <p className="font-semibold mb-4">Revenue Trend</p>
          {stats.revenueTrend.length === 0 ? (
            <p className="text-sm text-gray-400">No sales data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats.revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-accent)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="border rounded-xl p-5" style={{ borderColor: 'var(--color-border)' }}>
          <p className="font-semibold mb-4">Top Products</p>
          {stats.topProducts.length === 0 ? (
            <p className="text-sm text-gray-400">No sales data yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.topProducts.map((p: any, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700">{p.name}</span>
                  <span className="font-medium">${p.revenue.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link to="/admin/orders" className="text-sm font-medium text-gray-900 underline">View Orders</Link>
        <Link to="/admin/products" className="text-sm font-medium text-gray-900 underline">Manage Products</Link>
        <Link to="/admin/products/new" className="text-sm font-medium text-gray-900 underline">Add Product</Link>
        <Link to="/admin/customers" className="text-sm font-medium text-gray-900 underline">Manage Customers</Link>
        <Link to="/admin/coupons" className="text-sm font-medium text-gray-900 underline">Manage Coupons</Link>
      </div>
    </div>
  )
}