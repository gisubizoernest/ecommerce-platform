import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
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
          <div key={c.label} className="border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <Link to="/admin/orders" className="text-sm font-medium text-gray-900 underline">View Orders</Link>
        <Link to="/admin/products/new" className="text-sm font-medium text-gray-900 underline">Add Product</Link>
        <Link to="/admin/products" className="text-sm font-medium text-gray-900 underline">Manage Products</Link>
        <Link to="/admin/customers" className="text-sm font-medium text-gray-900 underline">Manage Customers</Link> 
        <Link to="/admin/coupons" className="text-sm font-medium text-gray-900 underline">Manage Coupons</Link>.
      </div>
    </div>
  )
}