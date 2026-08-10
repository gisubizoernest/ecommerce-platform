import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ShoppingCart, User, Search, ShieldCheck, Heart } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../store/auth.store'
import { api } from '../lib/axios'

export function Navbar() {
  const { user, token, logout } = useAuthStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const { data: cartItems } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.get('/cart').then((res) => res.data),
    enabled: !!token,
  })

  const cartCount = cartItems?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    navigate(`/products${search ? `?search=${encodeURIComponent(search)}` : ''}`)
  }

  return (
    <header className="sticky top-0 z-50" style={{ background: 'var(--color-header)' }}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-6">
        <Link to="/" className="text-white text-xl font-extrabold tracking-tight shrink-0">
          Shop<span style={{ color: 'var(--color-accent)' }}>Hub</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, brands and categories"
            className="w-full rounded-l-md px-4 py-2 text-sm text-gray-900 outline-none"
          />
          <button
            type="submit"
            className="rounded-r-md px-4 flex items-center justify-center"
            style={{ background: 'var(--color-accent)' }}
          >
            <Search size={18} className="text-white" />
          </button>
        </form>

        <nav className="hidden lg:flex gap-6 text-sm font-medium text-gray-200 shrink-0">
          <Link to="/products" className="hover:text-white transition-colors">All Products</Link>
          <Link to="/categories" className="hover:text-white transition-colors">Categories</Link>
          {user?.role === 'ADMIN' && (
            <Link to="/admin" className="hover:text-white transition-colors flex items-center gap-1">
              <ShieldCheck size={15} /> Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-5 shrink-0 ml-auto">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-300 hidden sm:block">
                Hi, <span className="font-semibold text-white">{user.name.split(' ')[0]}</span>
              </span>
              <button onClick={logout} className="text-xs font-medium text-gray-300 hover:text-white transition-colors">
                Sign out
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1.5 text-gray-200 hover:text-white transition-colors">
              <User size={19} />
              <span className="text-xs font-medium hidden sm:block">Sign in</span>
            </Link>
          )}
          <Link to="/wishlist" className="text-gray-200 hover:text-white transition-colors">
            <Heart size={20} />
          </Link>
          <Link to="/cart" className="relative flex items-center gap-1.5 text-gray-200 hover:text-white transition-colors">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center"
                style={{ background: 'var(--color-accent)' }}
              >
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex gap-4 overflow-x-auto text-xs text-gray-300">
          <span className="whitespace-nowrap">Free shipping on orders over $50</span>
          <span className="whitespace-nowrap">•</span>
          <span className="whitespace-nowrap">30-day returns</span>
          <span className="whitespace-nowrap">•</span>
          <span className="whitespace-nowrap">Secure checkout via Stripe</span>
        </div>
      </div>
    </header>
  )
}