// @ts-nocheck
import { Button, Col, Flex, Row } from 'antd'
import Card from 'antd/es/card/Card'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import tableStyles from 'src/components/table/index.module.scss'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import Spacer from 'src/components/view/Spacer'
import StatusBadge from 'src/components/view/StatusBadge'
import { useApp } from 'src/context/app.context'
import {
  DATETIME_FORMATTER_ENUM,
  STATUS_ENUM,
  STOCK_ORDER_TYPE,
} from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'

import { FiEye } from 'react-icons/fi'
import { appColors } from 'src/assets/styles/styles'
import Table from 'src/components/table/Table'

import { IStockOrderDetailsData } from 'src/models/stock-order.model'
import useStockOrderDetailController from '../controller/useStockOrderDetailController'
import PaymentModal from './PaymentModal'

const TABLE_COLUMNS: ColumnsType<IStockOrderDetailsData> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'itemName',
    key: 'itemName',
    render: (data) => data || '-',
    width: '250px',
    ellipsis: true,
  },
  {
    title: 'Type',
    dataIndex: 'itemType',
    key: 'itemType',
    render: (data) => {
      const text =
        data === STOCK_ORDER_TYPE?.book
          ? 'Book'
          : data === STOCK_ORDER_TYPE?.courseVoucher
            ? 'Course Voucher'
            : data === STOCK_ORDER_TYPE?.equipment
              ? 'Equipment'
              : '-'
      return text
    },
    width: '150px',
    ellipsis: true,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: (text, record, index) => {
      return `${moneyFormatter(text)}` || `Rp 0`
    },
    width: '150px',
    ellipsis: true,
  },
  {
    title: 'Quantity',
    dataIndex: 'qty',
    key: 'qty',
    align: 'center',
    render: (data) => parseInt(data || 0),
    width: 250,
  },
  {
    title: 'Received Quantity',
    dataIndex: 'receivedQty',
    key: 'receivedQty',
    align: 'center',
    render: (data) => parseInt(data || 0),
    width: 250,
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '200px',
    ellipsis: true,
    render: (data) =>
      data
        ? moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime)
        : '-',
  },
  {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: '200px',
    ellipsis: true,
    render: (data) =>
      data
        ? moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime)
        : '-',
  },
]

const StockOrderDetail = () => {
  const params = useParams()
  const navigate = useNavigate()

  const { onSetBreadcrumbs } = useApp()
  const [isOpenPaymentModal, setIsOpenPaymentModal] = useState(false)

  const { isLoading, detail, onRefetchDetail } = useStockOrderDetailController()

  useEffect(() => {
    onSetBreadcrumbs([
      { title: 'Stock Order', path: '/stock-order/orders' },
      {
        title: 'Stock Order Detail',
        path: `/stock-order/orders/${params?.id}`,
      },
    ])
    onRefetchDetail()
  }, [])

  const _onRenderActionBtn = (data: IStockOrderDetailsData) => {
    return (
      <Button
        onClick={() => {
          navigate(
            `/stock-order/orders/${params?.id}/receive-order-item/detail/${data?.id}`,
          )
        }}
        block
        className={tableStyles.actionColumnDetailBtn}>
        <Flex align="center" justify="center">
          <FiEye size={16} color={appColors?.blue70} />
          <Spacer margin="auto 2px" />
          <div className={tableStyles?.actionColumnDetailTxt}>Detail</div>
        </Flex>
      </Button>
    )
  }

  return (
    <>
      <Row>
        <Col xs={24}>
          <Card>
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={16}>
                <div className={'detail-title'}>Stock Order Detail</div>
              </Col>
              <Col sm={8} className="flex justify-end">
                {detail?.orderStatus === STATUS_ENUM.unpaid && (
                  <Button
                    type="primary"
                    onClick={() => setIsOpenPaymentModal(true)}>
                    Pay Order
                  </Button>
                )}
              </Col>
            </Row>

            <Spacer margin={'.5rem'} />

            <DetailRow title={'Order ID'} value={detail?.id || '-'} />

            <DetailRow
              title={'Total Order Price'}
              value={moneyFormatter(parseFloat(detail?.totalPrice) || 0)}
            />

            <DetailRow
              title={'Order Status'}
              renderValue={<StatusBadge status={detail?.orderStatus || '-'} />}
            />

            {detail?.orderStatus === STATUS_ENUM?.rejected ? (
              <DetailRow
                title={'Reject Reason'}
                value={detail?.rejectReason || '-'}
              />
            ) : null}

            <DetailRow
              title={'Created At'}
              value={
                detail?.createdAt
                  ? moment(detail?.createdAt)?.format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />

            <DetailRow
              title={'Edited At'}
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

      {detail ? (
        <Table
          loading={isLoading}
          columns={TABLE_COLUMNS}
          data={detail?.orderDetails}
          isAction
          onRenderAction={(record) => _onRenderActionBtn(record)}
          rowKey={(data: IStockOrderDetailsData) => data?.id}
          identifier={'id'}
          pagination={null}
        />
      ) : null}

      <Spacer margin="2rem auto" />
      <PaymentModal
        onSuccess={() => onRefetchDetail()}
        orderId={params?.id}
        isOpen={isOpenPaymentModal}
        close={() => setIsOpenPaymentModal(false)}
      />
    </>
  )
}

export default StockOrderDetail
