// @ts-nocheck
import { Button, Col, Flex, Row } from 'antd'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchInput from 'src/components/input/Search'
import Table from 'src/components/table/Table'
import TableHeader from 'src/components/table/TableHeader'
import CardStatistic from 'src/components/view/CardStatistic/CardStatistic'
import Spacer from 'src/components/view/Spacer'
import { useApp } from 'src/context/app.context'
import { DATETIME_FORMATTER_ENUM, STATUS_ENUM } from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import { IBookStockIBOListData } from 'src/models/books.model'
import useBookStockListController from './controller/useBookStockListController'

const TABLE_COLUMNS: ColumnsType<IBookStockIBOListData> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (data) => data || '-',
  },
  {
    title: 'Book Name',
    dataIndex: 'bookName',
    key: 'bookName',
    render: (data) => data || '-',
    align: 'center',
  },
  {
    title: 'Book Price',
    render: (text, record, index) => {
      return `${moneyFormatter(parseFloat(record?.bookPrice) || 0)}`
    },
    align: 'center',
    ellipsis: true,
    width: '250px',
  },
  {
    title: 'Total Available Stock',
    dataIndex: 'totalAvailableBook',
    key: 'totalAvailableBook',
    render: (data) => data,
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

const BookStock = () => {
  const navigate = useNavigate()

  const { onSetBreadcrumbs } = useApp()

  const {
    onRefetch,
    data,
    queryParams,
    setQueryParams,
    handleChangeStatus,
    handleClickAction,
    setIsFetch,
    isLoading,
  } = useBookStockListController()

  useEffect(() => {
    onSetBreadcrumbs([{ title: 'Book Stocks', path: '/stock/books' }])
    onRefetch()
  }, [])

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Book Data'}
            value={data?.meta?.totalBookData || 0}
            active={queryParams?.status === STATUS_ENUM?.all}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.all)
            }}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Out of Stock Book'}
            value={data?.meta?.totalOutOfStock || 0}
            active={queryParams?.status === STATUS_ENUM?.outOfStock}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.outOfStock)
            }}
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
                placeholder="Search by Book name "
                onSearch={async (e: string) => {
                  setQueryParams({ ...queryParams, search: e })
                  setIsFetch()
                }}
              />
            ),
            column: 8,
          },
          {
            key: 'order',
            children: (
              <Flex justify="flex-end">
                <Button
                  type={'primary'}
                  onClick={() => {
                    navigate('/stock/books/add')
                  }}>
                  + New Book
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
        onEdit={(e: number) => handleClickAction('edit', e)}
        onStockDetail={(e: number) => handleClickAction('stockDetail', e)}
        rowKey={(data: IBookStockIBOListData) => data?.id}
        allowEdit
        identifier={'id'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        setIsFetch={setIsFetch}
      />
    </>
  )
}

export default BookStock
