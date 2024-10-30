// @ts-nocheck
import { useAuth } from 'src/context/auth.context'
import { Navigate, Outlet } from 'react-router-dom'
import { USER_ROLE_ENUM } from 'src/enums/enums'

type ProtectedRouteType = {
  role?: 'IBO' | 'TC'
}

const ProtectedRoute = (props: ProtectedRouteType) => {
  const { getUserData, isAuthenticated } = useAuth()

  const { user } = getUserData()

  if (props?.role) {
    if (isAuthenticated && user?.role === USER_ROLE_ENUM?.tc) {
      return <Outlet />
    } else {
      return <Navigate to={'/login'} />
    }
  } else {
    return isAuthenticated ? <Outlet /> : <Navigate to={'/login'} />
  }
}

export default ProtectedRoute
