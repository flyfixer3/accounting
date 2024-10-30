import { Card } from 'antd'
import dayjs from 'dayjs'
import { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import { cn } from 'src/helpers/class-names'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import useTransactionQuery from '../hooks/useTransactionQuery'
import { AccountingTransaction } from '../types'

export default function TransactionDetail() {
  const params = useParams()
  const { data, isLoading } = useTransactionQuery(params.id)

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className={'detail-title mb-4'}>Transaction Detail</div>
        <DetailRow title={'Label'} value={data?.data.label || '-'} />

        <DetailRow
          title={'Description'}
          value={data?.data.description || '-'}
        />

        <DetailRow
          title={'Transaction Date'}
          value={dayjs(data?.data.date)?.format(
            DATETIME_FORMATTER_ENUM?.primaryWithTime,
          )}
        />
      </Card>
      <Card>
        {isLoading || !data ? (
          <div>Loading...</div>
        ) : (
          <Preview transaction={data.data} />
        )}
      </Card>
    </div>
  )
}

function Preview({ transaction }: { transaction: AccountingTransaction }) {
  let totalDebit = 0
  let totalCredit = 0

  return (
    <div className="flex flex-col gap-4">
      <span className="text-xl font-medium">Transaction Entry</span>
      <div className="grid grid-cols-[3fr_1fr_1fr]">
        <p className="font-medium">Account</p>
        <p className="font-medium">Debit</p>
        <p className="font-medium">Credit</p>
        {transaction.details.map((detail, index) => {
          if (detail.type === 'debit') totalDebit += detail.amount
          if (detail.type === 'credit') totalCredit += detail.amount
          return (
            <Fragment key={index}>
              <p>{`(${detail.subaccount.accounting_account.account_number}-${detail.subaccount.subaccount_number}) ${detail.subaccount.subaccount_name}`}</p>
              {detail.type === 'debit' ? (
                <p>{moneyFormatter(detail.amount)}</p>
              ) : (
                <p />
              )}
              {detail.type === 'credit' ? (
                <p>{moneyFormatter(detail.amount)}</p>
              ) : (
                <p />
              )}
            </Fragment>
          )
        })}
        <p
          className={cn(
            'font-medium',
            totalDebit !== totalCredit && 'text-red-500',
          )}>
          Total
        </p>
        <p
          className={cn(
            'font-medium',
            totalDebit !== totalCredit && 'text-red-500',
          )}>
          {moneyFormatter(totalDebit)}
        </p>
        <p
          className={cn(
            'font-medium',
            totalDebit !== totalCredit && 'text-red-500',
          )}>
          {moneyFormatter(totalCredit)}
        </p>
      </div>
    </div>
  )
}
