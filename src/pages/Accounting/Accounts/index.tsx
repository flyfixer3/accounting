import { useMutation } from '@tanstack/react-query'
import { Table as AntdTable, Button, Col, Flex, Row } from 'antd'
import { ColumnsType } from 'antd/es/table'
import axios from 'axios'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchInput from 'src/components/input/Search'
import Table from 'src/components/table/Table'
import TableHeader from 'src/components/table/TableHeader'
import CardStatistic from 'src/components/view/CardStatistic/CardStatistic'
import Spacer from 'src/components/view/Spacer'
import { useApp } from 'src/context/app.context'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import useToastError from 'src/hooks/useToastError'
import { BASE_URL } from 'src/services/api.service'
import ModalCreateAccount from '../components/ModalCreateAccount'
import { useAccountsQuery } from '../hooks/useAccountsQuery'
import { AccountingAccount, AccountingSubaccount } from '../types'

const COLUMNS: ColumnsType<AccountingAccount> = [
  {
    title: 'Account Number',
    dataIndex: 'account_number',
    key: 'account_number',
    render: (data) => data || '-',
  },
  {
    title: 'Account Name',
    dataIndex: 'account_name',
    key: 'account_name',
    render: (data) => data || '-',
  },
  {
    title: 'Is Active?',
    dataIndex: 'is_active',
    key: 'is_active',
    render: (data) => (data ? 'Yes' : 'No'),
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    render: (data) => data || '-',
  },
  {
    title: 'Subaccounts',
    dataIndex: 'subaccounts',
    key: 'subaccounts',
    render: (data) => data.length || '-',
  },
]

export default function AccountingAccountPage() {
  const [editedData, setEditedData] = useState<AccountingAccount | null>(null)
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)
  const { onSetBreadcrumbs } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState({ search: '' })

  useEffect(() => {
    onSetBreadcrumbs?.([{ title: 'Accounts', path: '/accounting/accounts' }])
  }, [])

  const { data, isLoading, refetch } = useAccountsQuery(query)

  const {
    mutate: initAccounts,
    isPending: isInitingAccounts,
    error,
  } = useMutation({
    mutationFn: async () => {
      await axios.post(`${BASE_URL}/accounting/accounts/init`)
    },
    onSuccess: () => {
      refetch()
    },
  })
  useToastError(error, 'Error initializing accounts')

  if (data?.page.data.length === 0) {
    return (
      <div className="flex flex-col max-w-md mx-auto gap-2 pt-8">
        <span className="text-xl font-bold">
          Please initialize accounting accounts
        </span>
        <span>
          We will create default accounts needed for the system to operate
        </span>
        <Button
          loading={isInitingAccounts}
          onClick={() => initAccounts()}
          className="mt-2"
          size="large"
          type="primary">
          Initialize Accounts
        </Button>
      </div>
    )
  }

  const INTERNAL_TABLE_COLUMNS: ColumnsType<
    AccountingSubaccount & { account_number: string }
  > = [
    {
      title: 'Subaccount Number',
      dataIndex: 'subaccount_number',
      key: 'subaccount_number',
      render: (el) => `${el}` || '-',
    },
    {
      title: 'Name',
      dataIndex: 'subaccount_name',
      key: 'subaccount_name',
      render: (data) => data || '-',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (data) => data || '-',
    },
    {
      title: 'Total Debit',
      dataIndex: 'total_debit',
      key: 'total_debit',
      render: (text, record, index) => {
        return `${moneyFormatter(text)}` || `Rp0`
      },
      align: 'center',
    },
    {
      title: 'Total Credit',
      dataIndex: 'total_credit',
      key: 'total_credit',
      render: (text, record, index) => {
        return `${moneyFormatter(text)}` || `Rp0`
      },
      align: 'center',
    },
    {
      title: 'Is Active?',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (data) => (data ? 'Yes' : 'No'),
    },

    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (data) =>
        dayjs(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime),
    },
  ]

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Data'}
            value={data?.page.total || 0}
            active
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
                placeholder="Search account"
                onSearch={async (e: string) => {
                  setQuery({ ...query, search: e })
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
                    setEditedData(null)
                    setIsOpenCreateModal(true)
                  }}>
                  + Create Account
                </Button>
              </Flex>
            ),
            column: 16,
          },
        ]}
        totalData={data?.meta.total || 0}
      />
      <Spacer margin="auto .5rem" />
      <Table
        expandable={{
          rowExpandable: (record) => record.subaccounts.length > 0,
          expandedRowRender: (record: AccountingAccount) => (
            <AntdTable
              pagination={false}
              columns={INTERNAL_TABLE_COLUMNS}
              dataSource={record.subaccounts.map((o) => ({
                ...o,
                account_number: record.account_number,
              }))}
            />
          ),
        }}
        loading={isLoading}
        columns={COLUMNS}
        data={data?.page.data}
        isAction
        rowKey={(data: AccountingAccount) => data?.account_number}
        identifier={'account_number'}
        allowEdit={true}
        onDetail={(e) => {
          navigate(`/accounting/accounts/${e}`)
        }}
        onEdit={(e, record: any) => {
          setEditedData(record)
          setIsOpenCreateModal(true)
        }}
      />
      {isOpenCreateModal && (
        <ModalCreateAccount
          onSuccess={refetch}
          isVisible={isOpenCreateModal}
          handleClose={() => {
            setIsOpenCreateModal(false)
          }}
          title={
            editedData
              ? `Edit Account ${editedData?.account_name}`
              : 'Create New Account'
          }
          editedData={editedData}
        />
      )}
    </>
  )
}
