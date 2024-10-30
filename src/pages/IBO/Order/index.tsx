// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { useEffect } from 'react'
import { DATETIME_FORMATTER_ENUM, STATUS_ENUM } from 'src/enums/enums'
import { Col, Row } from 'antd'

import Spacer from 'src/components/view/Spacer'
import CardStatistic from 'src/components/view/CardStatistic/CardStatistic'
import TableHeader from 'src/components/table/TableHeader'
import Table from 'src/components/table/Table'
import { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import StatusBadge from 'src/components/view/StatusBadge'
import moment from 'moment'
import SearchInput from 'src/components/input/Search'
import { IIBOOrderListResponse } from 'src/models/order.model'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import useOrderController from './controller/useOrderController'

const Order = () => {
  const navigate = useNavigate()
  const { onSetBreadcrumbs } = useApp()

  const {
    isLoading,
    data,
    queryParams,
    setQueryParams,
    onRefetch,
    handleChangeStatus,
    handleClickAction,
    setIsFetch,
  } = useOrderController()

  const TABLE_COLUMNS: ColumnsType<IIBOOrderListResponse> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (data) => data || '-',
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

  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'TC Order List',
        path: '/order',
      },
    ])
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
              handleChangeStatus(STATUS_ENUM.all)
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
              handleChangeStatus(STATUS_ENUM.pending)
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
              handleChangeStatus(STATUS_ENUM.rejected)
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
              handleChangeStatus(STATUS_ENUM.paid)
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
              handleChangeStatus(STATUS_ENUM.unpaid)
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
        actions={[
          {
            key: 'search',
            children: (
              <SearchInput
                placeholder="Search by Training Center name"
                onSearch={async (e: string) => {
                  setQueryParams({ ...queryParams, search: e })
                  setIsFetch()
                }}
              />
            ),
            column: 8,
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
        rowKey={(data: IIBOOrderListResponse) => data?.id}
        identifier={'id'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        setIsFetch={setIsFetch}
      />
    </>
  )
}

export default Order
