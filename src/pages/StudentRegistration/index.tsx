// @ts-nocheck
import { useEffect } from 'react'
import useStudentRegistrationController from './controller/useStudentRegistrationController'
import { Button, Col, Flex, Row } from 'antd'
import CardStatistic from 'src/components/view/CardStatistic/CardStatistic'
import { STATUS_ENUM, DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import Spacer from 'src/components/view/Spacer'
import TableHeader from 'src/components/table/TableHeader'
import SearchInput from 'src/components/input/Search'
import { useNavigate } from 'react-router-dom'
import Table from 'src/components/table/Table'
import moment from 'moment'
import { ColumnsType } from 'antd/es/table'
import { IStudentRegistrationListData } from 'src/models/student-registration.model'
import useCourseVoucherCountController from '../CourseVoucher/controller/useCourseVoucherCountController'

const TABLE_COLUMNS: ColumnsType<IStudentRegistrationListData> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (data) => data || '-',
  },
  {
    title: 'Student Number',
    dataIndex: 'studentRegistrationNumber',
    key: 'studentRegistrationNumber',
    render: (data) => data || '-',
  },
  {
    title: 'Student Name',
    render: (text, record, index) => {
      return record?.student?.studentName || '-'
    },
  },
  {
    title: 'Student Email',
    render: (text, record, index) => {
      return record?.student?.studentEmail || '-'
    },
  },
  {
    title: 'Course',
    width: '250px',
    ellipsis: true,
    render: (text, record, index) => {
      return `${record?.studentCourseDetail?.course?.courseName || '-'}`
    },
  },
  {
    title: 'Course Level',
    width: '250px',
    ellipsis: true,
    render: (text, record, index) => {
      return `${
        record?.studentCourseDetail?.courseLevel?.courseLevelName || '-'
      }`
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
]

const StudentRegistration = () => {
  const navigate = useNavigate()

  const {
    onSetBreadcrumbs,
    studentRegistData,
    queryParams,
    setQueryParams,
    isLoading,
    handleChangeStatus,
    handleClickAction,
    setIsFetch,
  } = useStudentRegistrationController()

  const { courseVoucherCountData, isCourseVoucherCountLoading } =
    useCourseVoucherCountController()

  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'Student Registration',
        path: '/student-registration',
      },
    ])
  }, [])

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Student Registration Data'}
            value={studentRegistData?.meta?.totalData || 0}
            active={queryParams?.status === STATUS_ENUM?.all}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.all)
            }}
            isLoading={isLoading}
          />
        </Col>
      </Row>
      
      <Spacer margin="1rem auto" />

      <Row>
        <Col xs={24}>
          <div className="section-title-primary">
            Available Course Voucher
          </div>
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
        {
        courseVoucherCountData?.length > 0 && courseVoucherCountData?.map((item, idx) => {
            return (
              <Col xs={24} sm={8} key={idx}>
                <CardStatistic
                  title={`Total Voucher Course ${item?.courseName}`}
                  value={item?.totalAvailable || 0}
                  isLoading={isCourseVoucherCountLoading}
                />
              </Col>
            )
          })
        }
      </Row>

      <Spacer margin={'1rem auto'} />

      <TableHeader
        actions={[
          {
            key: 'search',
            children: (
              <SearchInput
                placeholder="Search by Registered Student ID and Name "
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
                  onClick={() => navigate('/student-registration/add')}>
                  + Add Student Registration
                </Button>
              </Flex>
            ),
            column: 10,
          },
        ]}
        totalData={studentRegistData?.meta?.currentTotalData || 0}
      />

      <Table
        loading={isLoading}
        columns={TABLE_COLUMNS}
        data={studentRegistData?.data}
        isAction
        onDetail={(e: string, detail: IStudentRegistrationListData) =>
          handleClickAction('detail', e, detail)
        }
        rowKey={(data: IStudentRegistrationListData) => data?.id}
        identifier={'id'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        allowEdit={false}
        setIsFetch={setIsFetch}
      />
      <Spacer margin={'1rem auto'} />
    </>
  )
}

export default StudentRegistration
