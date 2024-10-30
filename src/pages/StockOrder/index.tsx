// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { useEffect } from 'react'
import useStockOrderListController from './controller/useStockOrderListController'
import { Col, Row } from 'antd'
import CardStatistic from 'src/components/view/CardStatistic/CardStatistic'
import { DATETIME_FORMATTER_ENUM, STATUS_ENUM } from 'src/enums/enums'
import Spacer from 'src/components/view/Spacer'
import TableHeader from 'src/components/table/TableHeader'
import Table from 'src/components/table/Table'
import { ColumnsType } from 'antd/es/table'
import { IStockOrderListResponse } from 'src/models/stock-order.model'
import StatusBadge from 'src/components/view/StatusBadge'
import moment from 'moment'
import { moneyFormatter } from 'src/helpers/formatter.helper'

const TABLE_COLUMNS: ColumnsType<IStockOrderListResponse> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (data) => data || '-',
  },
  {
    title: 'Total Price',
    render: (text, record, index) => {
      return `${moneyFormatter(parseFloat(record?.totalPrice) || 0)}`
    },
    align: 'center',
    ellipsis: true,
    width: '250px',
  },
  {
    title: 'Reject Reason',
    dataIndex: 'rejectReason',
    key: 'rejectReason',
    width: '250px',
    render: (data) => data || '-',
  },
  {
    title: 'Status',
    render: (text, record, index) => {
      return <StatusBadge status={record?.orderStatus} />
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

const StockOrder = () => {
  const { onSetBreadcrumbs } = useApp()

  const {
    data,
    isLoading,
    queryParams,
    setQueryParams,
    onChangeStatus,
    onRefetch,
    setIsFetchList,
    handleClickAction,
  } = useStockOrderListController()

  useEffect(() => {
    onSetBreadcrumbs([{ title: 'Stock Order', path: '/stock-order/orders' }])
    onRefetch()
  }, [])

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Order'}
            value={data?.meta?.totalData || 0}
            active={queryParams?.status === STATUS_ENUM?.all}
            onClick={() => {
              onChangeStatus(STATUS_ENUM.all)
            }}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Pending Order'}
            value={data?.meta?.totalPending || 0}
            active={queryParams?.status === STATUS_ENUM?.pending}
            onClick={() => {
              onChangeStatus(STATUS_ENUM.pending)
            }}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Rejected Order'}
            value={data?.meta?.totalRejected || 0}
            active={queryParams?.status === STATUS_ENUM?.rejected}
            onClick={() => {
              onChangeStatus(STATUS_ENUM.rejected)
            }}
            isLoading={isLoading}
          />
        </Col>

        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Paid Order'}
            value={data?.meta?.totalPaid || 0}
            active={queryParams?.status === STATUS_ENUM?.paid}
            onClick={() => {
              onChangeStatus(STATUS_ENUM.paid)
            }}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Unpaid Order'}
            value={data?.meta?.totalUnpaid || 0}
            active={queryParams?.status === STATUS_ENUM?.unpaid}
            onClick={() => {
              onChangeStatus(STATUS_ENUM.unpaid)
            }}
            isLoading={isLoading}
          />
        </Col>
      </Row>

      <Spacer margin={'.5rem auto'} />

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Paid Order Amount'}
            value={moneyFormatter(parseFloat(data?.meta?.totalPaidAmount) || 0)}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Unpaid Order Amount'}
            value={moneyFormatter(
              parseFloat(data?.meta?.totalUnpaidAmount) || 0,
            )}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Amount'}
            value={moneyFormatter(parseFloat(data?.meta?.totalAmount) || 0)}
            isLoading={isLoading}
          />
        </Col>
      </Row>

      <Spacer margin={'1rem auto'} />

      <TableHeader
        actions={null}
        totalData={data?.meta?.currentTotalData || 0}
      />

      <Spacer margin={'.5rem auto'} />

      <Table
        loading={isLoading}
        columns={TABLE_COLUMNS}
        data={data?.data}
        isAction
        onDetail={(e: number) => handleClickAction('detail', e)}
        rowKey={(data: IStockOrderListResponse) => data?.id}
        identifier={'id'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        setIsFetch={setIsFetchList}
      />
    </>
  )
}
export default StockOrder
