// @ts-nocheck
import { Button, Col, Flex, Row } from 'antd'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchInput from 'src/components/input/Search'
import Table from 'src/components/table/Table'
import TableHeader from 'src/components/table/TableHeader'
import CardStatistic from 'src/components/view/CardStatistic/CardStatistic'
import Spacer from 'src/components/view/Spacer'
import { useApp } from 'src/context/app.context'
import { DATETIME_FORMATTER_ENUM, STATUS_ENUM } from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import { IStudentEquipmentStockIBOListData } from 'src/models/student-equipment.model'
import useStudentEquipmentStockListController from './controller/useStudentEquipmentStockListController'

const TABLE_COLUMNS: ColumnsType<IStudentEquipmentStockIBOListData> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (data) => data || '-',
  },
  {
    title: 'Equipment Name',
    dataIndex: 'equipmentName',
    key: 'equipmentName',
    render: (data) => data || '-',
    align: 'center',
  },
  {
    title: 'Equipment Price',
    render: (text, record, index) => {
      return `${moneyFormatter(parseFloat(record?.equipmentPrice) || 0)}`
    },
    align: 'center',
    ellipsis: true,
    width: '250px',
  },
  {
    title: 'Total Stock',
    dataIndex: 'qty',
    key: 'qty',
    render: (data) => data || '-',
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

const StudentEquipmentStock = () => {
  const navigate = useNavigate()

  const { onSetBreadcrumbs } = useApp()

  const {
    onRefetch,
    data,
    queryParams,
    setQueryParams,
    handleChangeStatus,
    handleClickAction,
    isLoading,
    setIsFetch,
  } = useStudentEquipmentStockListController()

  useEffect(() => {
    onSetBreadcrumbs([
      { title: 'Student Equipment Stocks', path: '/stock/student-equipment' },
    ])
    onRefetch()
  }, [])

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Equipment Data'}
            value={data?.meta?.totalEquipmentData || 0}
            active={queryParams?.status === STATUS_ENUM?.all}
            onClick={() => {
              handleChangeStatus(STATUS_ENUM.all)
            }}
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Out of Stock Equipment '}
            value={data?.meta?.totalOutOfStock || 0}
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
                placeholder="Search by Equipment name "
                onSearch={async (e: string) => {
                  setQueryParams({ ...queryParams, search: e })
                  setIsFetch()
                }}
              />
            ),
            column: 8,
          },
          {
            key: 'order',
            children: (
              <Flex justify="flex-end">
                <Button
                  type={'primary'}
                  onClick={() => {
                    navigate('/stock/student-equipment/add')
                  }}>
                  + New Equipment
                </Button>
              </Flex>
            ),
            column: 16,
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
        onDetail={(e: number) => handleClickAction('detail', e)}
        onEdit={(e: number) => handleClickAction('edit', e)}
        rowKey={(data: IStudentEquipmentStockIBOListData) => data?.id}
        allowEdit
        identifier={'id'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        setIsFetch={setIsFetch}
      />
    </>
  )
}

export default StudentEquipmentStock
