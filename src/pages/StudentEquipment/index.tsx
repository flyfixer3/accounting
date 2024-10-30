// @ts-nocheck
import { useEffect } from 'react'
import { useApp } from 'src/context/app.context'
import useStudentEquipmentController from './controller/useStudentEquipmentController'
import { Col, Row } from 'antd'
import CardStatistic from 'src/components/view/CardStatistic/CardStatistic'
import { STATUS_ENUM, DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import Spacer from 'src/components/view/Spacer'
import TableHeader from 'src/components/table/TableHeader'
import SearchInput from 'src/components/input/Search'
import { IStudentEquipmentList } from 'src/models/student-equipment.model'
import { ColumnsType } from 'antd/es/table'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import StatusBadge from 'src/components/view/StatusBadge'
import moment from 'moment'
import Table from 'src/components/table/Table'
import ModalPurchaseEquipment from './components/ModalPurchaseEquipment'

const TABLE_COLUMNS: ColumnsType<IStudentEquipmentList> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'equipmentName',
    key: 'equipmentName',
    render: (data) => data || '-',
    width: 250,
  },
  {
    title: 'Price',
    dataIndex: 'equipmentPrice',
    key: 'equipmentPrice',
    render: (text, record, index) => {
      return `${moneyFormatter(text)}` || `Rp 0`
    },
  },
  {
    title: 'Available Quantity',
    dataIndex: 'qty',
    key: 'qty',
    width: '100px',
    align: 'center',
    render: (data) => data || '-',
  },
  {
    title: 'Status',
    dataIndex: 'equipmentStatus',
    key: 'equipmentStatus',
    render: (data) => {
      return <StatusBadge status={data} />
    },
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '200px',
    ellipsis: true,
    render: (data) =>
      moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime),
  },
  {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: '200px',
    ellipsis: true,
    render: (data) =>
      moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime),
  },
]

const StudentEquipment = () => {
  const { onSetBreadcrumbs } = useApp()
  const {
    onFetchList,
    equipmentData,
    queryParams,
    setQueryParams,
    handleChangeStatus,
    handleClickAction,
    isLoading,
    setIsFetch,
    isModalPurchaseVisible,
    handleModalPurchaseVisibility,
    selectedData,
  } = useStudentEquipmentController()

  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'Student Equipment',
        path: '/student-equipment',
      },
    ])
    onFetchList()
  }, [])

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Equipment Data'}
            value={equipmentData?.meta?.totalData || 0}
            active={queryParams?.status === STATUS_ENUM?.all}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.all)
            }}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Available Equipment'}
            value={equipmentData?.meta?.totalAvailable || 0}
            active={queryParams?.status === STATUS_ENUM?.available}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.available)
            }}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Out of Stock Equipment'}
            value={equipmentData?.meta?.totalOutOfStock || 0}
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
                placeholder="Search by Equipment Name "
                onSearch={async (e: string) => {
                  setQueryParams({ ...queryParams, search: e })
                  setIsFetch()
                }}
              />
            ),
            column: 8,
          },
        ]}
        totalData={equipmentData?.meta?.currentTotalData || 0}
      />

      <Spacer margin={'.5rem auto'} />

      <Table
        loading={isLoading}
        columns={TABLE_COLUMNS}
        data={equipmentData?.data}
        isAction
        onPurchase={(e: string, record: IStudentEquipmentList) =>
          handleClickAction('purchase', e, record)
        }
        rowKey={(data: IStudentEquipmentList) => data?.id}
        identifier={'id'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        onPurchaseDisabled={(record: IStudentEquipmentList) =>
          record?.equipmentStatus === STATUS_ENUM?.outOfStock
        }
        setIsFetch={setIsFetch}
      />

      {isModalPurchaseVisible ? (
        <ModalPurchaseEquipment
          isVisible={isModalPurchaseVisible}
          handleClose={handleModalPurchaseVisibility}
          selectedData={selectedData}
        />
      ) : null}
    </>
  )
}
export default StudentEquipment
