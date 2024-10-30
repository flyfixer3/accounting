// @ts-nocheck
import { Button, Col, Flex, Row } from 'antd'
import React, { useEffect } from 'react'
import useTeacherController from './controller/useTeacherController'
import CardStatistic from 'src/components/view/CardStatistic/CardStatistic'
import Spacer from 'src/components/view/Spacer'
import TableHeader from 'src/components/table/TableHeader'
import SearchInput from 'src/components/input/Search'
import { DATETIME_FORMATTER_ENUM, TEACHER_STATUS_ENUM } from 'src/enums/enums'
import Table from 'src/components/table/Table'
import { ColumnsType } from 'antd/es/table'
import { ITeacherTableData } from '@src/models/teacher.model'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import TeacherStatusBadge from './components/TeacherStatusBadge'
import SelectCourse from 'src/components/select/SelectCourse/SelectCourse'

const TABLE_COLUMNS: ColumnsType<ITeacherTableData> = [
  {
    title: 'Number',
    dataIndex: 'teacherNumber',
    key: 'teacherNumber',
    render: (data) => data || '-',
  },
  {
    title: 'Email',
    dataIndex: 'teacherEmail',
    key: 'teacherEmail',
    render: (data) => data || '-',
  },
  {
    title: 'Phone Number',
    dataIndex: 'teacherPhoneNumber',
    key: 'teacherPhoneNumber',
    render: (data) => data || '-',
  },
  {
    title: 'Name',
    dataIndex: 'teacherName',
    key: 'teacherName',
    width: '250px',
    ellipsis: true,
    render: (data) => data || '-',
  },
  {
    title: 'Join Date',
    dataIndex: 'teacherJoinDate',
    key: 'teacherJoinDate',
    width: '250px',
    ellipsis: true,
    render: (data) =>
      data ? moment(data)?.format(DATETIME_FORMATTER_ENUM?.primary) : '-',
  },
  {
    title: 'Course',
    width: '250px',
    ellipsis: true,
    render: (text, record, index) => {
      return `${record?.teacherCourse?.courseName} - ${record?.teacherCourse?.courseLevelName}`
    },
  },
  {
    title: 'Education',
    render: (text, record, index) => {
      return `${record?.teacherEducation?.name}`
    },
  },
  {
    title: 'Status',
    dataIndex: 'teacherStatus',
    key: 'teacherStatus',
    render: (data) => {
      return <TeacherStatusBadge status={data} />
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

const Teacher: React.FC = () => {
  const navigate = useNavigate()
  const {
    onFetchList,
    teacherData,
    queryParams,
    setQueryParams,
    setIsFetch,
    handleClickAction,
    isLoading,
    handleChangeStatus,
  } = useTeacherController()

  useEffect(() => {
    onFetchList()
  }, [onFetchList])

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Teacher'}
            value={teacherData?.meta?.totalData || 0}
            active={queryParams?.status === TEACHER_STATUS_ENUM?.all}
            onClick={() => {
              handleChangeStatus(TEACHER_STATUS_ENUM.all)
            }}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Active Teacher'}
            value={teacherData?.meta?.totalActiveData || 0}
            active={queryParams?.status === TEACHER_STATUS_ENUM?.active}
            onClick={() => {
              handleChangeStatus(TEACHER_STATUS_ENUM.active)
            }}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Inactive Teacher'}
            value={teacherData?.meta?.totalInactiveData || 0}
            active={queryParams?.status === TEACHER_STATUS_ENUM?.inactive}
            onClick={() => {
              handleChangeStatus(TEACHER_STATUS_ENUM.inactive)
            }}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Resign Teacher'}
            value={teacherData?.meta?.totalResignData || 0}
            active={queryParams?.status === TEACHER_STATUS_ENUM?.resign}
            onClick={() => {
              handleChangeStatus(TEACHER_STATUS_ENUM.resign)
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
                placeholder="Search by Teacher Number and Name "
                onSearch={async (e: string) => {
                  setQueryParams({ ...queryParams, search: e })
                  setIsFetch()
                }}
              />
            ),
            column: 8,
          },
          {
            key: 'course',
            children: (
              <SelectCourse
                value={queryParams?.courseId}
                handleChange={(e: number) => {
                  setQueryParams({ ...queryParams, courseId: e })
                  setIsFetch()
                }}
              />
            ),
            column: 6,
          },
          {
            key: 'add',
            children: (
              <Flex justify="flex-end">
                <Button
                  type={'primary'}
                  onClick={() => {
                    navigate(`/teacher/add`)
                  }}>
                  + Add Teacher
                </Button>
              </Flex>
            ),
            column: 10,
          },
        ]}
        totalData={teacherData?.meta?.currentTotalData || 0}
      />

      <Spacer margin={'.5rem auto'} />

      <Table
        loading={isLoading}
        columns={TABLE_COLUMNS}
        data={teacherData?.data}
        isAction
        onDetail={(e: string) => handleClickAction('detail', e)}
        onEdit={(e: string, record: any) =>
          handleClickAction('edit', e, record)
        }
        rowKey={(data: ITeacherTableData) => data?.teacherNumber}
        identifier={'teacherNumber'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        allowEdit={true}
        setIsFetch={setIsFetch}
      />
    </>
  )
}

export default Teacher
