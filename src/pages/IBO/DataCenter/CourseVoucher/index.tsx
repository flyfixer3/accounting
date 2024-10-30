// @ts-nocheck
import { Col, Row } from 'antd'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import { useEffect } from 'react'
import SearchInput from 'src/components/input/Search'
import Table from 'src/components/table/Table'
import TableHeader from 'src/components/table/TableHeader'
import CardStatistic from 'src/components/view/CardStatistic/CardStatistic'
import Spacer from 'src/components/view/Spacer'
import { useApp } from 'src/context/app.context'
import { COURSE_VOUCHER_BUNDLE, DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import { ICourseVoucherIBOPriceListData } from 'src/models/course-voucher.model'
import ModalUpdate from './components/ModalUpdate'
import useCourseVoucherController from './controller/useCourseVoucherController'

const TABLE_COLUMNS: ColumnsType<ICourseVoucherIBOPriceListData> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (data) => data || '-',
  },
  {
    title: 'Course Number',
    render: (text, record, index) => {
      return record.course.courseNumber
    },
    align: 'center',
  },
  {
    title: 'Course Name',
    render: (text, record, index) => {
      return record.course.courseName
    },
    align: 'center',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: (text, record, index) => {
      return `${moneyFormatter(text || 0)}`
    },
    align: 'center',
  },
  {
    title: 'Stock',
    dataIndex: 'stock',
    key: 'stock',
    render: (text, record, index) => {
      return `${text} (${Math.floor(text / COURSE_VOUCHER_BUNDLE.quantity)} Bundle)`
    },
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

const CourseVoucherDataCenter = () => {
  const { onSetBreadcrumbs } = useApp()

  const {
    data,
    queryParams,
    isLoading,
    isModalUpdateVisible,
    isSubmitted,
    formErrorMsg,
    selectedData,
    onRefetch,
    setIsFetch,
    setFormErrorMsg,
    setQueryParams,
    onSetSelectedData,
    handleModalUpdateVisibility,
    handleSubmitUpdateData,
    onSetFormErrorMsg,
  } = useCourseVoucherController()

  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'Course Voucher',
        path: '/data-center/course-voucher',
      },
    ])
    onRefetch()
  }, [])

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Course Voucher'}
            value={data?.meta?.totalData || 0}
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
                placeholder="Search by Course Number or Course Name"
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
        onEdit={(e: number, record: ICourseVoucherIBOPriceListData) => {
          onSetSelectedData(record)
          handleModalUpdateVisibility()
        }}
        rowKey={(data: ICourseVoucherIBOPriceListData) => data?.id}
        identifier={'id'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        setIsFetch={setIsFetch}
        allowEdit={true}
      />

      {isModalUpdateVisible ? (
        <ModalUpdate
          isSubmitted={isSubmitted}
          isVisible={isModalUpdateVisible}
          handleClose={handleModalUpdateVisibility}
          handleSubmit={handleSubmitUpdateData}
          formErrorMsg={formErrorMsg}
          selectedData={selectedData}
          onSetFormErrorMsg={onSetFormErrorMsg}
        />
      ) : null}
    </>
  )
}

export default CourseVoucherDataCenter
