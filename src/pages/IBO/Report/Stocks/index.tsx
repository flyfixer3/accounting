// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { Button, Col, DatePicker, Flex, Row } from 'antd'
import { useEffect } from 'react'
import { ColumnsType } from 'antd/es/table'
import { IReportStocksListResponse } from 'src/models/report.model'
import { DATETIME_FORMATTER_ENUM, SUPPLIER_ORDER_TYPE } from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import Table from 'src/components/table/Table'
import Spacer from 'src/components/view/Spacer'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import useReportStocksController from '../controller/useReportStocksController'
import SelectMultipleItemType from 'src/components/select/SelectMultipleItemType'

const { RangePicker } = DatePicker

const ReportStock = () => {
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
    onHandleListFilter,
    onHandleDownloadReport,
  } = useReportStocksController()

  const TABLE_COLUMNS: ColumnsType<IReportStocksListResponse> = [
    {
      title: 'Item ID',
      render: (text, record, index) => {
        return <div style={{ textAlign: 'left' }}>{record?.itemId || ''}</div>
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
      title: 'Initial Stock',
      dataIndex: 'initialStock',
      key: 'initialStock',
      width: 250,
      ellipsis: true,
      align: 'center',
      render: (data) => parseInt(data) || 0,
    },
    {
      title: 'Stock In',
      dataIndex: 'stockIn',
      key: 'stockIn',
      width: 200,

      align: 'center',
      render: (data) => parseInt(data) || 0,
    },
    {
      title: 'Stock Out (Sold)',
      dataIndex: 'stockOutSold',
      key: 'stockOutSold',
      width: 200,
      align: 'center',
      render: (data) => parseInt(data) || 0,
    },
    {
      title: 'Stock Out (Damaged)',
      dataIndex: 'stockOutDamaged',
      key: 'stockOutDamaged',
      width: 200,
      align: 'center',
      render: (data) => parseInt(data) || 0,
    },
    {
      title: 'Final Stock',
      dataIndex: 'finalStock',
      key: 'finalStock',
      width: 200,
      align: 'center',
      render: (data) => parseInt(data) || 0,
    },
    {
      title: 'Purchase Price (Avg)',
      dataIndex: 'avgPurchasePrice',
      key: 'avgPurchasePrice',
      width: 350,
      ellipsis: true,
      render: (data) => {
        return `${moneyFormatter(parseFloat(data) || 0)}`
      },
      align: 'center',
    },
    {
      title: 'Sales Price (Avg)',
      dataIndex: 'avgSalesPrice',
      key: 'avgSalesPrice',
      width: 350,
      ellipsis: true,
      render: (data) => {
        return `${moneyFormatter(parseFloat(data) || 0)}`
      },
      align: 'center',
    },

    {
      title: 'Current Sales Price',
      dataIndex: 'salesPrice',
      key: 'salesPrice',
      width: 350,
      ellipsis: true,
      render: (data) => {
        return `${moneyFormatter(parseFloat(data) || 0)}`
      },
      align: 'center',
    },
  ]

  useEffect(() => {
    onSetBreadcrumbs([{ title: 'Stock Report', path: '/report/stock' }])
    onRefetch()
  }, [])

  return (
    <>
      <Row gutter={[8, 16]}>
        <Col xs={24}>
          <div className="detail-title">Stock Report</div>
        </Col>
        <Col xs={24} sm={8}>
          <RangePicker
            style={{ width: '100%' }}
            format={DATETIME_FORMATTER_ENUM?.payloadPrimary}
            onChange={onHandleOrderDateFilter}
            defaultValue={[dayjs().startOf('month'), dayjs()]}
          />
        </Col>
        <Col xs={24} sm={8}>
          <SelectMultipleItemType
            handleChange={onHandleListFilter}
            allowClear={true}
            placeholder="Select Item Type"
          />
        </Col>
        <Col xs={6} sm={8}>
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
        rowKey={(data: IReportStocksListResponse) => data?.id}
        identifier={'id'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        setIsFetch={setIsFetch}
      />
    </>
  )
}

export default ReportStock
