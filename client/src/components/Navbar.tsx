import { Link } from 'react-router-dom'
import { ShoppingCart, User } from 'lucide-react'
import { useAuthStore } from '../store/auth.store'

export function Navbar() {
  const { user, logout } = useAuthStore()

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-900">
          ShopHub
        </Link>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <Link to="/products" className="hover:text-gray-900">Products</Link>
          <Link to="/categories" className="hover:text-gray-900">Categories</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/cart" className="text-gray-600 hover:text-gray-900">
            <ShoppingCart size={20} />
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