// @ts-nocheck
import { Button, Card, Col, Flex, Row } from 'antd'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import { useEffect } from 'react'
import { FiEdit, FiEye } from 'react-icons/fi'
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

import tableStyles from 'src/components/table/index.module.scss'
import {
  IIBOOrderDetailResponse,
  IIBOOrderDetails,
} from 'src/models/order.model'
import ModalSendItem from '../components/ModalSendItem'
import useOrderDetailController from '../controller/useOrderDetailController'
import ModalUpdateStatus from './ModalUpdateStatus'

const OrderDetail = () => {
  const navigate = useNavigate()
  const params = useParams()

  const { onSetBreadcrumbs } = useApp()

  const {
    detailData,
    statusListOptions,
    isLoading,
    isModalUpdateStatusVisible,
    isSubmitted,
    formErrorMsg,
    getTotalQtyAndPrice,
    isModalSendItemVisible,
    selectedItem,
    onHandleSendItemBtn,
    setFormErrorMsg,
    handleModalUpdateStatusVisibility,
    handleSubmitUpdateStatus,
    handleModalSendItemVisibility,
    onHandleSubmitSendItem,
    onSetFormErrorMsg,
  } = useOrderDetailController()

  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'TC Order List',
        path: '/order',
      },
      {
        title: 'TC Order Detail',
        path: `/order/${params?.id}`,
      },
    ])
  }, [])

  const TABLE_COLUMNS: ColumnsType<IIBOOrderDetails> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',

      render: (data) => data || '-',
    },
    {
      title: 'Item Name',
      render: (text, record, index) => {
        return record?.itemName || '-'
      },
    },
    {
      title: 'Item Type',
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
      title: 'Item Price',
      render: (text, record, index) => {
        return `${moneyFormatter(parseFloat(record?.price) || 0)}`
      },
      align: 'center',
      ellipsis: true,
      width: '250px',
    },
    {
      title: 'Ordered Quantity',
      align: 'center',
      render: (text, record, index) => {
        return record.qty
      },
    },
    {
      title: 'Total Price',
      render: (text, record, index) => {
        return `${moneyFormatter(
          parseFloat(record?.price) * parseInt(record?.qty) || 0,
        )}`
      },
      align: 'center',
      ellipsis: true,
      width: '250px',
    },
    {
      title: 'Sent Quantity',
      align: 'center',
      render: (text, record, index) => {
        return record.sentQty
      },
    },
    {
      title: 'Status',
      render: (text, record, index) => {
        return <StatusBadge status={record?.sentStatus} />
      },
      align: 'center',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      ellipsis: true,
      render: (data) =>
        moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime),
    },
  ]

  const _onRenderAction = (data: IIBOOrderDetailResponse) => {
    const isHidden = [
      STATUS_ENUM.unpaid.toString(),
      STATUS_ENUM?.rejected.toString(),
      STATUS_ENUM?.paid.toString(),
    ].includes(data?.orderStatus)

    if (isHidden) return
    return (
      <Button
        onClick={() => {
          handleModalUpdateStatusVisibility()
        }}
        block
        disabled={isHidden}
        className={
          isHidden
            ? tableStyles?.actionColumnDetailBtnDisabled
            : tableStyles.actionColumnDetailBtn
        }>
        <Flex align="center" justify="center">
          <FiEdit
            size={16}
            color={isHidden ? appColors?.neutral40 : appColors?.blue70}
          />
          <Spacer margin="auto 2px" />
          <div
            className={
              isHidden
                ? tableStyles?.actionColumnDetailTxtDisabled
                : tableStyles?.actionColumnDetailTxt
            }>
            Change Status
          </div>
        </Flex>
      </Button>
    )
  }

  const _onRenderActionTable = (data: IIBOOrderDetails) => {
    const isOrderStatusNotPaid =
      detailData?.orderStatus !== STATUS_ENUM?.paid.toString()

    const isDisabled =
      isOrderStatusNotPaid || parseInt(data?.qty) === data?.sentQty

    return (
      <Flex>
        <Button
          onClick={() => {
            navigate(`/order/${params?.id}/send-order-detail/${data?.id}`)
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
            onHandleSendItemBtn(data)
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
              Send
            </div>
          </Flex>
        </Button>
      </Flex>
    )
  }

  return (
    <>
      <Row>
        <Col xs={24}>
          <Card>
            <Row>
              <Col xs={24} sm={20}>
                <div className={'detail-title'}>TC Order Detail</div>
              </Col>
              <Col xs={24} sm={4}>
                <Flex justify="end">{_onRenderAction(detailData)}</Flex>
              </Col>
            </Row>

            <Spacer margin={'.5rem'} />

            <DetailRow title={'ID'} value={detailData?.id || '-'} />

            <DetailRow
              title={'Training Center'}
              value={`${detailData?.trainingCenter?.name || ''} - ${
                detailData?.trainingCenter?.owner || ''
              }`}
              onClick={() => {
                navigate(
                  `/user/training-center/${detailData?.trainingCenter?.number}`,
                )
              }}
            />

            <DetailRow
              title={'Total Ordered Quantity'}
              value={getTotalQtyAndPrice?.totalQty || 0}
            />

            <DetailRow
              title={'Total Price'}
              value={moneyFormatter(getTotalQtyAndPrice?.totalPrice || 0)}
            />

            <DetailRow
              title={'Status'}
              renderValue={
                detailData?.orderStatus ? (
                  <StatusBadge status={detailData?.orderStatus} />
                ) : (
                  '-'
                )
              }
            />

            <DetailRow
              title={'Received Payment to'}
              value={detailData?.paymentMethod?.account_name_display}
            />

            {detailData?.paymentMethod?.paymentType?.paymentTypeName ===
            PAYMENT_METHOD_TYPE_ENUM?.cashless ? (
              <DetailRow title={'Bank'} value={detailData?.bank?.bankName} />
            ) : null}

            <DetailRow
              title={'Reject Reason'}
              value={detailData?.rejectReason || '-'}
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

      <Spacer margin={'1rem auto'} />

      {detailData?.orderDetails && detailData?.orderDetails?.length > 0 ? (
        <>
          <Row>
            <Col xs={24}>
              <div className="section-title">Order Item Detail</div>
            </Col>
          </Row>

          <Table
            loading={isLoading}
            columns={TABLE_COLUMNS}
            data={detailData?.orderDetails}
            isAction
            rowKey={(data: IIBOOrderDetails) => data?.id}
            onRenderAction={(record) => {
              return _onRenderActionTable(record)
            }}
            identifier={'id'}
            pagination={null}
          />

          <Spacer margin="1.5rem auto" />
        </>
      ) : null}

      {isModalUpdateStatusVisible ? (
        <ModalUpdateStatus
          isVisible={isModalUpdateStatusVisible}
          handleClose={() => {
            handleModalUpdateStatusVisibility()
            setFormErrorMsg('')
          }}
          title="Update Status Order"
          statusListOptions={statusListOptions}
          onSubmit={handleSubmitUpdateStatus}
          isSubmitted={isSubmitted}
          formErrorMsg={formErrorMsg}
        />
      ) : null}

      {isModalSendItemVisible ? (
        <ModalSendItem
          isVisible={isModalSendItemVisible}
          handleClose={() => {
            handleModalSendItemVisibility()
            setFormErrorMsg('')
          }}
          title={'Send Order Item'}
          selectedItem={selectedItem}
          formErrorMsg={formErrorMsg}
          isSubmitted={isSubmitted}
          onSubmit={onHandleSubmitSendItem}
          onSetFormErrorMsg={onSetFormErrorMsg}
        />
      ) : null}
    </>
  )
}

export default OrderDetail
