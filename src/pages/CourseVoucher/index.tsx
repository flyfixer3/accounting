// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { useEffect } from 'react'
import useCourseVoucherController from './controller/useCourseVoucherController'
import { ColumnsType } from 'antd/es/table'
import { ICourseVoucherData } from 'src/models/course-voucher.model'
import StatusBadge from 'src/components/view/StatusBadge'
import moment from 'moment'
import { DATETIME_FORMATTER_ENUM, STATUS_ENUM } from 'src/enums/enums'
import { Button, Col, Flex, Modal, Row } from 'antd'
import CardStatistic from 'src/components/view/CardStatistic/CardStatistic'
import Spacer from 'src/components/view/Spacer'
import TableHeader from 'src/components/table/TableHeader'
import Table from 'src/components/table/Table'
import ModalOrderCourseVoucher from './components/ModalOrderCourseVoucher'
import DetailRow from 'src/components/view/DetailRow/DetailRow'

const TABLE_COLUMNS: ColumnsType<ICourseVoucherData> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (data) => data || '-',
  },
  {
    title: 'Course',
    render: (text, record, index) => {
      return record.course.courseName
    },
    align: 'center',
  },
  {
    title: 'Bundle Quantity',
    dataIndex: 'bundleQty',
    key: 'bundleQty',
    render: (data) => parseInt(data || 0),
    align: 'center',
  },
  {
    title: 'Status',
    render: (text, record, index) => {
      return <StatusBadge status={record?.orderCourseVoucherStatus} />
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

const CourseVoucher = () => {
  const { onSetBreadcrumbs } = useApp()
  const {
    isLoading,
    data,
    queryParams,
    isModalOrderVisible,
    setIsFetch,
    setQueryParams,
    onRefetch,
    handleChangeStatus,
    handleOrderModalVisibility,
  } = useCourseVoucherController()

  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'Course Voucher',
        path: '/course-voucher',
      },
    ])
    onRefetch()
  }, [])

  const _onClickDetail = (data: ICourseVoucherData) => {
    Modal.info({
      icon: null,
      closable: true,
      title: `Course Voucher Detail`,
      content: (
        <>
          <DetailRow
            title={'Status'}
            renderValue={
              data?.orderCourseVoucherStatus ? (
                <StatusBadge status={data?.orderCourseVoucherStatus} />
              ) : (
                '-'
              )
            }
          />

          <DetailRow
            title={'Reject Reason'}
            value={data?.rejectReason || '-'}
          />
        </>
      ),
    })
  }

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
            title={'Total Accepted Voucher'}
            value={data?.meta?.totalAccepted || 0}
            active={queryParams?.status === STATUS_ENUM?.accepted}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.accepted)
            }}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Rejected Voucher'}
            value={data?.meta?.totalRejected || 0}
            active={queryParams?.status === STATUS_ENUM?.rejected}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.rejected)
            }}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Pending Voucher'}
            value={data?.meta?.totalPending || 0}
            active={queryParams?.status === STATUS_ENUM?.pending}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.pending)
            }}
            isLoading={isLoading}
          />
        </Col>
      </Row>

      <Spacer margin={'1rem auto'} />

      <TableHeader
        actions={[
          {
            key: 'order',
            children: (
              <Flex justify="flex-end">
                <Button type={'primary'} onClick={handleOrderModalVisibility}>
                  + Order Course Voucher
                </Button>
              </Flex>
            ),
            column: 24,
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
        onDetail={(e: string, record: ICourseVoucherData) =>
          _onClickDetail(record)
        }
        onDetailDisabled={(record: ICourseVoucherData) =>
          record?.orderCourseVoucherStatus !== STATUS_ENUM?.rejected
        }
        rowKey={(data: ICourseVoucherData) => data?.id}
        identifier={'id'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        setIsFetch={setIsFetch}
      />

      {isModalOrderVisible ? (
        <ModalOrderCourseVoucher
          isVisible={isModalOrderVisible}
          handleClose={handleOrderModalVisibility}
          onRefetch={onRefetch}
        />
      ) : null}
    </>
  )
}

export default CourseVoucher
