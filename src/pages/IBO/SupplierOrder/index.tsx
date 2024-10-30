// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { useEffect } from 'react'
import useSupplierController from './controller/useSupplierController'
import { Button, Col, Flex, Row } from 'antd'
import CardStatistic from 'src/components/view/CardStatistic/CardStatistic'
import { DATETIME_FORMATTER_ENUM, STATUS_ENUM } from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import Spacer from 'src/components/view/Spacer'
import TableHeader from 'src/components/table/TableHeader'
import SearchInput from 'src/components/input/Search'
import { ColumnsType } from 'antd/es/table'
import { ISupplierDataResponse, ISupplierOrderListResponse } from 'src/models/supplier.model'
import StatusBadge from 'src/components/view/StatusBadge'
import moment from 'moment'
import Table from 'src/components/table/Table'

const TABLE_COLUMNS: ColumnsType<ISupplierOrderListResponse> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Supplier Name',
    dataIndex: 'supplier',
    key: 'supplier',
    render: (supplier: ISupplierDataResponse) => supplier.supplierName || '-',
    width: 250,
  },
  {
    title: 'Total Price',
    dataIndex: 'totalPrice',
    key: 'totalPrice',
    render: (text, record, index) => {
      return `${moneyFormatter(text)}` || `Rp 0`
    },
  },
  {
    title: 'Status',
    dataIndex: 'paymentStatus',
    key: 'paymentStatus',
    render: (data) => {
      return <StatusBadge status={data} />
    },
  },
  {
    title: 'Order Date',
    dataIndex: 'orderDate',
    key: 'orderDate',
    width: '200px',
    ellipsis: true,
    render: (data) => moment(data).format(DATETIME_FORMATTER_ENUM?.primary),
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

const Supplier = () => {
  const { onSetBreadcrumbs } = useApp()

  const {
    isLoading,
    data,
    queryParams,
    setQueryParams,
    onRefetch,
    handleClickAction,
    setIsFetch,
    handleChangeStatus,
  } = useSupplierController()

  useEffect(() => {
    onSetBreadcrumbs([{ title: 'Supplier Order', path: '/supplier-order' }])
    onRefetch()
  }, [])

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Data'}
            value={data?.meta?.totalData || 0}
            active={queryParams?.status === STATUS_ENUM?.all}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.all)
            }}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Paid Data'}
            value={data?.meta?.totalPaid || 0}
            isLoading={isLoading}
            active={queryParams?.status === STATUS_ENUM?.paid}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.paid)
            }}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Unpaid Data'}
            value={data?.meta?.totalUnpaid || 0}
            isLoading={isLoading}
            active={queryParams?.status === STATUS_ENUM?.unpaid}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.unpaid)
            }}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Paid Amount'}
            value={moneyFormatter(parseFloat(data?.meta?.totalPaidAmount) || 0)}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Unpaid Amount'}
            value={moneyFormatter(
              parseFloat(data?.meta?.totalUnpaidAmount) || 0,
            )}
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
                placeholder="Search by Supplier Name"
                onSearch={async (e: string) => {
                  setQueryParams({ ...queryParams, search: e })
                  setIsFetch()
                }}
              />
            ),
            column: 8,
          },
          {
            key: 'add',
            children: (
              <Flex justify="flex-end">
                <Button
                  type={'primary'}
                  onClick={() => handleClickAction('add')}>
                  + Add Supplier Order
                </Button>
              </Flex>
            ),
            column: 16,
          },
        ]}
        totalData={data?.meta?.currentTotalData || 0}
      />

      <Spacer margin={'.5rem auto'} />

      <Table
        loading={isLoading}
        columns={TABLE_COLUMNS}
        data={data?.data}
        isAction
        onDetail={(e: number) => handleClickAction('detail', e)}
        rowKey={(data: ISupplierOrderListResponse) => data?.id}
        identifier={'id'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        setIsFetch={setIsFetch}
      />
    </>
  )
}

export default Supplier
