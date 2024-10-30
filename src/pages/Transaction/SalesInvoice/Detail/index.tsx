// @ts-nocheck
import { Button, Col, Flex, Row } from 'antd'
import Card from 'antd/es/card/Card'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { appColors } from 'src/assets/styles/styles'
import Table from 'src/components/table/Table'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import Divider from 'src/components/view/Divider'
import Spacer from 'src/components/view/Spacer'
import StatusBadge from 'src/components/view/StatusBadge'
import { useApp } from 'src/context/app.context'
import {
  DATETIME_FORMATTER_ENUM,
  SALES_INVOICE_DETAIL_TYPE,
  STATUS_ENUM,
} from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import {
  IInvoiceBookDetail,
  IInvoiceEquipmentDetail,
  IInvoiceMonthlyFeeDetail,
  IInvoiceRegistrationDetail,
  ISalesInvoiceSelectedData,
  SalesInvoiceType,
} from 'src/models/invoice.model'
import ModalGenerateVoucherConfirmation from '../components/ModalGenerateVoucherConfirmation'
import ModalPayment from '../components/ModalPayment'
import useSalesInvoiceDetailController from '../controller/useSalesInvoiceDetailController'

const INVOICE_BOOK_TABLE_COLUMNS: ColumnsType<IInvoiceBookDetail> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    render: (data) => data || '-',
  },
  {
    title: 'Book Number',
    align: 'center',

    render: (text, record, index) => {
      return record.book.bookNumber
    },
  },
  {
    title: 'Book Name',
    width: 200,
    ellipsis: true,
    render: (text, record, index) => {
      return record.book.bookName
    },
  },
  {
    title: 'Book Price',
    dataIndex: 'bookPrice',
    key: 'bookPrice',
    width: 250,
    ellipsis: true,
    render: (text, record, index) => {
      return `${moneyFormatter(text || 0)}`
    },
    align: 'center',
  },
  {
    title: 'Payment Method',
    render: (text, record, index) => {
      return record?.paymentMethod?.account_name_display || '-'
    },
    align: 'center',
  },
  {
    title: 'Bank',
    render: (text, record, index) => {
      return record?.bank?.bankName || '-'
    },
    align: 'center',
  },
  {
    title: 'Status',
    render: (text, record, index) => {
      return <StatusBadge status={record?.invoiceDetailStatus} />
    },
    align: 'center',
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '250px',
    ellipsis: true,
    render: (data) =>
      moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime),
  },
  {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: '250px',
    ellipsis: true,
    render: (data) =>
      moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime),
  },
]

const INVOICE_MONTHLY_FEE_TABLE_COLUMNS: ColumnsType<IInvoiceMonthlyFeeDetail> =
  [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (data) => data || '-',
    },
    {
      title: 'Course Level ID',
      width: '150px',
      ellipsis: true,
      align: 'center',
      render: (text, record, index) => {
        return record.courseLevel.id
      },
    },
    {
      title: 'Course Level Name',
      width: '150px',
      ellipsis: true,
      render: (text, record, index) => {
        return record.courseLevel.courseLevelName
      },
    },
    {
      title: 'Monthly Fee Price',
      width: '150px',
      ellipsis: true,
      dataIndex: 'monthlyFeePrice',
      key: 'monthlyFeePrice',
      render: (text, record, index) => {
        return `${moneyFormatter(text || 0)}`
      },
      align: 'center',
    },
    {
      title: 'Total Price After Discount',
      width: '150px',
      ellipsis: true,
      dataIndex: 'discountedPrice',
      key: 'discountedPrice',
      render: (text, record, index) => {
        if (!text)
          return `${moneyFormatter(parseFloat(record?.monthlyFeePrice) || 0)}`
        return `${moneyFormatter(text || 0)}`
      },
      align: 'center',
    },
    {
      title: 'Payment Method',
      width: '150px',
      ellipsis: true,
      render: (text, record, index) => {
        return record?.paymentMethod?.account_name_display || '-'
      },
      align: 'center',
    },
    {
      title: 'Bank',
      render: (text, record, index) => {
        return record?.bank?.bankName || '-'
      },
      align: 'center',
    },
    {
      title: 'Status',
      render: (text, record, index) => {
        return <StatusBadge status={record?.invoiceDetailStatus} />
      },
      align: 'center',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '250px',
      ellipsis: true,
      render: (data) =>
        moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: '250px',
      ellipsis: true,
      render: (data) =>
        moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime),
    },
  ]

const INVOICE_REGISTRATION_FEE_TABLE_COLUMNS: ColumnsType<IInvoiceRegistrationDetail> =
  [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (data) => data || '-',
    },
    {
      title: 'Course Number',
      width: '150px',
      ellipsis: true,
      align: 'center',
      render: (text, record, index) => {
        return record.course.courseNumber
      },
    },
    {
      title: 'Course Name',
      ellipsis: true,
      width: '150px',
      render: (text, record, index) => {
        return record.course.courseName
      },
    },
    {
      title: 'Registration Fee Price',
      width: '150px',
      ellipsis: true,
      dataIndex: 'registrationPrice',
      key: 'registrationPrice',
      render: (text, record, index) => {
        return `${moneyFormatter(text || 0)}`
      },
      align: 'center',
    },
    {
      title: 'Payment Method',
      width: '150px',
      ellipsis: true,
      render: (text, record, index) => {
        return record?.paymentMethod?.account_name_display || '-'
      },
      align: 'center',
    },
    {
      title: 'Bank',
      render: (text, record, index) => {
        return record?.bank?.bankName || '-'
      },
      align: 'center',
    },
    {
      title: 'Status',
      render: (text, record, index) => {
        return <StatusBadge status={record?.invoiceDetailStatus} />
      },
      align: 'center',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '250px',
      ellipsis: true,
      render: (data) =>
        moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: '250px',
      ellipsis: true,
      render: (data) =>
        moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime),
    },
  ]

const INVOICE_EQUIPMENT_TABLE_COLUMNS: ColumnsType<IInvoiceEquipmentDetail> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    render: (data) => data || '-',
  },
  {
    title: 'Equipment ID',
    align: 'center',
    render: (text, record, index) => {
      return record.equipmentId
    },
  },
  {
    title: 'Equipment Name',
    ellipsis: true,
    width: '250px',
    render: (text, record, index) => {
      return record.equipmentHistoryData.equipmentName
    },
  },
  {
    title: 'Quantity',
    dataIndex: 'qty',
    key: 'qty',
    align: 'center',
    render: (text, record, index) => {
      return record.qty
    },
  },
  {
    title: 'Equipment Fee',
    render: (text, record, index) => {
      return (
        `${moneyFormatter(
          parseFloat(record?.equipmentHistoryData?.equipmentPrice),
        )}` || `Rp0`
      )
    },
    align: 'center',
    ellipsis: true,
    width: '250px',
  },
  {
    title: 'Total Price',
    dataIndex: 'totalPrice',
    key: 'totalPrice',
    render: (text, record, index) => {
      return `${moneyFormatter(text)}` || `Rp 0`
    },
    align: 'center',
  },
  {
    title: 'Payment Method',
    render: (text, record, index) => {
      return record?.paymentMethod?.account_name_display || '-'
    },
    align: 'center',
  },
  {
    title: 'Bank',
    render: (text, record, index) => {
      return record?.bank?.bankName || '-'
    },
    align: 'center',
  },
  {
    title: 'Status',
    render: (text, record, index) => {
      return <StatusBadge status={record?.invoiceDetailStatus} />
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
  {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    ellipsis: true,
    render: (data) =>
      moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime),
  },
]

const SalesInvoiceDetail = () => {
  const navigate = useNavigate()
  const params = useParams()

  const { onSetBreadcrumbs } = useApp()
  const {
    detailData,
    isLoading,
    isModalPaymentVisible,
    selectedData,
    isModalGenerateVoucherConfirmVisible,
    isSubmitted,
    formErrorMsg,
    onHandleModalPaymentVisibility,
    onHandleSelectedDataToPay,
    onRefetchDetail,
    onHandleModalGenerateVoucherVisibility,
    onHandleSubmitGenerateVoucher,
  } = useSalesInvoiceDetailController()

  useEffect(() => {
    onSetBreadcrumbs([
      { title: 'Sales Invoice', path: '/sales-invoice' },
      { title: 'Sales Invoice Detail', path: `/sales-invoice/${params?.id}` },
    ])
  }, [])

  const _onRenderActionBtn = (
    type: SalesInvoiceType,
    data: ISalesInvoiceSelectedData,
  ) => {
    return (
      <Button
        type="primary"
        disabled={data?.invoiceDetailStatus === STATUS_ENUM?.paid}
        onClick={() => {
          onHandleSelectedDataToPay(type, data)
          onHandleModalPaymentVisibility()
        }}>
        Pay
      </Button>
    )
  }

  return (
    <>
      <Row>
        <Col xs={24}>
          <Card>
            <Row>
              <Col xs={24} sm={12}>
                <div className={'detail-title'}>
                  {detailData?.invoiceNumber || '-'}
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <Flex justify="flex-end">
                  <Button
                    type={'primary'}
                    onClick={() =>
                      navigate(`/print/receipt/sales-invoice/${params?.id}`)
                    }
                    className="no-print">
                    View Sales Invoice
                  </Button>
                </Flex>
              </Col>
            </Row>

            <Spacer margin={'.5rem'} />

            <DetailRow
              title={'Student Name - Email'}
              value={`${detailData?.student?.studentName || ''} - ${
                detailData?.student?.studentEmail || ''
              }`}
              onClick={() => {
                navigate(`/student/${detailData?.student?.id}`)
              }}
            />

            <DetailRow
              title={'Total Amount'}
              value={`${moneyFormatter(parseFloat(detailData?.totalAmount))}`}
            />

            <DetailRow
              title={'Total Paid Amount'}
              value={`${moneyFormatter(
                parseFloat(detailData?.totalPaidAmount),
              )}`}
            />

            <DetailRow
              title={'Total Unpaid Amount'}
              value={`${moneyFormatter(
                parseFloat(detailData?.totalUnpaidAmount),
              )}`}
              renderValue={
                <div style={{ color: appColors?.red60, fontWeight: 500 }}>
                  {moneyFormatter(parseFloat(detailData?.totalUnpaidAmount))}
                </div>
              }
            />

            <DetailRow
              title="Status"
              renderValue={
                detailData?.invoiceStatus ? (
                  <StatusBadge status={detailData?.invoiceStatus} />
                ) : (
                  '-'
                )
              }
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

      {detailData?.invoiceBookDetail &&
      detailData?.invoiceBookDetail?.length > 0 ? (
        <>
          <Row>
            <Col xs={24}>
              <div className="section-title">Book Invoice</div>
            </Col>
          </Row>

          <Table
            loading={isLoading}
            columns={INVOICE_BOOK_TABLE_COLUMNS}
            data={detailData?.invoiceBookDetail}
            isAction
            onRenderAction={(record) =>
              _onRenderActionBtn(SALES_INVOICE_DETAIL_TYPE.book, record)
            }
            rowKey={(data: IInvoiceBookDetail) => data?.id}
            identifier={'id'}
            pagination={null}
          />

          <Spacer margin="1.5rem auto" />

          <Divider dashed />
        </>
      ) : null}

      {detailData?.invoiceEquipmentDetail &&
      detailData?.invoiceEquipmentDetail?.length > 0 ? (
        <>
          <Row>
            <Col xs={24}>
              <div className="section-title">Equipment Invoice</div>
            </Col>
          </Row>

          <Table
            loading={isLoading}
            columns={INVOICE_EQUIPMENT_TABLE_COLUMNS}
            data={detailData?.invoiceEquipmentDetail}
            isAction
            onRenderAction={(record) =>
              _onRenderActionBtn(SALES_INVOICE_DETAIL_TYPE?.equipment, record)
            }
            rowKey={(data: IInvoiceEquipmentDetail) => data?.id}
            identifier={'id'}
            pagination={null}
          />

          <Spacer margin="1.5rem auto" />

          <Divider dashed />
        </>
      ) : null}

      {detailData?.invoiceMonthlyFeeDetail &&
      detailData?.invoiceMonthlyFeeDetail?.length > 0 ? (
        <>
          <Row>
            <Col xs={24}>
              <div className="section-title">Monthly Fee Invoice</div>
            </Col>
          </Row>

          <Table
            loading={isLoading}
            columns={INVOICE_MONTHLY_FEE_TABLE_COLUMNS}
            data={detailData?.invoiceMonthlyFeeDetail}
            isAction
            onRenderAction={(record) =>
              _onRenderActionBtn(SALES_INVOICE_DETAIL_TYPE?.monthlyFee, record)
            }
            rowKey={(data: IInvoiceMonthlyFeeDetail) => data?.id}
            identifier={'id'}
            pagination={null}
          />

          <Spacer margin="1.5rem auto" />

          <Divider dashed />
        </>
      ) : null}

      {detailData?.invoiceRegistrationDetail &&
      detailData?.invoiceRegistrationDetail?.length > 0 ? (
        <>
          <Row>
            <Col xs={24}>
              <div className="section-title">Registration Fee Invoice</div>
            </Col>
          </Row>

          <Table
            loading={isLoading}
            columns={INVOICE_REGISTRATION_FEE_TABLE_COLUMNS}
            data={detailData?.invoiceRegistrationDetail}
            isAction
            onRenderAction={(record) =>
              _onRenderActionBtn(
                SALES_INVOICE_DETAIL_TYPE?.registration,
                record,
              )
            }
            rowKey={(data: IInvoiceRegistrationDetail) => data?.id}
            identifier={'id'}
            pagination={null}
          />

          <Spacer margin="1.5rem auto" />
        </>
      ) : null}

      {isModalPaymentVisible ? (
        <ModalPayment
          isVisible={isModalPaymentVisible}
          handleClose={onHandleModalPaymentVisibility}
          selectedData={{
            ...selectedData,
            invoiceNumber: detailData?.invoiceNumber,
            studentId: detailData?.student?.id,
          }}
          onRefetchDetail={onRefetchDetail}
          onHandleModalGenerateVoucherVisibility={
            onHandleModalGenerateVoucherVisibility
          }
        />
      ) : null}

      {isModalGenerateVoucherConfirmVisible ? (
        <ModalGenerateVoucherConfirmation
          isVisible={isModalGenerateVoucherConfirmVisible}
          handleClose={onHandleModalGenerateVoucherVisibility}
          onRefetchDetail={onRefetchDetail}
          studentData={detailData?.student}
          onHandleSubmitGenerateVoucher={onHandleSubmitGenerateVoucher}
          isSubmitted={isSubmitted}
          formErrorMsg={formErrorMsg}
        />
      ) : null}
    </>
  )
}

export default SalesInvoiceDetail
