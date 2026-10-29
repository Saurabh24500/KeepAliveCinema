import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './auth-context'
import { AuthLoadingState } from './AuthLoadingState'

export function RequireAuth() {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <AuthLoadingState />
  }

  if (!session) {
    return <Navigate to="/signin" replace state={{ from: location }} />
  }

  return <Outlet />
}
