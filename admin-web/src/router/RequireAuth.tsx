import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import type { UserRole } from '../types'

export function RequireAuth({ role }: { role?: UserRole }) {
  const { token, user } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to="/login" replace />
  return <Outlet />
}
