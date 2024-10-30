// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Spacer from 'src/components/view/Spacer'
import { Button, Col, Flex, Row } from 'antd'
import Card from 'antd/es/card/Card'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import moment from 'moment'
import {
  DATETIME_FORMATTER_ENUM,
  SALES_INVOICE_DETAIL_TYPE,
  STATUS_ENUM,
} from 'src/enums/enums'
import { appColors } from 'src/assets/styles/styles'
import StatusBadge from 'src/components/view/StatusBadge'
import { ColumnsType } from 'antd/es/table'
import {
  IInvoiceBookDetail,
  IInvoiceEquipmentDetail,
  IInvoiceMonthlyFeeDetail,
  IInvoiceRegistrationDetail,
  ISalesInvoiceSelectedData,
  SalesInvoiceType,
} from 'src/models/invoice.model'
import Table from 'src/components/table/Table'
import Divider from 'src/components/view/Divider'
import useSalesInvoiceDetailController from '../Transaction/SalesInvoice/controller/useSalesInvoiceDetailController'
import { HiOutlineArrowSmLeft } from 'react-icons/hi'

const INVOICE_BOOK_TABLE_COLUMNS: ColumnsType<IInvoiceBookDetail> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    width: 100,
    render: (data) => data || '-',
  },
  {
    title: 'Book Name',
    render: (text, record, index) => {
      return `${record?.book?.bookNumber} - ${record.book.bookName}`
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
]

const INVOICE_MONTHLY_FEE_TABLE_COLUMNS: ColumnsType<IInvoiceMonthlyFeeDetail> =
  [
    {
      title: 'ID',
      width: 100,
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (data) => data || '-',
    },
    {
      title: 'Course Level Name',

      render: (text, record, index) => {
        return `${record.courseLevel.id} - ${record.courseLevel.courseLevelName}`
      },
    },
    {
      title: 'Monthly Fee Price',
      width: 250,

      dataIndex: 'monthlyFeePrice',
      key: 'monthlyFeePrice',
      render: (text, record, index) => {
        return `${moneyFormatter(text || 0)}`
      },
      align: 'center',
    },
    {
      title: 'Total Price After Discount',
      width: 250,
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
  ]

const INVOICE_REGISTRATION_FEE_TABLE_COLUMNS: ColumnsType<IInvoiceRegistrationDetail> =
  [
    {
      title: 'ID',
      width: 100,
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (data) => data || '-',
    },
    {
      title: 'Course Name',
      render: (text, record, index) => {
        return `${record.course.courseNumber} - ${record.course.courseName}`
      },
    },
    {
      title: 'Registration Fee Price',
      width: 250,
      dataIndex: 'registrationPrice',
      key: 'registrationPrice',
      render: (text, record, index) => {
        return `${moneyFormatter(text || 0)}`
      },
      align: 'center',
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
    title: 'Equipment Name',
    render: (text, record, index) => {
      return `${record.equipmentId} - ${record.equipmentHistoryData.equipmentName}`
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
    width: 250,
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
]

const PrintSalesInvoice = () => {
  const navigate = useNavigate()
  const params = useParams()

  const { detailData, isLoading } = useSalesInvoiceDetailController()

  return (
    <>
      <Row style={{ margin: '1rem auto' }}>
        <Col xs={24} sm={2} />
        <Col xs={24} sm={20}>
          <Row gutter={[8, 16]}>
            <Col xs={24} className="no-print">
              <div onClick={() => navigate(-1)} className="clickable-wrapper">
                <Flex>
                  <HiOutlineArrowSmLeft color={appColors?.blue60} size={18} />
                  <div
                    style={{
                      color: appColors?.blue60,
                      fontWeight: 500,
                      marginLeft: 4,
                    }}>
                    Back
                  </div>
                </Flex>
              </div>
            </Col>
            <Col xs={24}>
              <Card>
                <Row>
                  <Col xs={24} sm={12}>
                    <div
                      className={'detail-title'}
                      onClick={() => navigate(`/sales-invoice/${params?.id}`)}>
                      {detailData?.invoiceNumber || '-'}
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Flex justify="flex-end">
                      <Button
                        type={'primary'}
                        onClick={() => window.print()}
                        className="no-print">
                        Download PDF
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
                  value={`${moneyFormatter(
                    parseFloat(detailData?.totalAmount),
                  )}`}
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
                      {moneyFormatter(
                        parseFloat(detailData?.totalUnpaidAmount),
                      )}
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
                isAction={false}
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
                isAction={false}
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
                isAction={false}
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
                isAction={false}
                rowKey={(data: IInvoiceRegistrationDetail) => data?.id}
                identifier={'id'}
                pagination={null}
              />

              <Spacer margin="1.5rem auto" />
            </>
          ) : null}
        </Col>
        <Col xs={24} sm={2} />
      </Row>
    </>
  )
}

export default PrintSalesInvoice
