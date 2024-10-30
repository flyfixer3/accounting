// @ts-nocheck
import Login from 'src/pages/Login'

import { Navigate, Route, Routes } from 'react-router-dom'
import PublicRoute from './PublicRoute'

import { Suspense, useMemo } from 'react'
import MainLayout from 'src/components/layouts/main'
import PrintSalesInvoice from 'src/pages/Print/PrintSalesInvoice'
import ProtectedRoute from './ProtectedRoute'
import ProtectedRouteIBO from './ProtectedRouteIBO'
import { routes, routes_ibo } from './routes'

const NavigationRoutes = () => {
  const _renderRoutes = routes?.map((item, idx) => {
    const Component = item?.component
    return <Route key={item.key} path={item?.path} element={<Component />} />
  })

  const _renderRoutesIBO = routes_ibo?.map((item, idx) => {
    const Component = item?.component
    return <Route key={item.key} path={item?.path} element={<Component />} />
  })

  const getRoutes = useMemo(() => _renderRoutes, [])

  const getRoutesIBO = useMemo(() => _renderRoutesIBO, [])

  return (
    <Suspense>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>{getRoutes}</Route>
          <Route
            element={<PrintSalesInvoice />}
            key={'print-receipt-sales-invoice'}
            path={'/print/receipt/sales-invoice/:id'}
          />
        </Route>

        {/* public routes */}
        <Route path={'/login'} element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Suspense>
  )
}

export default NavigationRoutes
