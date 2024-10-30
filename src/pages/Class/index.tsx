// @ts-nocheck
import { useEffect } from 'react'
import useClassController from './controller/useClassController'
import { Button, Col, Flex, Row } from 'antd'
import CardStatistic from 'src/components/view/CardStatistic/CardStatistic'
import { STATUS_ENUM, DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import Spacer from 'src/components/view/Spacer'
import TableHeader from 'src/components/table/TableHeader'
import SearchInput from 'src/components/input/Search'
import { useNavigate } from 'react-router-dom'
import { ColumnsType } from 'antd/es/table'
import { IClassData } from 'src/models/class.model'
import StatusBadge from 'src/components/view/StatusBadge'
import moment from 'moment'
import Table from 'src/components/table/Table'

const TABLE_COLUMNS: ColumnsType<IClassData> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (data) => data || '-',
  },
  {
    title: 'Name',
    dataIndex: 'className',
    key: 'className',
    render: (data) => data || '-',
  },
  {
    title: 'Date & Time',
    render: (text, record, index) => {
      return `${record?.classDay || '-'} (${record?.classStartTime || '-'} - ${
        record?.classEndTime || '-'
      })`
    },
  },
  {
    title: 'Teacher',
    dataIndex: 'classTeacher',
    key: 'classTeacher',
    render: (text, record, index) => {
      return record?.classTeacher?.teacherName || '-'
    },
  },
  {
    title: 'Course',
    width: '250px',
    ellipsis: true,
    render: (text, record, index) => {
      return `${record?.classCourse?.courseName || '-'} - ${
        record?.classCourseLevel?.courseLevelName || '-'
      }`
    },
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
    width: '250px',
    ellipsis: true,
    render: (data) =>
      moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime),
  },
]

const Class = () => {
  const navigate = useNavigate()
  const {
    onSetBreadcrumbs,
    onRefetch,
    classData,
    isLoading,
    setIsFetch,
    queryParams,
    setQueryParams,
    handleChangeStatus,
    handleClickAction,
  } = useClassController()

  useEffect(() => {
    onRefetch()
  }, [])

  useEffect(() => {
    onSetBreadcrumbs([{ title: 'Class', path: '/class' }])
  }, [])
  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Class'}
            value={classData?.meta?.totalData || 0}
            active={queryParams?.status === STATUS_ENUM?.all}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.all)
            }}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Active Class'}
            value={classData?.meta?.totalActiveData || 0}
            active={queryParams?.status === STATUS_ENUM?.active}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.active)
            }}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Inactive Class'}
            value={classData?.meta?.totalInactiveData || 0}
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
                placeholder="Search by Class ID and Name "
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
                <Button type={'primary'} onClick={() => navigate('/class/add')}>
                  + Add Class
                </Button>
              </Flex>
            ),
            column: 10,
          },
        ]}
        totalData={classData?.meta?.currentTotalData || 0}
      />

      <Spacer margin={'.5rem auto'} />

      <Table
        loading={isLoading}
        columns={TABLE_COLUMNS}
        data={classData?.data}
        isAction
        onDetail={(e: string) => handleClickAction('detail', e)}
        onEdit={(e: string, record: any) =>
          handleClickAction('edit', e, record)
        }
        rowKey={(data: IClassData) => data?.id}
        identifier={'id'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        allowEdit={true}
        setIsFetch={setIsFetch}
      />
    </>
  )
}

export default Class
