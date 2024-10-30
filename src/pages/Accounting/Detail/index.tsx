import { useQuery } from '@tanstack/react-query'
import { Button, Col, Row } from 'antd'
import Card from 'antd/es/card/Card'
import { ColumnsType } from 'antd/es/table'
import axios from 'axios'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Table from 'src/components/table/Table'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import Spacer from 'src/components/view/Spacer'
import { useApp } from 'src/context/app.context'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import { BASE_URL } from 'src/services/api.service'
import ModalCreateAccount from '../components/ModalCreateAccount'
import ModalCreateSubaccount from '../components/ModalCreateSubaccount'
import { AccountingAccount, AccountingSubaccount } from '../types'

export default function AccountingDetail() {
  const [editedData, setEditedData] = useState<AccountingSubaccount | null>(
    null,
  )
  const [isOpenUpsertModal, setIsOpenUpsertModal] = useState(false)
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)
  const params = useParams()
  const id = params.id

  const { onSetBreadcrumbs } = useApp()
  useEffect(() => {
    onSetBreadcrumbs?.([
      {
        title: 'Accounts',
        path: '/accounting/accounts',
      },
      {
        title: 'Account Detail',
        path: `/accounting/accounts/${params?.id}`,
      },
    ])
  }, [])

  const {
    data: res,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['account', id],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/accounting/accounts/${id}`)
      return res.data as { data: AccountingAccount }
    },
    enabled: !!id,
  })
  const data = res?.data

  const TABLE_COLUMNS: ColumnsType<AccountingSubaccount> = [
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
        moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime),
    },
  ]

  return (
    <>
      <Row>
        <Col xs={24}>
          <Card loading={isLoading}>
            <div className="flex items-center justify-between gap-4">
              <div className={'detail-title'}>{data?.account_name || '-'}</div>
              <div className={'flex items-center gap-3'}>
                <Button
                  type="default"
                  onClick={() => {
                    setIsOpenEditModal(true)
                  }}>
                  Edit
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setEditedData(null)
                    setIsOpenUpsertModal(true)
                  }}>
                  + Create subaccount
                </Button>
              </div>
            </div>

            <Spacer margin={'.5rem'} />

            <DetailRow title={'Account Number'} value={data?.account_number} />

            <DetailRow title={'Description'} value={data?.description} />

            <DetailRow
              title={'Is Active'}
              renderValue={data?.is_active ? 'Yes' : 'No'}
            />

            <DetailRow
              title={'Created At'}
              value={
                data?.created_at
                  ? moment(data?.created_at).format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />

            <DetailRow
              title={'Edited At'}
              value={
                data?.updated_at
                  ? moment(data?.updated_at).format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />
          </Card>
        </Col>
      </Row>

      <Spacer margin={'1rem'} />

      <Row>
        <Col xs={24}>
          <Card>
            {data && data.subaccounts.length > 0 ? (
              <Table
                loading={isLoading}
                columns={TABLE_COLUMNS}
                data={data.subaccounts}
                isAction
                allowEdit
                onEdit={(e, record: any) => {
                  setEditedData(record)
                  setIsOpenUpsertModal(true)
                }}
                rowKey={(data: AccountingSubaccount) => data?.id}
                identifier={'id'}
              />
            ) : (
              <div>No subaccounts yet.</div>
            )}
          </Card>
        </Col>
      </Row>

      <Spacer margin={'1rem'} />

      {isOpenUpsertModal && data && (
        <ModalCreateSubaccount
          account={data}
          onSuccess={refetch}
          isVisible={isOpenUpsertModal}
          handleClose={() => {
            setIsOpenUpsertModal(false)
          }}
          title={
            editedData
              ? `Edit Subaccount ${editedData?.subaccount_name}`
              : 'Create New Subaccount'
          }
          editedData={editedData}
        />
      )}
      {isOpenEditModal && data && (
        <ModalCreateAccount
          onSuccess={refetch}
          isVisible={isOpenEditModal}
          handleClose={() => {
            setIsOpenEditModal(false)
          }}
          title={`Edit Account ${data?.account_name}`}
          editedData={data}
        />
      )}
    </>
  )
}
