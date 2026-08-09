import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

export function AdminRoute() {
  const user = useAuthStore((s) => s.user)

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />

  return <Outlet />
}