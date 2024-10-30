// @ts-nocheck
import Spacer from 'src/components/view/Spacer'
import { useApp } from 'src/context/app.context'
import { Card, Col, Row } from 'antd'
import { useEffect } from 'react'
import FormAddSupplierOrder from './components/FormAddSupplierOrder'

const SupplierOrderAdd = () => {
  const { onSetBreadcrumbs } = useApp()

  useEffect(() => {
    onSetBreadcrumbs([
      { title: 'Supplier Order', path: '/supplier-order' },
      { title: 'Add Supplier Order', path: `/supplier-order/add` },
    ])
  }, [])
  return (
    <>
      <Row>
        <Col xs={24} sm={5} />
        <Col xs={24} sm={14}>
          <Row>
            <Col xs={24}>
              <div className={'add-section-title'}>Add New Supplier Order</div>
            </Col>
          </Row>

          <Spacer margin={'.5rem auto'} />

          <Card>
            <FormAddSupplierOrder />
          </Card>
        </Col>
        <Col xs={24} sm={5} />
      </Row>

      <Spacer margin={'1rem auto'} />
    </>
  )
}

export default SupplierOrderAdd
