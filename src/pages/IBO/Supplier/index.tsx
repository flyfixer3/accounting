// @ts-nocheck
import { Button, Col, Flex, Row } from 'antd'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import { useEffect } from 'react'
import SearchInput from 'src/components/input/Search'
import Table from 'src/components/table/Table'
import TableHeader from 'src/components/table/TableHeader'
import CardStatistic from 'src/components/view/CardStatistic/CardStatistic'
import Spacer from 'src/components/view/Spacer'
import { useApp } from 'src/context/app.context'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import { ISupplierDataResponse } from 'src/models/supplier.model'
import useSupplierController from './controller/useSupplierController'

const TABLE_COLUMNS: ColumnsType<ISupplierDataResponse> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Supplier Name',
    dataIndex: 'supplierName',
    key: 'supplierName',
    render: (supplierName) => supplierName,
  },
  {
    title: 'Supplier Address',
    dataIndex: 'supplierAddress',
    key: 'supplierAddress',
    render: (supplierAddress) => supplierAddress,
  },
  {
    title: 'Supplier Contact',
    dataIndex: 'supplierPhoneNumber',
    key: 'supplierContact',
    render: (supplierPhoneNumber, supplierData) => supplierPhoneNumber || supplierData.supplierEmail ? (
        <>
            {supplierPhoneNumber ? <div>{supplierPhoneNumber || '-'}</div> : null}
            {supplierData.supplierEmail ? <div>{supplierData.supplierEmail}</div> : null}
        </>
    ) : '-',
  },
  {
    title: 'Supplier PIC',
    dataIndex: 'supplierPicName',
    key: 'supplierPicName',
    render: (supplierPicName) => supplierPicName || '-',
  },
  {
    title: 'Supplier PIC Contact',
    dataIndex: 'supplierPicPhoneNumber',
    key: 'supplierPicPhoneNumber',
    render: (supplierPicPhoneNumber) => supplierPicPhoneNumber || '-',
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

const Supplier = () => {
  const { onSetBreadcrumbs } = useApp()

  const {
    isLoading,
    data,
    queryParams,
    setQueryParams,
    handleClickAction,
    setIsFetch,
  } = useSupplierController()

  useEffect(() => {
    onSetBreadcrumbs([{ title: 'Supplier', path: '/suppliers' }])
    setIsFetch()
  }, [])

  return (
    <>
      <Row>
        <Col xs={24}>
          <div className="section-title-primary">Data Information</div>
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Data'}
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
                placeholder="Search by Supplier Name"
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
                  onClick={() => handleClickAction('add')}>
                  + Add Supplier Data
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
        allowEdit={true}
        rowKey={(data: ISupplierDataResponse) => data?.id}
        identifier={'id'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        setIsFetch={setIsFetch}
        onDetail={(e: number) => handleClickAction('detail', e)}
        onEdit={(e: number) => handleClickAction('edit', e)}
      />
    </>
  )
}

export default Supplier
