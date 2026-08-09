import { Link } from 'react-router-dom'
import { ShoppingCart, User } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../store/auth.store'
import { api } from '../lib/axios'

export function Navbar() {
  const { user, token, logout } = useAuthStore()

  const { data: cartItems } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.get('/cart').then((res) => res.data),
    enabled: !!token,
  })

  const cartCount = cartItems?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-900">
          ShopHub
        </Link>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <Link to="/products" className="hover:text-gray-900">Products</Link>
          <Link to="/categories" className="hover:text-gray-900">Categories</Link>
          {user?.role === 'ADMIN' && (
  <Link to="/admin" className="hover:text-gray-900">Admin</Link>
)}
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative text-gray-600 hover:text-gray-900">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <button onClick={logout} className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Sign out
            </button>
          ) : (
            <Link to="/login" className="text-gray-600 hover:text-gray-900">
              <User size={20} />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}