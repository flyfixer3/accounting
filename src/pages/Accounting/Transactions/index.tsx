import { Table as AntdTable, Button, Col, Flex, Row, Select } from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchInput from 'src/components/input/Search'
import Table from 'src/components/table/Table'
import TableHeader from 'src/components/table/TableHeader'
import CardStatistic from 'src/components/view/CardStatistic/CardStatistic'
import Spacer from 'src/components/view/Spacer'
import { useApp } from 'src/context/app.context'
import { DATETIME_FORMATTER_ENUM, STATUS_ENUM } from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import { useTransactionsQuery } from '../hooks/useTransactionsQuery'
import { AccountingTransaction, AccountingTransactionDetail } from '../types'
import { IQueryParams } from '@src/models/general.model'

const COLUMNS: ColumnsType<AccountingTransaction> = [
  {
    title: 'Transaction Date',
    dataIndex: 'date',
    key: 'date',
    render: (data) =>
      dayjs(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime) || '-',
  },
  {
    title: 'Label',
    dataIndex: 'label',
    key: 'label',
    render: (data) => data || '-',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    render: (data) => data || '-',
  },
  {
    title: 'Transaction Amount',
    key: 'total_amount',
    render: (data) => {
      return moneyFormatter(
        (data.details?.reduce(
          (acc: number, curr: AccountingTransactionDetail) =>
            acc + curr?.amount,
          0,
        ) ?? 0) / 2,
        true,
      )
    },
  },
  {
    title: 'Created at',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (data) =>
      dayjs(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime) || '-',
  },
  {
    title: 'Updated at',
    dataIndex: 'updated_at',
    key: 'updated_at',
    render: (data) =>
      dayjs(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime) || '-',
  },
]
const APP_START_YEAR = 2023
const CUTOFF_DAY = 28
const MONTHS = Array.from({ length: 12 }).map((_, i) => ({
  value: moment().month(i).get('month') + 1,
  label: moment().month(i).format('MMMM'),
}))
const isThisMonthSalaryPayable = moment().day() >= CUTOFF_DAY
const defaultFilterDate = isThisMonthSalaryPayable
  ? moment()
  : moment().subtract(1, 'months')
const years = Array.from({
  length: new Date().getFullYear() - APP_START_YEAR,
})

const months = MONTHS.slice(0, defaultFilterDate.get('month') + 1)


const INTERNAL_COLUMNS: ColumnsType<AccountingTransactionDetail> = [
  {
    title: 'Account',
    dataIndex: 'subaccount',
    key: 'subaccount',
    render: (data) => `(${data.subaccount_number}) ${data.subaccount_name}`,
    width: '40%',
  },
  {
    title: 'Debit',
    dataIndex: 'amount',
    key: 'debit',
    render: (data, record) =>
      record.type === 'debit' ? moneyFormatter(data, true) : '-',
    width: '30%',
  },
  {
    title: 'Credit',
    dataIndex: 'amount',
    key: 'credit',
    render: (data, record) =>
      record.type === 'credit' ? moneyFormatter(data, true) : '-',
    width: '30%',
  },
]

export default function AccountingTransactionsPage() {
  const { onSetBreadcrumbs } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState({ search: '' ,
    month: defaultFilterDate.get('month') + 1,
    year: defaultFilterDate.get('year'),
  })
  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 1,
    limit: 200,
    search: '',
    month: defaultFilterDate.get('month') + 1,
    year: defaultFilterDate.get('year'),
    status: STATUS_ENUM?.all,
    totalData: 0,
  })

  useEffect(() => {
    onSetBreadcrumbs?.([
      { title: 'Transactions', path: '/accounting/transactions' },
    ])
  }, [])

  const { data, isLoading } = useTransactionsQuery(query)

  const [expandedRows, setExpandedRows] = useState<number[]>([])
  useEffect(() => {
    setExpandedRows(data?.page.data.map((o) => o.id) ?? [])
  }, [data])

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Data'}
            value={data?.page.total || 0}
            active
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
                placeholder="Search transaction"
                onSearch={async (e: string) => {
                  setQuery({ ...query, search: e })
                }}
              />
            ),
            column: 8,
          },
          {
            key: 'month',
            children: (
              <Select
                options={years.map((year) => ({
                  value: year,
                  label: year,
                }))}
                loading={isLoading}
                value={query.year}
                onChange={(value) => {
                  setQuery((prev) => ({
                    ...prev,
                    year: parseInt(value.toString()),
                  }))
                }}
                placeholder="Year"
              />
            ),
            column: 3,
          },
          {
            key: 'year',
            children: (
              <Select
                options={months}
                loading={isLoading}
                value={query.month}
                onChange={(value) => {
                  setQuery((prev) => ({
                    ...prev,
                    month: parseInt(value.toString()),
                  }))
                }}
                placeholder="Month"
              />
            ),
            column: 3,
          },
          // TODO: add filter posting
          {
            key: 'add',
            children: (
              <Flex justify="flex-end">
                <Button
                  type={'primary'}
                  onClick={() => {
                    navigate('/accounting/transactions/add')
                  }}>
                  + Add Transaction
                </Button>
              </Flex>
            ),
            column: 10,
          },
        ]}
        totalData={data?.meta.total || 0}
      />

      <Table
        expandable={{
          expandedRowRender: (record) => (
            <AntdTable
              pagination={false}
              columns={INTERNAL_COLUMNS}
              dataSource={record.details}
            />
          ),
          
          onExpand: (expanded, record) => {
            if (expanded) {
              setExpandedRows((prev) => [...prev, record.id])
            } else {
              setExpandedRows((prev) => prev.filter((o) => o !== record.id))
            }
          },
        }}
        loading={isLoading}
        columns={COLUMNS}
        data={data?.page.data}
        isAction
        rowKey={(data: AccountingTransaction) => data?.id}
        identifier={'id'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        allowEdit={true}
        onDetail={(e) => {
          navigate(`/accounting/transactions/${e}`)
        }}
        onEditDisabled={(record) => record.automated}
        onEdit={(e, record: any) => {
          navigate(`/accounting/transactions/edit/${record.id}`)
        }}
      />
    </>
  )
}
