// @ts-nocheck
import { Col, Row } from 'antd'
import Card from 'antd/es/card/Card'
import moment from 'moment'
import { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import Spacer from 'src/components/view/Spacer'
import { useApp } from 'src/context/app.context'
import { DATETIME_FORMATTER_ENUM, SUPPLIER_ORDER_TYPE } from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import useSupplierReceiveOrderItemController from '../controller/useSupplierReceiveOrderItemController'
import BookForm from './components/BookForm'
import CourseVoucherForm from './components/CourseVoucherForm'
import EquipmentForm from './components/EquipmentForm'

const SupplierReceiveOrderItem = () => {
  const params = useParams()
  const location = useLocation()

  const { onSetBreadcrumbs } = useApp()

  const { selectedData, setSelectedData } =
    useSupplierReceiveOrderItemController()

  useEffect(() => {
    if (location?.state?.orderData) {
      setSelectedData(location?.state?.orderData)
    }
  }, [location?.state])

  useEffect(() => {
    onSetBreadcrumbs([
      { title: 'Supplier Order', path: '/supplier-order' },
      { title: 'Supplier Order Detail', path: `/supplier-order/${params?.id}` },
      {
        title: 'Receive Order Item',
        path: `/supplier-order/${params?.id}/receive-order-item/${params?.orderId}`,
      },
    ])
  }, [])
  return (
    <>
      <Row>
        <Col xs={24} sm={4} />
        <Col xs={24} sm={16}>
          <Card>
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={16}>
                <div className={'detail-title'}>Received Order Detail</div>
              </Col>
            </Row>

            <Spacer margin={'.5rem'} />

            <DetailRow
              title={'Order Detail ID'}
              value={selectedData?.id || '-'}
            />

            <DetailRow
              title={'Item Name'}
              value={selectedData?.itemName || '-'}
            />

            <DetailRow
              title={'Item Order Quantity'}
              value={parseInt(selectedData?.qty) || 0}
            />

            <DetailRow
              title={'Item Received Quantity'}
              value={selectedData?.receivedQty || 0}
            />

            <DetailRow
              title={'Item Price'}
              value={moneyFormatter(parseFloat(selectedData?.price) || 0)}
            />

            <DetailRow
              title={'Created At'}
              value={
                selectedData?.createdAt
                  ? moment(selectedData?.createdAt)?.format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />

            <DetailRow
              title={'Edited At'}
              value={
                selectedData?.updatedAt
                  ? moment(selectedData?.updatedAt)?.format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={4} />
      </Row>

      <Spacer margin="1rem auto" />

      <Row>
        <Col xs={24} sm={4} />
        <Col xs={24} sm={16}>
          <Card>
            {selectedData?.itemType === SUPPLIER_ORDER_TYPE?.book ? (
              <BookForm selectedData={selectedData} />
            ) : selectedData?.itemType ===
              SUPPLIER_ORDER_TYPE?.courseVoucher ? (
              <CourseVoucherForm selectedData={selectedData} />
            ) : selectedData?.itemType === SUPPLIER_ORDER_TYPE?.equipment ? (
              <EquipmentForm selectedData={selectedData} />
            ) : null}
          </Card>
        </Col>
        <Col xs={24} sm={4} />
      </Row>

      <Spacer margin="1rem auto" />
    </>
  )
}

export default SupplierReceiveOrderItem
