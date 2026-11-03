import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="page-loading" role="status">A preparar a sua área…</div>
  if (!user) {
    const destination = `${location.pathname}${location.search}${location.hash}`
    return <Navigate to={`/entrar?destino=${encodeURIComponent(destination)}`} replace />
  }
  return <Outlet />
}
