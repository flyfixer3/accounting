// @ts-nocheck
import { Button, Col, Flex, Row } from 'antd'
import Card from 'antd/es/card/Card'
import moment from 'moment'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import Spacer from 'src/components/view/Spacer'
import { useApp } from 'src/context/app.context'
import {
    DATETIME_FORMATTER_ENUM
} from 'src/enums/enums'
import useSupplierDetailController from '../controller/useSupplierDetailController'


const SupplierDetail = () => {
  const params = useParams()

  const { onSetBreadcrumbs } = useApp()

  const {
    detail,
    onRefetchDetail,
    onEditButtonClicked
  } = useSupplierDetailController()

  useEffect(() => {
    onSetBreadcrumbs([
      { title: 'Suppliers', path: '/suppliers' },
      { title: 'Supplier Detail', path: `/supplier/detail/${params?.supplierId}` },
    ])
    onRefetchDetail()
  }, [])

  return (
    <>
      <Row>
        <Col xs={24}>
          <Card>
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12}>
                <div className={'detail-title'}>Supplier Detail</div>
              </Col>

              <Col xs={24} sm={12}>
                <Flex justify='end'>
                  <Button 
                    type='primary'
                    onClick={() => onEditButtonClicked()}
                  >
                    Edit
                  </Button>
                </Flex>
              </Col>
            </Row>

            <Spacer margin={'.5rem'} />

            <DetailRow title={'Supplier ID'} value={detail?.id || '-'} />

            <DetailRow
              title={'Supplier Name'}
              value={detail?.supplierName || '-'}
            />

            <DetailRow
              title={'Supplier Address'}
              value={detail?.supplierAddress || '-'}
            />

            <DetailRow
              title={'Supplier Phone Number'}
              value={detail?.supplierPhoneNumber || '-'}
            />

            <DetailRow
              title={'Supplier Email'}
              value={detail?.supplierEmail || '-'}
            />

            <DetailRow
              title={'Supplier PIC Name'}
              value={detail?.supplierPicName || '-'}
            />

            <DetailRow
              title={'Supplier PIC Phone Number'}
              value={detail?.supplierPicPhoneNumber || '-'}
            />

            <DetailRow
              title={'Created At'}
              value={
                detail?.updatedAt
                  ? moment(detail?.createdAt)?.format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />

            <DetailRow
              title={'Updated At'}
              value={
                detail?.updatedAt
                  ? moment(detail?.updatedAt)?.format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />
          </Card>
        </Col>
      </Row>

      <Spacer margin="1rem auto" />
    </>
  )
}

export default SupplierDetail
