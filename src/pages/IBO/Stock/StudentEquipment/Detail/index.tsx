// @ts-nocheck
import { Button, Card, Col, Flex, Row } from 'antd'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Table from 'src/components/table/Table'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import Spacer from 'src/components/view/Spacer'
import { useApp } from 'src/context/app.context'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import { IEquipmentStockStockDetailListData } from 'src/models/student-equipment.model'
import useStudentEquipmentStockDetailController from '../controller/useStudentEquipmentStockDetailController'

const TABLE_COLUMNS: ColumnsType<IEquipmentStockStockDetailListData> = [
  {
    title: 'ID',
    dataIndex: 'equipmentId',
    key: 'id',
    render: (data) => data || '-',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    render: (data) => data || '-',
  },
  {
    title: 'Prev Stock',
    dataIndex: 'prevStock',
    key: 'prevStock',
    render: (data) => data || '-',
  },
  {
    title: 'Quantity Change',
    dataIndex: 'quantity',
    key: 'quantity',
    render: (data) => data || '-',
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

const StudentEquipmentStockDetail = () => {
  const params = useParams()
  const navigate = useNavigate()

  const {
    detailData,
    stockListData,
    isLoading,
    onRefetchDetail,
    queryParams,
    setQueryParams,
  } = useStudentEquipmentStockDetailController()

  const { onSetBreadcrumbs } = useApp()
  useEffect(() => {
    onSetBreadcrumbs([
      { title: 'Student Equipment Stocks', path: '/stock/student-equipment' },
      {
        title: 'Student Equipment Stock Detail',
        path: `/stock/student-equipment/${params?.id}`,
      },
    ])
  }, [])

  return (
    <>
      <Spacer margin="1rem auto" />

      <Row>
        <Col xs={24}>
          <Card>
            <Row>
              <Col xs={24} sm={20}>
                <div className={'detail-title'}>
                  Student Equipment Stock Detail
                </div>
              </Col>
              <Col xs={24} sm={4}>
                <Flex justify="end">
                  <Button
                    type="primary"
                    onClick={() => {
                      navigate(
                        `/stock/student-equipment/edit/${detailData?.id}`,
                      )
                    }}>
                    Edit Equipment
                  </Button>
                </Flex>
              </Col>
            </Row>

            <Spacer margin={'.5rem'} />

            <DetailRow
              title={'Equipment Name'}
              value={detailData?.equipmentName || '-'}
            />

            <DetailRow
              title={'Equipment Price'}
              value={moneyFormatter(
                parseFloat(detailData?.equipmentPrice) || 0,
              )}
            />

            <DetailRow
              title={'Equipment Quantity'}
              value={parseInt(detailData?.qty) || 0}
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

      <Spacer margin={'2rem auto'} />

      <Table
        loading={isLoading}
        columns={TABLE_COLUMNS}
        data={stockListData?.data}
        isAction
        rowKey={(data: IEquipmentStockStockDetailListData) => data?.id}
        identifier={'id'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        setIsFetch={onRefetchDetail}
      />
    </>
  )
}

export default StudentEquipmentStockDetail
