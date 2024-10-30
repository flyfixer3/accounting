import { PDFDownloadLink } from '@react-pdf/renderer'
import { Button, DatePicker, Select } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useApp } from 'src/context/app.context'
import { useSubaccounts } from '../components/SubaccountSelect'
import { useAccountsQuery } from '../hooks/useAccountsQuery'
import { useAllTransactionsQuery } from '../hooks/useTransactionsQuery'
import IncomePdf from './IncomePdf'
import JournalPdf from './JournalPdf'
import NeracaPdf from './NeracaPdf'
import moment from 'moment'

export default function ReportsPage() {
  const { onSetBreadcrumbs } = useApp()
  const [startDateVal, setStartDateVal] = useState<dayjs.Dayjs | null>(null)
  const [endDateVal, setEndDateVal] = useState<dayjs.Dayjs | null>(null)
  const [monthVal, setMonthVal] = useState<number | undefined>(undefined)
  const { data: allTransactions } = useAllTransactionsQuery({
    startDate: startDateVal?.format('YYYY-MM-DD'),
    endDate: endDateVal?.format('YYYY-MM-DD'),
    month: monthVal
  })
  
  const { data: accounts } = useAccountsQuery()
  
  const [month, setMonth] = useState<number | undefined>(undefined)
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null)
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null)

  const { data: subaccounts } = useSubaccounts()
  const MONTHS = Array.from({ length: 12 }).map((_, i) => ({
    value: moment().month(i).get('month') + 1,
    label: moment().month(i).format('MMMM'),
  }))

  // const APP_START_YEAR = 2023
  // const CUTOFF_DAY = 28
  // const isThisMonthSalaryPayable = moment().day() >= CUTOFF_DAY
  // const defaultFilterDate = isThisMonthSalaryPayable
  //   ? moment()
  //   : moment().subtract(1, 'months')

  // const years = Array.from({
  //   length: new Date().getFullYear() - APP_START_YEAR,
  // })
  const months = MONTHS;
  useEffect(() => {
    onSetBreadcrumbs?.([{ title: 'Reports', path: '/accounting/reports' }])
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-medium">Generate Transaction Reports</h1>
      <div className="flex gap-4 items-center">
        <span className="whitespace-nowrap">Choose period</span>
        <div className="flex items-center gap-2">
          <DatePicker
            value={startDate}
            format={'YYYY-MM-DD'}
            onChange={(val) => setStartDate(val)}
            disabledDate={(date) => date.isAfter(dayjs())}
          />
          <DatePicker
            value={endDate}
            format={'YYYY-MM-DD'}
            onChange={(val) => setEndDate(val)}
            disabledDate={(date) =>
              !date.isAfter(startDate) || date.isAfter(dayjs())
            }
          />
           <Select
                options={months}
                // loading={isLoading}
                value={month}
                onChange={(value) => 
                    setMonth(parseInt(value.toString()))
                }
                placeholder="Month"
              />
          <Button
            disabled={!startDate || !endDate}
            onClick={() => {
              setStartDateVal(startDate)
              setEndDateVal(endDate)
              setMonthVal(month)
            }}>
            Confirm
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {allTransactions && (
          <PDFDownloadLink
            document={<JournalPdf transactions={allTransactions} />}
            fileName={`journal.pdf`}>
            {({ blob, url, loading, error }) => (
              <Button
                type={'default'}
                disabled={!startDateVal || !endDateVal}
                loading={loading}>
                Journal
              </Button>
            )}
          </PDFDownloadLink>
        )}
        {allTransactions && subaccounts && (
          <PDFDownloadLink
            document={
              <IncomePdf
                transactions={allTransactions}
                subaccounts={subaccounts}
              />
            }
            fileName={`income.pdf`}>
            {({ blob, url, loading, error }) => (
              <Button
                type={'default'}
                loading={loading}
                disabled={!startDateVal || !endDateVal}>
                Income
              </Button>
            )}
          </PDFDownloadLink>
        )}
        {allTransactions && subaccounts && accounts && (
          <PDFDownloadLink
            document={
              <NeracaPdf
                transactions={allTransactions}
                subaccounts={subaccounts}
                accounts={accounts.page.data}
              />
            }
            fileName={`neraca.pdf`}>
            {({ blob, url, loading, error }) => (
              <Button
                type={'default'}
                loading={loading}
                disabled={!startDateVal || !endDateVal}>
                Neraca
              </Button>
            )}
          </PDFDownloadLink>
        )}
      </div>
    </div>
  )
}
