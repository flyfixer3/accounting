// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Col, Flex, Row } from 'antd'
import Card from 'antd/es/card/Card'
import Spacer from 'src/components/view/Spacer'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import moment from 'moment'
import { DATETIME_FORMATTER_ENUM, STOCK_ORDER_TYPE } from 'src/enums/enums'
import { ColumnsType } from 'antd/es/table'
import Table from 'src/components/table/Table'
import useStockOrderDetailController from '../controller/useStockOrderDetailController'
import {
  IStockOrderReceiveItemDetailData,
  IStockOrderSentItemDetailData,
} from 'src/models/stock-order.model'

import tableStyles from 'src/components/table/index.module.scss'

const TABLE_COLUMNS_SENT_ORDERS: ColumnsType<IStockOrderSentItemDetailData> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
  },
  {
    title: 'Quantity',
    dataIndex: 'qty',
    key: 'qty',
    align: 'center',
    render: (data) => parseInt(data || 0),
  },
  {
    title: 'Item List',
    key: 'itemNumberList',
    render: (value, record, index) => {
      const text = record?.itemNumberList?.join(', ')
      return <div>{text}</div>
    },
  },
  {
    title: 'Sent At',
    dataIndex: 'sendAt',
    key: 'sendAt',
    width: '150px',
    render: (data) =>
      data
        ? moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime)
        : '-',
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '150px',
    render: (data) =>
      data
        ? moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime)
        : '-',
  },
  {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: '150px',
    render: (data) =>
      data
        ? moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime)
        : '-',
  },
]

const TABLE_COLUMNS_RECEIVE_ORDERS: ColumnsType<IStockOrderReceiveItemDetailData> =
  [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: 'Quantity',
      dataIndex: 'qty',
      key: 'qty',
      align: 'center',
      render: (data) => parseInt(data || 0),
    },
    {
      title: 'Item List',
      key: 'itemNumberList',
      render: (value, record, index) => {
        const text = record?.itemNumberList?.join(', ')
        return <div>{text}</div>
      },
    },
    {
      title: 'Received At',
      dataIndex: 'receivedAt',
      key: 'receivedAt',
      width: '150px',
      render: (data) =>
        data
          ? moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime)
          : '-',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '150px',
      render: (data) =>
        data
          ? moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime)
          : '-',
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: '150px',
      render: (data) =>
        data
          ? moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime)
          : '-',
    },
  ]

const ReceiveOrderItemDetail = () => {
  const params = useParams()
  const { onSetBreadcrumbs } = useApp()

  const {
    isLoading,
    orderDetail,
    onRefetchOrderDetail,
    onHandleConfirmReceive,
  } = useStockOrderDetailController()

  const _getReceiveOrderTableColumns = useMemo(() => {
    if (orderDetail?.itemType === STOCK_ORDER_TYPE?.equipment) {
      const filteredColumns = TABLE_COLUMNS_RECEIVE_ORDERS.filter(
        (item) => item?.key && item?.key !== 'itemNumberList',
      )
      return filteredColumns
    }
    return TABLE_COLUMNS_RECEIVE_ORDERS
  }, [TABLE_COLUMNS_RECEIVE_ORDERS, orderDetail])

  const _getSentOrderTableColumns = useMemo(() => {
    if (orderDetail?.itemType === STOCK_ORDER_TYPE?.equipment) {
      const filteredColumns = TABLE_COLUMNS_SENT_ORDERS.filter(
        (item) => item?.key && item?.key !== 'itemNumberList',
      )
      return filteredColumns
    }
    return TABLE_COLUMNS_SENT_ORDERS
  }, [TABLE_COLUMNS_SENT_ORDERS, orderDetail])

  useEffect(() => {
    onSetBreadcrumbs([
      { title: 'Stock Order', path: '/stock-order/orders' },
      {
        title: 'Stock Order Detail',
        path: `/stock-order/orders/${params?.id}`,
      },
      {
        title: 'Receive Order Item Detail',
        path: `/stock-order/orders/${params?.id}/receive-order-item/detail/${params?.orderId}`,
      },
    ])
    onRefetchOrderDetail(parseInt(params?.orderId))
  }, [])

  const _onRenderActionTable = (data: IStockOrderSentItemDetailData) => {
    const isDisabled = data?.isConfirmed

    return (
      <Button
        onClick={() => {
          onHandleConfirmReceive(data)
        }}
        block
        disabled={isDisabled}
        className={
          isDisabled
            ? tableStyles?.actionColumnDetailBtnDisabled
            : tableStyles.actionColumnDetailBtn
        }>
        <Flex align="center" justify="center">
          <div
            className={
              isDisabled
                ? tableStyles?.actionColumnDetailTxtDisabled
                : tableStyles?.actionColumnDetailTxt
            }>
            Confirm Receive
          </div>
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
                <div className={'detail-title'}>
                  Stock Order Detail - Receive Order Item Detail
                </div>
              </Col>
            </Row>

            <Spacer margin={'.5rem'} />

            <DetailRow title={'Item ID'} value={orderDetail?.id || '-'} />

            <DetailRow
              title={'Item Name'}
              value={orderDetail?.itemName || '-'}
            />

            <DetailRow
              title={'Item Type'}
              value={
                orderDetail?.itemType === STOCK_ORDER_TYPE?.book
                  ? 'Book'
                  : orderDetail?.itemType === STOCK_ORDER_TYPE?.courseVoucher
                    ? 'Course Voucher'
                    : orderDetail?.itemType === STOCK_ORDER_TYPE?.equipment
                      ? 'Equipment'
                      : '-'
              }
            />

            <DetailRow
              title={'Order Quantity'}
              value={parseInt(orderDetail?.qty) || 0}
            />

            <DetailRow
              title={'Total Order Price'}
              value={moneyFormatter(parseFloat(orderDetail?.price) || 0)}
            />

            <DetailRow
              title={'Created At'}
              value={
                orderDetail?.createdAt
                  ? moment(orderDetail?.createdAt)?.format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />

            <DetailRow
              title={'Edited At'}
              value={
                orderDetail?.updatedAt
                  ? moment(orderDetail?.updatedAt)?.format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />
          </Card>
        </Col>
      </Row>

      <Spacer margin="1rem auto" />

      {orderDetail ? (
        <>
          <Row gutter={[8, 8]}>
            <Col xs={24}>
              <div className="section-title">Sent Order Items</div>
            </Col>
            <Col xs={24}>
              <Table
                loading={isLoading}
                columns={_getSentOrderTableColumns}
                data={orderDetail?.orderItemSentDetails}
                isAction
                rowKey={(data: IStockOrderSentItemDetailData) => data?.id}
                identifier={'id'}
                pagination={null}
                onRenderAction={(record: IStockOrderSentItemDetailData) =>
                  _onRenderActionTable(record)
                }
              />
            </Col>
          </Row>

          <Spacer margin="1rem auto" />

          <Row gutter={[8, 8]}>
            <Col xs={24}>
              <div className="section-title">Receive Order Items</div>
            </Col>
            <Col xs={24}>
              {' '}
              <Table
                loading={isLoading}
                columns={_getReceiveOrderTableColumns}
                data={orderDetail?.orderItemReceivedDetails}
                isAction
                rowKey={(data: IStockOrderReceiveItemDetailData) => data?.id}
                identifier={'id'}
                pagination={null}
              />
            </Col>
          </Row>
        </>
      ) : null}

      <Spacer margin="2rem auto" />
    </>
  )
}

export default ReceiveOrderItemDetail
