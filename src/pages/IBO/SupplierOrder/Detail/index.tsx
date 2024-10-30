// @ts-nocheck
import { Button, Col, Flex, Row } from 'antd'
import Card from 'antd/es/card/Card'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import { useEffect } from 'react'
import { FiEye } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { appColors } from 'src/assets/styles/styles'
import Table from 'src/components/table/Table'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import Spacer from 'src/components/view/Spacer'
import StatusBadge from 'src/components/view/StatusBadge'
import { useApp } from 'src/context/app.context'
import {
  DATETIME_FORMATTER_ENUM,
  PAYMENT_METHOD_TYPE_ENUM,
  STATUS_ENUM,
  SUPPLIER_ORDER_TYPE,
} from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import {
  ISupplierOrderDetailData,
  ISupplierOrderDetailResponse,
} from 'src/models/supplier.model'
import useSupplierDetailController from '../controller/useSupplierDetailController'

import tableStyles from 'src/components/table/index.module.scss'
import ModalUpdatePayment from '../components/ModalUpdatePayment'

const TABLE_COLUMNS: ColumnsType<ISupplierOrderDetailData> = [
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
    width: 250,
  },
  {
    title: 'Type',
    dataIndex: 'itemType',
    key: 'itemType',
    render: (data) => {
      const text =
        data === SUPPLIER_ORDER_TYPE?.book
          ? 'Book'
          : data === SUPPLIER_ORDER_TYPE?.courseVoucher
            ? 'Course Voucher'
            : data === SUPPLIER_ORDER_TYPE?.equipment
              ? 'Equipment'
              : '-'
      return text
    },
    width: 250,
  },
  {
    title: 'Purchase Price',
    dataIndex: 'price',
    key: 'price',
    render: (text, record, index) => {
      return `${moneyFormatter(text)}` || `Rp 0`
    },
  },
  {
    title: 'Selling Price',
    dataIndex: 'sellingPrice',
    key: 'sellingPrice',
    render: (text, record, index) => {
      return !text ? '-' : `${moneyFormatter(text)}` || '-'
    },
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

const SupplierDetail = () => {
  const params = useParams()
  const navigate = useNavigate()

  const { onSetBreadcrumbs } = useApp()

  const {
    isLoading,
    detail,
    isModalUpdatePaymentVisible,
    isSubmitted,
    formErrorMsg,
    onSetFormErrorMsg,
    onHandleReceivedBtn,
    onRefetchDetail,
    onHandleUpdatePaymentStatus,
    onHandleModalUpdatePaymentVisibility,
  } = useSupplierDetailController()

  useEffect(() => {
    onSetBreadcrumbs([
      { title: 'Supplier Order', path: '/supplier-order' },
      { title: 'Supplier Order Detail', path: `/supplier-order/${params?.id}` },
    ])
    onRefetchDetail()
  }, [])

  const _onRenderActionBtn = (
    data: ISupplierOrderDetailData,
    detail: ISupplierOrderDetailResponse,
  ) => {
    const isDisabled =
      detail?.paymentStatus === STATUS_ENUM?.unpaid ||
      parseInt(data?.qty) === data?.receivedQty
    console.log(isDisabled)

    return (
      <Flex>
        <Button
          onClick={() => {
            navigate(
              `/supplier-order/${params?.id}/receive-order-item/detail/${data?.id}`,
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

        <Spacer margin="0 8px" />

        <Button
          onClick={() => {
            onHandleReceivedBtn(data)
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
              Received
            </div>
          </Flex>
        </Button>
      </Flex>
    )
  }

  const _onRenderUpdatePaymentBtn =
    detail?.paymentStatus === STATUS_ENUM?.unpaid ? (
      <Flex justify="flex-end">
        <Button
          className={tableStyles.actionColumnDetailBtn}
          onClick={onHandleModalUpdatePaymentVisibility}>
          <div className={tableStyles?.actionColumnDetailTxt}>
            Update Payment Status
          </div>
        </Button>
      </Flex>
    ) : null

  return (
    <>
      <Row>
        <Col xs={24}>
          <Card>
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={16}>
                <div className={'detail-title'}>Supplier Order Detail</div>
              </Col>
              <Col xs={24} sm={8}>
                {_onRenderUpdatePaymentBtn}
              </Col>
            </Row>

            <Spacer margin={'.5rem'} />

            <DetailRow title={'Supplier Order ID'} value={detail?.id || '-'} />

            <DetailRow
              title={'Supplier Name'}
              value={detail?.supplier.supplierName || '-'}
            />

            <DetailRow
              title={'Total Order Price'}
              value={moneyFormatter(parseFloat(detail?.totalPrice) || 0)}
            />

            <DetailRow
              title={'Payment Status'}
              renderValue={
                <StatusBadge status={detail?.paymentStatus || '-'} />
              }
            />

            {detail?.paymentStatus === STATUS_ENUM?.paid ? (
              <>
                <DetailRow
                  title={'Payment Method'}
                  value={detail?.paymentMethod?.account_name_display}
                />

                {detail?.paymentMethod?.paymentType?.paymentTypeName ===
                PAYMENT_METHOD_TYPE_ENUM?.cashless ? (
                  <DetailRow title={'Bank'} value={detail?.bank?.bankName} />
                ) : null}
              </>
            ) : null}

            <DetailRow
              title={'Order Date'}
              value={
                detail?.createdAt
                  ? moment(detail?.orderDate)?.format(
                      DATETIME_FORMATTER_ENUM?.primary,
                    )
                  : '-'
              }
            />

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
          onRenderAction={(record) => _onRenderActionBtn(record, detail)}
          rowKey={(data: ISupplierOrderDetailData) => data?.id}
          identifier={'id'}
          pagination={null}
        />
      ) : null}

      <Spacer margin="2rem auto" />

      {isModalUpdatePaymentVisible ? (
        <ModalUpdatePayment
          isVisible={isModalUpdatePaymentVisible}
          handleClose={onHandleModalUpdatePaymentVisibility}
          isSubmitted={isSubmitted}
          formErrorMsg={formErrorMsg}
          onSetFormErrorMsg={onSetFormErrorMsg}
          selectedData={detail}
          onHandleSubmitPayment={onHandleUpdatePaymentStatus}
        />
      ) : null}
    </>
  )
}

export default SupplierDetail
