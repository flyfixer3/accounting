// @ts-nocheck
import { Card, Col, Row } from 'antd'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Table from 'src/components/table/Table'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import Spacer from 'src/components/view/Spacer'
import { useApp } from 'src/context/app.context'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import { IBookStockIBOStockDetailListData } from 'src/models/books.model'

import useBookStockStockDetailController from '../controller/useBookStockStockDetailController'

const TABLE_COLUMNS: ColumnsType<IBookStockIBOStockDetailListData> = [
  {
    title: 'Description',
    dataIndex: 'description',
    render: (data) => data || '-',
  },
  {
    title: 'Prev Stock',
    dataIndex: 'prevStock',
    key: 'prevStock',
    render: (data) => data || '-',
  },
  {
    title: 'Quantity Change',
    dataIndex: 'quantity',
    key: 'quantity',
    render: (data) => data || '-',
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

const BookStockStockDetail = () => {
  const params = useParams()

  const {
    detailData,
    stockListData,
    isLoading,
    queryParams,
    setIsFetch,
    setQueryParams,
  } = useBookStockStockDetailController()

  const { onSetBreadcrumbs } = useApp()
  useEffect(() => {
    onSetBreadcrumbs([
      { title: 'Book Stocks', path: '/stock/books' },
      {
        title: 'Book Stock History',
        path: `/stock/books/${params?.id}/stock`,
      },
    ])
  }, [])

  return (
    <>
      <Row>
        <Col xs={24}>
          <Card>
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={16}>
                <div className={'detail-title'}>Book Stock History</div>
              </Col>
            </Row>

            <Spacer margin={'.5rem'} />

            <DetailRow
              title={'Book Name'}
              value={detailData?.bookName || '-'}
            />

            <DetailRow
              title={'Book Price'}
              value={moneyFormatter(parseFloat(detailData?.bookPrice) || 0)}
            />

            <DetailRow
              title={'Created At'}
              value={
                detailData?.createdAt
                  ? moment(detailData?.createdAt)?.format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />

            <DetailRow
              title={'Edited At'}
              value={
                detailData?.updatedAt
                  ? moment(detailData?.updatedAt)?.format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />
          </Card>
        </Col>
      </Row>

      <Spacer margin="1rem auto" />

      <Spacer margin={'1rem auto'} />

      <Spacer margin={'.5rem auto'} />

      <Table
        loading={isLoading}
        columns={TABLE_COLUMNS}
        data={stockListData?.data}
        isAction
        rowKey={(data: IBookStockIBOStockDetailListData) => data?.id}
        identifier={'id'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        setIsFetch={setIsFetch}
      />

      <Spacer margin={'2rem auto'} />
    </>
  )
}

export default BookStockStockDetail
