// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { useEffect, useMemo } from 'react'
import useSalesInvoiceController from './controller/useSalesInvoiceController'
import { Col, Row } from 'antd'
import CardStatistic from 'src/components/view/CardStatistic/CardStatistic'
import {
  STATUS_ENUM,
  DATETIME_FORMATTER_ENUM,
  USER_ROLE_ENUM,
} from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import Spacer from 'src/components/view/Spacer'
import TableHeader from 'src/components/table/TableHeader'
import SearchInput from 'src/components/input/Search'
import { ColumnsType } from 'antd/es/table'
import {
  ISalesInvoiceIBOList,
  ISalesInvoiceList,
} from 'src/models/invoice.model'
import StatusBadge from 'src/components/view/StatusBadge'
import moment from 'moment'
import Table from 'src/components/table/Table'
import { useAuth } from 'src/context/auth.context'

const TABLE_COLUMNS_TC: ColumnsType<ISalesInvoiceList> = [
  {
    title: 'Number',
    dataIndex: 'invoiceNumber',
    key: 'invoiceNumber',
    render: (data) => data || '-',
    width: 250,
  },
  {
    title: 'Student Name',
    render: (text, record, index) => {
      return `${record?.student?.studentName}`
    },
  },
  {
    title: 'Total Amount',
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    render: (text, record, index) => {
      return `${moneyFormatter(text)}` || `Rp 0`
    },
  },
  {
    title: 'Total Paid Amount',
    dataIndex: 'totalPaidAmount',
    key: 'totalPaidAmount',
    render: (text, record, index) => {
      return `${moneyFormatter(text)}` || `Rp 0`
    },
  },
  {
    title: 'Total Unpaid Amount',
    dataIndex: 'totalUnpaidAmount',
    key: 'totalUnpaidAmount',
    render: (text, record, index) => {
      return `${moneyFormatter(text)}` || `Rp 0`
    },
  },
  {
    title: 'Status',
    dataIndex: 'invoiceStatus',
    key: 'invoiceStatus',
    render: (data) => {
      return <StatusBadge status={data} />
    },
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '200px',
    ellipsis: true,
    render: (data) =>
      moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime),
  },
  {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: '200px',
    ellipsis: true,
    render: (data) =>
      moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime),
  },
]

const TABLE_COLUMNS_IBO: ColumnsType<ISalesInvoiceIBOList> = [
  {
    title: 'Number',
    dataIndex: 'invoiceNumber',
    key: 'invoiceNumber',
    render: (data) => data || '-',
    width: 250,
  },
  {
    title: 'Training Center',
    render: (text, record, index) => {
      return `${record?.trainingCenter?.owner || ''} - ${
        record?.trainingCenter?.name || ''
      }`
    },
  },
  {
    title: 'Total Amount',
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    render: (text, record, index) => {
      return `${moneyFormatter(text)}` || `Rp 0`
    },
  },
  {
    title: 'Total Paid Amount',
    dataIndex: 'totalPaidAmount',
    key: 'totalPaidAmount',
    render: (text, record, index) => {
      return `${moneyFormatter(text)}` || `Rp 0`
    },
  },
  {
    title: 'Total Unpaid Amount',
    dataIndex: 'totalUnpaidAmount',
    key: 'totalUnpaidAmount',
    render: (text, record, index) => {
      return `${moneyFormatter(text)}` || `Rp 0`
    },
  },
  {
    title: 'Status',
    dataIndex: 'invoiceStatus',
    key: 'invoiceStatus',
    render: (data) => {
      return <StatusBadge status={data} />
    },
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '200px',
    ellipsis: true,
    render: (data) =>
      moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime),
  },
  {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: '200px',
    ellipsis: true,
    render: (data) =>
      moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime),
  },
]

const SalesInvoice = () => {
  const { getUserRole } = useAuth()
  const { onSetBreadcrumbs } = useApp()
  const {
    onFetchList,
    salesInvoiceData,
    queryParams,
    handleChangeStatus,
    isLoading,
    setQueryParams,
    setIsFetch,
    handleClickAction,
  } = useSalesInvoiceController()

  useEffect(() => {
    onSetBreadcrumbs([{ title: 'Sales Invoice', path: '/sales-invoice' }])
    onFetchList()
  }, [])

  const _getTableColumns = useMemo(() => {
    return getUserRole === USER_ROLE_ENUM?.ibo
      ? TABLE_COLUMNS_IBO
      : TABLE_COLUMNS_TC
  }, [])

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={24}>
          <CardStatistic
            title={'Total Invoice Data'}
            value={salesInvoiceData?.meta?.totalData || 0}
            active={queryParams?.status === STATUS_ENUM?.all}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.all)
            }}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Paid Invoice'}
            value={salesInvoiceData?.meta?.totalPaid || 0}
            active={queryParams?.status === STATUS_ENUM?.paid}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.paid)
            }}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Unpaid Invoice'}
            value={salesInvoiceData?.meta?.totalUnpaid || 0}
            active={queryParams?.status === STATUS_ENUM?.unpaid}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.unpaid)
            }}
            isLoading={isLoading}
          />
        </Col>
        {getUserRole === USER_ROLE_ENUM?.tc ? (
          <Col xs={24} sm={8}>
            <CardStatistic
              title={'Total Partial Paid Invoice'}
              value={salesInvoiceData?.meta?.totalPartialPaid || 0}
              active={queryParams?.status === STATUS_ENUM?.partialPaid}
              onClick={() => {
                handleChangeStatus(STATUS_ENUM.partialPaid)
              }}
              isLoading={isLoading}
            />
          </Col>
        ) : null}
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Invoice Amount'}
            value={`${moneyFormatter(
              parseFloat(salesInvoiceData?.meta?.totalAmount) || 0,
            )}`}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Paid Invoice Amount'}
            value={`${moneyFormatter(
              parseFloat(salesInvoiceData?.meta?.totalPaidAmount) || 0,
            )}`}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Unpaid Invoice Amount'}
            value={`${moneyFormatter(
              parseFloat(salesInvoiceData?.meta?.totalUnpaidAmount) || 0,
            )}`}
            isLoading={isLoading}
          />
        </Col>
      </Row>

      <Spacer margin={'1rem auto'} />

      <TableHeader
        actions={[
          {
            key: 'search',
            children: (
              <SearchInput
                placeholder={
                  getUserRole === USER_ROLE_ENUM?.tc
                    ? 'Search by Invoice Number and Student Name'
                    : 'Search by Invoice Number'
                }
                onSearch={async (e: string) => {
                  setQueryParams({ ...queryParams, search: e })
                  setIsFetch()
                }}
              />
            ),
            column: 8,
          },
        ]}
        totalData={salesInvoiceData?.meta?.currentTotalData || 0}
      />

      <Table
        loading={isLoading}
        columns={_getTableColumns}
        data={salesInvoiceData?.data}
        isAction
        onDetail={(
          e: string,
          record: ISalesInvoiceList | ISalesInvoiceIBOList,
        ) => handleClickAction('detail', e, record)}
        rowKey={(data: ISalesInvoiceList | ISalesInvoiceIBOList) => data?.id}
        identifier={'id'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        setIsFetch={setIsFetch}
      />
    </>
  )
}

export default SalesInvoice
