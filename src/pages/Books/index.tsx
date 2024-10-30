// @ts-nocheck
import { Button, Col, Flex, Row } from 'antd'
import confirm from 'antd/es/modal/confirm'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import { useEffect } from 'react'
import { AiFillExclamationCircle } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { appColors } from 'src/assets/styles/styles'
import SearchInput from 'src/components/input/Search'
import Table from 'src/components/table/Table'
import TableHeader from 'src/components/table/TableHeader'
import CardStatistic from 'src/components/view/CardStatistic/CardStatistic'
import Spacer from 'src/components/view/Spacer'
import { useAuth } from 'src/context/auth.context'
import {
  DATETIME_FORMATTER_ENUM,
  STATUS_ENUM,
  USER_ROLE_ENUM,
} from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import { IBookData } from 'src/models/books.model'
import BookStatusBadge from './components/BookStatusBadge'
import ModalPurchaseBook from './components/ModalPurchaseBook'
import useBooksController from './controller/useBooksController'

const TABLE_COLUMNS: ColumnsType<IBookData> = [
  {
    title: 'Number',
    dataIndex: 'bookNumber',
    key: 'bookNumber',
    render: (data) => data || '-',
  },
  {
    title: 'Name',
    dataIndex: 'bookName',
    key: 'bookName',
    render: (data) => data || '-',
  },
  {
    title: 'Price',
    dataIndex: 'bookPrice',
    key: 'bookPrice',
    render: (text, record, index) => {
      return `${moneyFormatter(text)}`
    },
    align: 'center',
  },
  {
    title: 'Status',
    render: (text, record, index) => {
      return <BookStatusBadge status={record?.bookStatus} />
    },
    align: 'center',
  },
  {
    title: 'Bought At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '250px',
    ellipsis: true,
    render: (data) =>
      moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime),
  },
  {
    title: 'Sold At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: '250px',
    ellipsis: true,
    render: (data, record) => {
      if (data === record.createdAt) {
        return '-'
      }
      return moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime)
    },
  },
]

const Books = () => {
  const navigate = useNavigate()

  const { getUserRole } = useAuth()

  const {
    onSetBreadcrumbs,
    onRefetch,
    bookData,
    queryParams,
    setQueryParams,
    isLoading,
    handleChangeStatus,
    setIsFetch,
    handleClickAction,
    isSubmitted,
    isModalPurchaseVisible,
    selectedData,
    handleModalPurchaseVisibility,
  } = useBooksController()

  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'Books',
        path: '/books',
      },
    ])
    onRefetch()
  }, [])

  const tableHeader = [
    {
      key: 'search',
      children: (
        <SearchInput
          placeholder="Search by Book Number and Name "
          onSearch={async (e: string) => {
            setQueryParams({ ...queryParams, search: e })
            setIsFetch()
          }}
        />
      ),
      column: 8,
    },
  ]

  if (getUserRole === USER_ROLE_ENUM.ibo) {
    tableHeader.push({
      key: 'add',
      children: (
        <Flex justify="flex-end">
          <Button type={'primary'} onClick={() => navigate('/books/add')}>
            + Add Book
          </Button>
        </Flex>
      ),
      column: 10,
    })
  }

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Books'}
            value={bookData?.meta?.totalData || 0}
            active={queryParams?.status === STATUS_ENUM?.all}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.all)
            }}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Available Books'}
            value={bookData?.meta?.totalAvailableData || 0}
            active={queryParams?.status === STATUS_ENUM?.available}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.available)
            }}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Taken Books'}
            value={bookData?.meta?.totalTakenData || 0}
            active={queryParams?.status === STATUS_ENUM?.taken}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.taken)
            }}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Damaged Books'}
            value={bookData?.meta?.totalDamagedData || 0}
            active={queryParams?.status === STATUS_ENUM?.damaged}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.damaged)
            }}
            isLoading={isLoading}
          />
        </Col>
      </Row>

      <Spacer margin={'1rem auto'} />

      <TableHeader
        actions={tableHeader}
        totalData={bookData?.meta?.currentTotalData || 0}
      />

      <Spacer margin={'.5rem auto'} />

      <Table
        loading={isLoading}
        columns={TABLE_COLUMNS}
        data={bookData?.data}
        isAction
        onDetail={(e: string) => handleClickAction('detail', e)}
        onEdit={(e: string, record: IBookData) =>
          confirm({
            title: (
              <div style={{ marginLeft: 4 }}>Edit Book Status Confirmation</div>
            ),
            icon: (
              <AiFillExclamationCircle color={appColors?.yellow30} size={18} />
            ),
            closable: true,
            content: (
              <>
                <div style={{ marginLeft: 4 }}>
                  Do you want to change book ({record?.bookNumber}) status to{' '}
                  <span style={{ fontWeight: 600 }}>DAMAGED</span> ?
                </div>
              </>
            ),
            okButtonProps: {
              loading: isSubmitted,
              disabled: isSubmitted,
            },
            onOk: async () => {
              await handleClickAction('edit', record.id, record)
              setIsFetch()
            },
          })
        }
        onPurchase={(e: string, record: IBookData) =>
          handleClickAction('purchase', e, record)
        }
        rowKey={(data: IBookData) => data?.bookNumber}
        identifier={'bookNumber'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        allowEdit={true}
        onEditDisabled={(record: IBookData): boolean => {
          return (
            record?.bookStatus === STATUS_ENUM?.damaged ||
            record?.bookStatus === STATUS_ENUM.taken
          )
        }}
        onPurchaseDisabled={(record: IBookData): boolean => {
          return (
            record?.bookStatus === STATUS_ENUM?.damaged ||
            record?.bookStatus === STATUS_ENUM.taken
          )
        }}
        setIsFetch={setIsFetch}
      />

      {isModalPurchaseVisible ? (
        <ModalPurchaseBook
          isVisible={isModalPurchaseVisible}
          handleClose={handleModalPurchaseVisibility}
          selectedData={selectedData}
        />
      ) : null}
    </>
  )
}

export default Books
