import { Table, TD, TH, TR } from '@ag-media/react-pdf-table'
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { useMemo } from 'react'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import { AccountingTransaction } from '../types'

export default function IncomePdf({
  transactions,
  subaccounts,
}: {
  transactions: AccountingTransaction[] | undefined
  subaccounts:
    | {
        id: number
        subaccount_name: string
        subaccount_number: string
        account_number: string
      }[]
    | undefined
}) {
  const styles = StyleSheet.create({
    page: {
      backgroundColor: 'white',
    },
    section: {
      margin: 16,
      padding: 8,
    },
  })

  const totalPerSubaccount = useMemo(() => {
    const subaccountMap = new Map<string, number>()
    transactions?.forEach((tx) => {
      tx.details.forEach((detail) => {
        const key = detail.subaccount.subaccount_number
        const value = subaccountMap.get(key) || 0
        subaccountMap.set(
          key,
          detail.type === 'debit'
            ? value + detail.amount
            : value - detail.amount,
        )
      })
    })
    return subaccountMap
  }, [transactions])

  const incomeAccounts = subaccounts?.filter(
    (subaccount) =>
      subaccount.account_number === '13' || subaccount.account_number === '14',
  )
  const costAccounts = subaccounts?.filter(
    (subaccount) =>
      subaccount.account_number === '15' || subaccount.account_number === '16' || subaccount.account_number === '17',
  )

  let totalIncome = 0
  let totalCosts = 0

  return (
    <Document>
      {/** Page defines a single page of content. */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={{ textAlign: 'center', marginBottom: '12px' }}>
            Income Report
          </Text>
          <Table
            tdStyle={{
              padding: '2px',
              fontSize: '12px',
            }}
            weightings={[0.2, 0.4, 0.2, 0.2]}>
            <TH
              style={{
                fontSize: 14,
                fontWeight: 'bold',
              }}>
              <TD>Account Number</TD>
              <TD>Account Name</TD>
              <TD>Debit</TD>
              <TD>Credit</TD>
            </TH>
            <TR>
              <TD weighting={1}>Income</TD>
            </TR>
            {incomeAccounts?.map((acc, idx) => {
              const amount = totalPerSubaccount.get(acc.subaccount_number)
              totalIncome -= amount || 0
              if (!amount) return null
              return (
                <TR key={idx}>
                  <TD>{acc.subaccount_number}</TD>
                  <TD>{acc.subaccount_name}</TD>
                  <TD>{amount && amount > 0 && moneyFormatter(amount)}</TD>
                  <TD>{amount && amount < 0 && moneyFormatter(-amount)}</TD>
                </TR>
              )
            })}
            <TR>
              <TD>Total Income</TD>
              <TD></TD>
              <TD></TD>
              <TD>{moneyFormatter(totalIncome)}</TD>
            </TR>
            <TR>
              <TD weighting={1}> </TD>
            </TR>

            <TR>
              <TD weighting={1}>Costs</TD>
            </TR>
            {costAccounts?.map((acc, idx) => {
              const amount = totalPerSubaccount.get(acc.subaccount_number)
              totalCosts += amount || 0
              if (!amount) return null
              return (
                <TR key={idx}>
                  <TD>{acc.subaccount_number}</TD>
                  <TD>{acc.subaccount_name}</TD>
                  <TD>{amount && amount > 0 && moneyFormatter(amount)}</TD>
                  <TD>{amount && amount < 0 && moneyFormatter(-amount)}</TD>
                </TR>
              )
            })}
            <TR>
              <TD>Total Costs</TD>
              <TD></TD>
              <TD>({moneyFormatter(totalCosts)})</TD>
              <TD></TD>
            </TR>
            <TR>
              <TD>Total</TD>
              <TD></TD>
              <TD></TD>
              <TD>{moneyFormatter(totalIncome - totalCosts)}</TD>
            </TR>
          </Table>
        </View>
      </Page>
    </Document>
  )
}
