// @ts-nocheck
import './App.css'
import { AuthProvider } from './context/auth.context'
import NavigationRoutes from './navigation'

import './assets/styles/styles.scss'
import { AppProvider } from './context/app.context'

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <NavigationRoutes />
      </AuthProvider>
    </AppProvider>
  )
}

export default App
