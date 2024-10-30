// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Col, Row } from 'antd'
import Card from 'antd/es/card/Card'
import Spacer from 'src/components/view/Spacer'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import moment from 'moment'
import {
  DATETIME_FORMATTER_ENUM,
  STOCK_ORDER_TYPE,
  SUPPLIER_ORDER_TYPE,
} from 'src/enums/enums'
import { ColumnsType } from 'antd/es/table'
import Table from 'src/components/table/Table'
import useOrderSendDetailController from '../controller/useOrderSendDetailController'
import { IIBOSendOrderItemReceivedDetail } from '@src/models/order.model'

const TABLE_COLUMNS: ColumnsType<IIBOSendOrderItemReceivedDetail> = [
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
    title: 'Send At',
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

const SendOrderDetail = () => {
  const params = useParams()
  const { onSetBreadcrumbs } = useApp()

  const { isLoading, detailData, onRefetchDetail } =
    useOrderSendDetailController()

  const _getTableColumns = useMemo(() => {
    if (
      detailData?.itemType === STOCK_ORDER_TYPE?.equipment ||
      detailData?.itemType === STOCK_ORDER_TYPE?.courseVoucher
    ) {
      const filteredColumns = TABLE_COLUMNS.filter(
        (item) => item?.key && item?.key !== 'itemNumberList',
      )
      return filteredColumns
    }
    return TABLE_COLUMNS
  }, [TABLE_COLUMNS, detailData])

  useEffect(() => {
    onSetBreadcrumbs([
      { title: 'TC Order', path: '/order' },
      {
        title: 'TC Order Detail',
        path: `/order/${params?.id}`,
      },
      {
        title: 'Send TC Order Detail',
        path: `/order/${params?.id}/send-order-detail/${params?.orderDetailId}`,
      },
    ])
    onRefetchDetail(parseInt(params?.orderDetailId))
  }, [])

  return (
    <>
      <Row>
        <Col xs={24}>
          <Card>
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={16}>
                <div className={'detail-title'}>
                  Order Detail - Send Order Item Detail
                </div>
              </Col>
            </Row>

            <Spacer margin={'.5rem'} />

            <DetailRow title={'Item ID'} value={detailData?.id || '-'} />

            <DetailRow
              title={'Item Name'}
              value={detailData?.itemName || '-'}
            />

            <DetailRow
              title={'Item Type'}
              value={
                detailData?.itemType === SUPPLIER_ORDER_TYPE?.book
                  ? 'Book'
                  : detailData?.itemType === SUPPLIER_ORDER_TYPE?.courseVoucher
                    ? 'Course Voucher'
                    : detailData?.itemType === SUPPLIER_ORDER_TYPE?.equipment
                      ? 'Equipment'
                      : '-'
              }
            />

            <DetailRow title={'Order Quantity'} value={detailData?.qty || 0} />

            <DetailRow
              title={'Total Order Price'}
              value={moneyFormatter(parseFloat(detailData?.price) || 0)}
            />

            <DetailRow
              title={'Created At'}
              value={
                detailData?.createdAt
                  ? moment(detailData?.createdAt)?.format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />

            <DetailRow
              title={'Edited At'}
              value={
                detailData?.updatedAt
                  ? moment(detailData?.updatedAt)?.format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />
          </Card>
        </Col>
      </Row>

      <Spacer margin="1rem auto" />

      {detailData ? (
        <Table
          loading={isLoading}
          columns={_getTableColumns}
          data={detailData?.orderItemReceivedDetails}
          isAction
          rowKey={(data: IIBOSendOrderItemReceivedDetail) => data?.id}
          identifier={'id'}
          pagination={null}
        />
      ) : null}

      <Spacer margin="2rem auto" />
    </>
  )
}

export default SendOrderDetail
