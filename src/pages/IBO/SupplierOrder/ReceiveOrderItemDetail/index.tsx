// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Col, Flex, Row } from 'antd'
import Card from 'antd/es/card/Card'
import Spacer from 'src/components/view/Spacer'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import useSupplierDetailController from '../controller/useSupplierDetailController'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import moment from 'moment'
import { DATETIME_FORMATTER_ENUM, SUPPLIER_ORDER_TYPE } from 'src/enums/enums'
import { ColumnsType } from 'antd/es/table'
import { ISupplierOrderReceiveItemDetailData } from 'src/models/supplier.model'
import Table from 'src/components/table/Table'
import ModalUpdateBookNumberList from '../components/ModalUpdateBookNumberList'

import tableStyles from 'src/components/table/index.module.scss'
import { FiEdit } from 'react-icons/fi'
import { appColors } from 'src/assets/styles/styles'

const TABLE_COLUMNS: ColumnsType<ISupplierOrderReceiveItemDetailData> = [
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

const SupplierDetail = () => {
  const params = useParams()
  const { onSetBreadcrumbs } = useApp()

  const {
    isLoading,
    orderDetail,
    selectedData,
    isModalUpdateBookNumberListVisible,
    formErrorMsg,
    isSubmitted,
    onSetFormErrorMsg,
    onRefetchOrderDetail,
    setSelectedData,
    onHandleModalUpdateBookNumberListVisibility,
    onHandleUpdateBookNumberList,
  } = useSupplierDetailController()

  const _getTableColumns = useMemo(() => {
    if (orderDetail?.itemType === SUPPLIER_ORDER_TYPE?.equipment) {
      const filteredColumns = TABLE_COLUMNS.filter(
        (item) => item?.key && item?.key !== 'itemNumberList',
      )
      return filteredColumns
    }
    return TABLE_COLUMNS
  }, [TABLE_COLUMNS, orderDetail])

  const _onRenderActionTableBtn = (
    data: ISupplierOrderReceiveItemDetailData,
  ) => {
    return (
      <Button
        onClick={() => {
          setSelectedData(data)
          onHandleModalUpdateBookNumberListVisibility()
        }}
        block
        className={tableStyles.actionColumnDetailBtn}>
        <Flex align="center" justify="center">
          <FiEdit size={16} color={appColors?.blue70} />
          <Spacer margin="auto 2px" />
          <div className={tableStyles?.actionColumnDetailTxt}>
            Change Book Number
          </div>
        </Flex>
      </Button>
    )
  }

  useEffect(() => {
    onSetBreadcrumbs([
      { title: 'Supplier Order', path: '/supplier-order' },
      { title: 'Supplier Order Detail', path: `/supplier-order/${params?.id}` },
      {
        title: 'Receive Order Item Detail',
        path: `/supplier-order/${params?.id}/receive-order-item/detail/${params?.orderId}`,
      },
    ])
    onRefetchOrderDetail(parseInt(params?.orderId))
  }, [])

  return (
    <>
      <Row>
        <Col xs={24}>
          <Card>
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={16}>
                <div className={'detail-title'}>
                  Supplier Order Detail - Receive Order Item Detail
                </div>
              </Col>
            </Row>

            <Spacer margin={'.5rem'} />

            <DetailRow
              title={'Supplier Name'}
              value={orderDetail?.itemName || '-'}
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
        <Table
          loading={isLoading}
          columns={_getTableColumns}
          data={orderDetail?.orderItemReceivedDetails}
          isAction={orderDetail?.itemType === 'BOOK'}
          onRenderAction={(record: ISupplierOrderReceiveItemDetailData) =>
            orderDetail?.itemType === 'BOOK'
              ? _onRenderActionTableBtn(record)
              : null
          }
          rowKey={(data: ISupplierOrderReceiveItemDetailData) => data?.id}
          identifier={'id'}
          pagination={null}
        />
      ) : null}

      <Spacer margin="2rem auto" />

      {isModalUpdateBookNumberListVisible ? (
        <ModalUpdateBookNumberList
          isVisible={isModalUpdateBookNumberListVisible}
          handleClose={onHandleModalUpdateBookNumberListVisibility}
          onSubmit={onHandleUpdateBookNumberList}
          formErrorMsg={formErrorMsg}
          onSetFormErrorMsg={onSetFormErrorMsg}
          isSubmitted={isSubmitted}
          selectedData={selectedData}
        />
      ) : null}
    </>
  )
}

export default SupplierDetail
