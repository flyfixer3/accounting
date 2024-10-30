// @ts-nocheck
import { Button, Card, Col, Flex, Row } from 'antd'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import { useEffect } from 'react'
import { FiEdit } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { appColors } from 'src/assets/styles/styles'
import SearchInput from 'src/components/input/Search'
import SelectActiveStatus from 'src/components/select/SelectActiveStatus'
import Table from 'src/components/table/Table'
import TableHeader from 'src/components/table/TableHeader'
import CardStatistic from 'src/components/view/CardStatistic/CardStatistic'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import Spacer from 'src/components/view/Spacer'
import StatusBadge from 'src/components/view/StatusBadge'
import { useApp } from 'src/context/app.context'
import { DATETIME_FORMATTER_ENUM, STATUS_ENUM } from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import { IBookStockIBOStockDetailListData } from 'src/models/books.model'
import ModalUpdateStatus from 'src/pages/IBO/Order/components/ModalUpdateStatus'
import ModalAddStock from '../components/ModalAddStock'
import useBookStockDetailController from '../controller/useBookStockDetailController'

import tableStyles from 'src/components/table/index.module.scss'
import ModalUpdateBookNumber from '../components/ModalUpdateBookNumber'

const TABLE_COLUMNS: ColumnsType<IBookStockIBOStockDetailListData> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (data) => data || '-',
  },
  {
    title: 'Book Number',
    dataIndex: 'bookNumber',
    key: 'bookNumber',
    render: (data) => data || '-',
  },
  {
    title: 'Status',
    render: (text, record, index) => {
      return <StatusBadge status={record?.bookStatus} />
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

const BookStockDetail = () => {
  const params = useParams()
  const navigate = useNavigate()

  const {
    detailData,
    stockListData,
    isLoading,
    isSubmitted,
    formErrorMsg,
    isModalAddStockVisible,
    isModalUpdateStockStatuskVisible,
    statusListOptions,
    queryParams,
    stockStatusListOptions,
    selectedData,
    setIsFetch,
    setQueryParams,
    setSelectedData,
    setFormErrorMsg,
    handleModalAddStockVisibility,
    handleSubmitAddStock,
    handleModalUpdateStockStatusVisibility,
    handleSubmitUpdateStockStatus,
    isModalUpdateBookNumberVisible,
    handleModalUpdateBookNumberVisibility,
    onSetFormErrorMsg,
    handleSubmitUpdateBookNumber,
  } = useBookStockDetailController()

  const { onSetBreadcrumbs } = useApp()
  useEffect(() => {
    onSetBreadcrumbs([
      { title: 'Book Stocks', path: '/stock/books' },
      { title: 'Book Stock Detail', path: `/stock/books/${params?.id}` },
    ])
  }, [])

  const _onRenderAddStockBtn = () => {
    return (
      <Button
        onClick={() => {
          handleModalAddStockVisibility()
        }}
        block
        className={tableStyles.actionColumnDetailBtn}>
        <Flex align="center" justify="center">
          <div className={tableStyles?.actionColumnDetailTxt}>+ Add Stock</div>
        </Flex>
      </Button>
    )
  }

  const _onRenderEditBtn = () => {
    return (
      <Button
        onClick={() => {
          navigate(`/stock/books/edit/${detailData?.id}`)
        }}
        block
        type="primary">
        <Flex align="center" justify="center">
          <div>Edit Book</div>
        </Flex>
      </Button>
    )
  }

  const _onRenderActionTableBtn = (data: IBookStockIBOStockDetailListData) => {
    const isDisabled = data?.bookStatus === STATUS_ENUM?.sold
    return (
      <Flex>
        <Button
          onClick={() => {
            setSelectedData(data)
            handleModalUpdateStockStatusVisibility()
          }}
          block
          disabled={isDisabled}
          className={
            isDisabled
              ? tableStyles?.actionColumnDetailBtnDisabled
              : tableStyles.actionColumnDetailBtn
          }>
          <Flex align="center" justify="center">
            <FiEdit
              size={16}
              color={isDisabled ? appColors?.neutral40 : appColors?.blue70}
            />
            <Spacer margin="auto 2px" />
            <div
              className={
                isDisabled
                  ? tableStyles?.actionColumnDetailTxtDisabled
                  : tableStyles?.actionColumnDetailTxt
              }>
              Change Status
            </div>
          </Flex>
        </Button>

        <Spacer margin="auto .5rem" />

        <Button
          onClick={() => {
            setSelectedData(data)
            handleModalUpdateBookNumberVisibility()
          }}
          block
          disabled={isDisabled}
          className={
            isDisabled
              ? tableStyles?.actionColumnDetailBtnDisabled
              : tableStyles.actionColumnDetailBtn
          }>
          <Flex align="center" justify="center">
            <FiEdit
              size={16}
              color={isDisabled ? appColors?.neutral40 : appColors?.blue70}
            />
            <Spacer margin="auto 2px" />
            <div
              className={
                isDisabled
                  ? tableStyles?.actionColumnDetailTxtDisabled
                  : tableStyles?.actionColumnDetailTxt
              }>
              Change Book Number
            </div>
          </Flex>
        </Button>
      </Flex>
    )
  }

  return (
    <>
      <Row>
        <Col xs={24}>
          <Card>
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={16}>
                <div className={'detail-title'}>Book Stock Detail</div>
              </Col>
              <Col xs={24} sm={4}>
                <Flex justify="end">{_onRenderAddStockBtn()}</Flex>
              </Col>
              <Col xs={24} sm={4}>
                <Flex justify="end">{_onRenderEditBtn()}</Flex>
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

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Available'}
            value={stockListData?.meta?.totalAvailable || 0}
            active={null}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Damaged'}
            value={stockListData?.meta?.totalDamaged || 0}
            active={null}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Sold'}
            value={stockListData?.meta?.totalSold || 0}
            active={null}
            isLoading={isLoading}
          />
        </Col>
      </Row>

      <Spacer margin={'1rem auto'} />

      <TableHeader
        justifyContentRow="start"
        actions={[
          {
            key: 'search',
            children: (
              <SearchInput
                placeholder="Search by Book number "
                onSearch={async (e: string) => {
                  setQueryParams({ ...queryParams, search: e })
                  setIsFetch()
                }}
              />
            ),
            column: 8,
          },
          {
            key: 'status',
            children: (
              <SelectActiveStatus
                handleChange={async (e: string) => {
                  setQueryParams({ ...queryParams, status: e })
                  setIsFetch()
                }}
                value={queryParams?.status}
                list={stockStatusListOptions}
                withAll={true}
              />
            ),
            column: 4,
          },
        ]}
        totalData={stockListData?.meta?.currentTotalData || 0}
      />

      <Spacer margin={'.5rem auto'} />

      <Table
        loading={isLoading}
        columns={TABLE_COLUMNS}
        data={stockListData?.data}
        isAction
        onRenderAction={(record: IBookStockIBOStockDetailListData) =>
          _onRenderActionTableBtn(record)
        }
        rowKey={(data: IBookStockIBOStockDetailListData) => data?.id}
        identifier={'id'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        setIsFetch={setIsFetch}
      />

      <Spacer margin={'2rem auto'} />

      {isModalAddStockVisible ? (
        <ModalAddStock
          isVisible={isModalAddStockVisible}
          handleClose={handleModalAddStockVisibility}
          onSubmit={handleSubmitAddStock}
          formErrorMsg={formErrorMsg}
          isSubmitted={isSubmitted}
          title="Add Book Stock"
        />
      ) : null}

      {isModalUpdateStockStatuskVisible ? (
        <ModalUpdateStatus
          isVisible={isModalUpdateStockStatuskVisible}
          handleClose={() => {
            handleModalUpdateStockStatusVisibility()
            setFormErrorMsg('')
          }}
          title="Update Book Stock Status"
          statusListOptions={statusListOptions}
          onSubmit={handleSubmitUpdateStockStatus}
          isSubmitted={isSubmitted}
          formErrorMsg={formErrorMsg}
        />
      ) : null}

      {isModalUpdateBookNumberVisible ? (
        <ModalUpdateBookNumber
          isVisible={isModalUpdateBookNumberVisible}
          handleClose={handleModalUpdateBookNumberVisibility}
          onSubmit={handleSubmitUpdateBookNumber}
          formErrorMsg={formErrorMsg}
          onSetFormErrorMsg={onSetFormErrorMsg}
          isSubmitted={isSubmitted}
          selectedData={selectedData}
        />
      ) : null}
    </>
  )
}

export default BookStockDetail
