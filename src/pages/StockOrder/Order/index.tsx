// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { useEffect } from 'react'
import { Col, Row } from 'antd'
import OrderListSection from './components/OrderListSection'
import { StockOrderProvider } from '../context/stock-order.context'

const StockOrder = () => {
  // book order to IBO

  const { onSetBreadcrumbs } = useApp()
  useEffect(() => {
    onSetBreadcrumbs([{ title: 'Stock Order', path: '/stock-order/buy-stock' }])
  }, [])

  return (
    <StockOrderProvider>
      <Row gutter={[8, 8]}>
        <Col xs={24} md={24}>
          <OrderListSection />
        </Col>
      </Row>
    </StockOrderProvider>
  )
}

export default StockOrder
