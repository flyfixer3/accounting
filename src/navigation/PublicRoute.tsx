// @ts-nocheck
import { useAuth } from 'src/context/auth.context'

import { Navigate, Outlet } from 'react-router-dom'

const PublicRoute = () => {
  const { user, token } = useAuth()

  return user && token ? <Navigate to="/dashboard" /> : <Outlet />
}

export default PublicRoute
