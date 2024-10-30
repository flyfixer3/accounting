// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { useEffect } from 'react'
import useTrainingCenterUserController from './controller/useTrainingCenterController'
import moment from 'moment'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import { ColumnsType } from 'antd/es/table'
import { IUserTrainingCenterData } from 'src/models/user.model'
import TableHeader from 'src/components/table/TableHeader'
import Spacer from 'src/components/view/Spacer'
import Table from 'src/components/table/Table'
import SearchInput from 'src/components/input/Search'
import { Button, Flex } from 'antd'
import { useNavigate } from 'react-router-dom'

const TABLE_COLUMNS: ColumnsType<IUserTrainingCenterData> = [
  {
    title: 'Training Center Number',
    dataIndex: 'trainingCenterNumber',
    key: 'trainingCenterNumber',
    render: (data) => data || '-',
  },
  {
    title: 'Training Center Name',
    dataIndex: 'trainingCenterName',
    key: 'trainingCenterName',
    render: (data) => data || '-',
  },
  {
    title: 'Training Center Email',
    dataIndex: 'trainingCenterEmail',
    key: 'trainingCenterEmail',
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

const TrainingCenterUser = () => {
  const navigate = useNavigate()
  const { onSetBreadcrumbs } = useApp()

  const {
    isLoading,
    data,
    queryParams,
    setQueryParams,
    onRefetch,
    handleClickAction,
    setIsFetch,
    isFetch,
  } = useTrainingCenterUserController()

  useEffect(() => {
    if (isFetch) onRefetch()
  }, [isFetch])

  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'Training Center',
        path: '/user/training-center',
      },
    ])
    onRefetch()
  }, [])

  return (
    <>
      <TableHeader
        actions={[
          {
            key: 'search',
            children: (
              <SearchInput
                placeholder="Search by Training Center name"
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
                  onClick={() => {
                    navigate('/user/training-center/add')
                  }}>
                  + Add New Training Center
                </Button>
              </Flex>
            ),
            column: 10,
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
        onDetail={(e: string) => handleClickAction('detail', e)}
        onEdit={(e: string) => handleClickAction('edit', e)}
        rowKey={(data: IUserTrainingCenterData) => data?.trainingCenterNumber}
        identifier={'trainingCenterNumber'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        setIsFetch={setIsFetch}
        allowEdit={true}
      />
    </>
  )
}
export default TrainingCenterUser
