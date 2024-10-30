// @ts-nocheck
import CardStatistic from 'src/components/view/CardStatistic/CardStatistic'
import { Button, Col, Flex, Row } from 'antd'
import SearchInput from 'src/components/input/Search'
import Spacer from 'src/components/view/Spacer'
import Table from 'src/components/table/Table'
import TableHeader from 'src/components/table/TableHeader'
import { ICourseTableData } from 'src/models/course.model'
import { ColumnsType } from 'antd/es/table'
import { moneyFormatter, truncateString } from 'src/helpers/formatter.helper'
import useCourseController from './controller/useCourseController'
import { useEffect } from 'react'
import {
  STATUS_ENUM,
  DATETIME_FORMATTER_ENUM,
  USER_ROLE_ENUM,
} from 'src/enums/enums'
import StatusBadge from 'src/components/view/StatusBadge'
import moment from 'moment'
import ModalCreateCourse from './components/ModalCreateCourse'
import { useAuth } from 'src/context/auth.context'

const TABLE_COLUMNS: ColumnsType<ICourseTableData> = [
  {
    title: 'Number',
    dataIndex: 'courseNumber',
    key: 'courseNumber',
    render: (data) => data || '-',
  },
  {
    title: 'Name',
    dataIndex: 'courseName',
    key: 'courseName',
    render: (data) => data || '-',
  },
  {
    title: 'Level',
    dataIndex: 'courseLevelList',
    key: 'courseLevelList',
    render: (data) => {
      if (data?.length > 0) {
        const string = data
          ?.map((item: { id: number; name: string }) => item?.name)
          ?.join(', ')

        return truncateString(string, 30)
      } else return '-'
    },
    width: 200,
  },
  {
    title: 'Registration Fee',
    dataIndex: 'courseRegistrationFee',
    key: 'courseRegistrationFee',
    render: (text, record, index) => {
      return `${moneyFormatter(text || 0)}`
    },
    align: 'center',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (data) => {
      return <StatusBadge status={data} />
    },
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (data) =>
      moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime),
  },
]

const Course = () => {
  const {
    onFetch,
    onRefetch,
    setIsFetch,
    courseData,
    queryParams,
    setQueryParams,
    handleChangeStatus,
    handleClickAction,
    isLoading,
    isModalCreateCourseVisible,
    setIsModalCreateCourseVisible,
    editCourse,
    isSubmitting,
    formErrorMsg,
    handleSubmitCourseForm,
  } = useCourseController()

  const { getUserRole } = useAuth()

  useEffect(() => {
    onRefetch()
  }, [])

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Course'}
            value={courseData?.meta?.totalData || 0}
            active={queryParams?.status === STATUS_ENUM?.all}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.all)
            }}
            isLoading={isLoading}
          />
        </Col>

        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Active Course'}
            value={courseData?.meta?.totalActiveData || 0}
            active={queryParams?.status === STATUS_ENUM?.active}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.active)
            }}
            isLoading={isLoading}
          />
        </Col>

        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Inactive Course'}
            value={courseData?.meta?.totalInactiveData || 0}
            active={queryParams?.status === STATUS_ENUM?.inactive}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.inactive)
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
                placeholder="Search by course number or course name "
                onSearch={async (e: string) => {
                  setQueryParams({ ...queryParams, search: e })
                  setIsFetch()
                }}
              />
            ),
            column: 8,
          },
          getUserRole === USER_ROLE_ENUM?.ibo
            ? {
                key: 'add',
                children: (
                  <Flex justify="flex-end">
                    <Button
                      type={'primary'}
                      onClick={() => setIsModalCreateCourseVisible()}>
                      + Add Course
                    </Button>
                  </Flex>
                ),
                column: 16,
              }
            : null,
        ]}
        totalData={courseData?.meta?.currentTotalData || 0}
      />

      <Spacer margin={'.5rem auto'} />

      <Table
        loading={isLoading}
        columns={TABLE_COLUMNS}
        data={courseData?.data}
        isAction
        onDetail={(e: string) => handleClickAction('detail', e)}
        onEdit={(e: string, record: any) =>
          handleClickAction('edit', e, record)
        }
        rowKey={(data: ICourseTableData) => data?.courseNumber}
        identifier={'courseNumber'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        allowEdit={getUserRole === USER_ROLE_ENUM?.ibo}
        setIsFetch={setIsFetch}
      />

      {isModalCreateCourseVisible ? (
        <ModalCreateCourse
          isVisible={isModalCreateCourseVisible}
          handleClose={() => {
            setIsModalCreateCourseVisible()
          }}
          title={
            editCourse
              ? `Edit Course ${editCourse?.courseName}`
              : 'Create New Course'
          }
          editedData={editCourse}
          handleSubmitForm={handleSubmitCourseForm}
          isSubmitting={isSubmitting}
          formErrorMsg={formErrorMsg}
        />
      ) : null}
    </>
  )
}

export default Course
