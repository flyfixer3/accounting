// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { useEffect } from 'react'
import useDiscountVoucherController from './controller/useDiscountVoucherController'
import { IDiscountVoucherData } from 'src/models/discount-voucher.model'
import { ColumnsType } from 'antd/es/table'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import StatusBadge from 'src/components/view/StatusBadge'
import moment from 'moment'
import { DATETIME_FORMATTER_ENUM, STATUS_ENUM } from 'src/enums/enums'
import SearchInput from 'src/components/input/Search'
import { Col, Row } from 'antd'
import CardStatistic from 'src/components/view/CardStatistic/CardStatistic'
import Spacer from 'src/components/view/Spacer'
import TableHeader from 'src/components/table/TableHeader'
import Table from 'src/components/table/Table'
import { useNavigate } from 'react-router-dom'

const DiscountVoucher = () => {
  const navigate = useNavigate()
  const { onSetBreadcrumbs } = useApp()
  const {
    data,
    onRefetch,
    queryParams,
    setQueryParams,
    setIsFetch,
    handleChangeStatus,
    isLoading,
  } = useDiscountVoucherController()
  const TABLE_COLUMNS: ColumnsType<IDiscountVoucherData> = [
    {
      title: 'Code',
      dataIndex: 'voucherCode',
      key: 'voucherCode',
      render: (data) => data || '-',
    },
    {
      title: 'Student Name - Email',
      render: (text, record, index) => {
        return (
          <div
            onClick={() => navigate(`/student/${record.student.id}`)}
            className="link-title">{`${record?.student?.studentName || ''} - ${
            record?.student?.studentEmail || '-'
          }`}</div>
        )
      },
    },

    {
      title: 'Discount Value',
      render: (text, record, index) => {
        const discountValue: string = record?.voucherDiscountPercentage
          ? `${record?.voucherDiscountPercentage}%`
          : `${moneyFormatter(parseFloat(record?.voucherDiscountValue))}`

        return discountValue
      },
      align: 'center',
    },
    {
      title: 'Status',
      render: (text, record, index) => {
        return <StatusBadge status={record?.voucherStatus} />
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
  ]

  const TABLE_HEADER = [
    {
      key: 'search',
      children: (
        <SearchInput
          placeholder="Search by Voucher Code or Student Name"
          onSearch={async (e: string) => {
            setQueryParams({ ...queryParams, search: e })
            setIsFetch()
          }}
        />
      ),
      column: 8,
    },
  ]

  useEffect(() => {
    onSetBreadcrumbs([{ title: 'Discount Voucher', path: '/discount-voucher' }])
    onRefetch()
  }, [])

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Voucher'}
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
            title={'Total Available Voucher'}
            value={data?.meta?.totalAvailable || 0}
            active={queryParams?.status === STATUS_ENUM?.available}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.available)
            }}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Redeemed Voucher'}
            value={data?.meta?.totalRedemeed || 0}
            active={queryParams?.status === STATUS_ENUM?.redeemed}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.redeemed)
            }}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Expired Voucher'}
            value={data?.meta?.totalExpired || 0}
            active={queryParams?.status === STATUS_ENUM?.expired}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.expired)
            }}
            isLoading={isLoading}
          />
        </Col>
      </Row>

      <Spacer margin={'1rem auto'} />

      <TableHeader
        actions={TABLE_HEADER}
        totalData={data?.meta?.currentTotalData || 0}
      />

      <Spacer margin={'.5rem auto'} />

      <Table
        loading={isLoading}
        columns={TABLE_COLUMNS}
        data={data?.data}
        isAction
        rowKey={(data: IDiscountVoucherData) => data?.id}
        identifier={'id'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        setIsFetch={setIsFetch}
      />
    </>
  )
}

export default DiscountVoucher
