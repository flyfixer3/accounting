// @ts-nocheck
import { USER_ROLE_ENUM } from 'src/enums/enums'
import { useAuth } from 'src/context/auth.context'
import DashboardTC from './components/DashboardTC'
import DashboardIBO from './components/DashboardIBO'

const Dashboard = () => {
  const { getUserRole } = useAuth()

  if (getUserRole === USER_ROLE_ENUM?.tc) return <DashboardTC />
  return <DashboardIBO />
}

export default Dashboard
