// @ts-nocheck
import { Button, Col, DatePicker, Flex, Row } from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import moment from 'moment'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchInput from 'src/components/input/Search'
import SelectMultipleTrainingCenter from 'src/components/select/SelectMultipleTrainingCenter'
import Table from 'src/components/table/Table'
import Spacer from 'src/components/view/Spacer'
import StatusBadge from 'src/components/view/StatusBadge'
import { useApp } from 'src/context/app.context'
import { DATETIME_FORMATTER_ENUM, SUPPLIER_ORDER_TYPE } from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import { IReportSalesListResponse } from 'src/models/report.model'
import useReportSalesController from '../controller/useReportSalesController'

const { RangePicker } = DatePicker

const ReportSales = () => {
  const navigate = useNavigate()
  const { onSetBreadcrumbs } = useApp()
  const {
    data,
    queryParams,
    setQueryParams,
    isLoading,
    setIsFetch,
    onRefetch,
    onHandleOrderDateFilter,
    onHandleTrainingCenterListFilter,
    onHandleDownloadReport,
  } = useReportSalesController()

  const TABLE_COLUMNS: ColumnsType<IReportSalesListResponse> = [
    {
      title: 'Order ID',
      render: (text, record, index) => {
        return (
          <div
            className="link-title"
            style={{ textAlign: 'left' }}
            onClick={() => {
              navigate(`/order/${record?.orderId}`)
            }}>
            {record?.orderId || ''}
          </div>
        )
      },
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 250,
      ellipsis: true,
      render: (data) => moment(data).format(DATETIME_FORMATTER_ENUM?.primary),
    },
    {
      title: 'Training Center',
      render: (text, record, index) => {
        return (
          <div
            className="link-title"
            style={{ textAlign: 'left' }}
            onClick={() => {
              navigate(
                `/user/training-center/${record?.trainingCenter?.number}`,
              )
            }}>
            {record?.trainingCenter?.name || ''}
            <div style={{ fontSize: '14px', textAlign: 'left' }}>
              {record?.trainingCenter?.owner}
            </div>
          </div>
        )
      },
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      key: 'itemName',
      width: 300,
      ellipsis: true,
      render: (data) => data || '-',
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
      width: 150,
    },
    {
      title: 'Order Buy Quantity',
      dataIndex: 'orderQty',
      key: 'orderQty',
      width: 250,
      ellipsis: true,
      align: 'center',
      render: (data) => parseInt(data) || 0,
    },
    {
      title: 'Order Buy Price',
      dataIndex: 'buyPrice',
      key: 'buyPrice',
      width: 350,
      ellipsis: true,
      render: (data) => {
        return `${moneyFormatter(parseFloat(data) || 0)}`
      },
      align: 'center',
    },
    {
      title: 'Total Order Buy Price',
      dataIndex: 'totalBuyPrice',
      key: 'totalBuyPrice',
      width: 350,
      ellipsis: true,
      render: (data) => {
        return `${moneyFormatter(parseFloat(data) || 0)}`
      },
      align: 'center',
    },
    {
      title: 'Sent Quantity',
      dataIndex: 'totalSentQty',
      key: 'totalSentQty',
      width: 200,

      align: 'center',
      render: (data) => parseInt(data) || 0,
    },
    {
      title: 'Received Quantity',
      dataIndex: 'totalReceivedQty',
      key: 'totalReceivedQty',
      width: 200,
      align: 'center',
      render: (data) => parseInt(data) || 0,
    },
    {
      title: 'Selling Price',
      dataIndex: 'sellingPrice',
      key: 'sellingPrice',
      width: 350,
      ellipsis: true,
      render: (data) => {
        return `${moneyFormatter(parseFloat(data) || 0)}`
      },
      align: 'center',
    },
    {
      title: 'Order Status',
      render: (text, record, index) => {
        return <StatusBadge status={record?.orderStatus} />
      },
      align: 'center',
    },
    {
      title: 'Payment Method',
      width: 150,
      ellipsis: true,
      render: (text, record, index) => {
        return record?.paymentMethod?.account_name_display || '-'
      },
      align: 'center',
    },
  ]

  useEffect(() => {
    onSetBreadcrumbs([
      { title: 'Receivables Report', path: '/credit/receivables' },
    ])
    onRefetch()
  }, [])

  return (
    <>
      <Row gutter={[8, 16]}>
        <Col xs={24}>
          <div className="detail-title">Receivables</div>
        </Col>
        <Col xs={24} sm={8}>
          <RangePicker
            style={{ width: '100%' }}
            format={DATETIME_FORMATTER_ENUM?.payloadPrimary}
            onChange={onHandleOrderDateFilter}
            defaultValue={[dayjs().startOf('month'), dayjs()]}
          />
        </Col>
        <Col xs={24} sm={6}>
          <SearchInput
            placeholder="Search by Item Name"
            onSearch={async (e: string) => {
              setQueryParams({ ...queryParams, search: e })
              setIsFetch()
            }}
          />
        </Col>
        <Col xs={24} sm={6}>
          <SelectMultipleTrainingCenter
            handleSelectedData={onHandleTrainingCenterListFilter}
            allowClear={true}
          />
        </Col>
        <Col xs={6} sm={4}>
          <Flex justify="flex-end">
            <Button type="primary" onClick={onHandleDownloadReport}>
              Download
            </Button>
          </Flex>
        </Col>
      </Row>

      <Spacer margin="1rem auto" />

      <Table
        loading={isLoading}
        columns={TABLE_COLUMNS}
        data={data?.data}
        isAction={false}
        rowKey={(data: IReportSalesListResponse) => data?.id}
        identifier={'id'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        setIsFetch={setIsFetch}
      />
    </>
  )
}

export default ReportSales
