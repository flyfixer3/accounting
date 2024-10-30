import { Table, TD, TH, TR } from '@ag-media/react-pdf-table'
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { Fragment, useMemo } from 'react'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import { AccountingTransaction } from '../types'

export default function NeracaPdf({
  transactions,
  subaccounts,
  accounts,
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
  accounts: {
    id: number
    account_name: string
    account_number: string
  }[]
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

  const { totalPerSubaccount } = useMemo(() => {
    const totalPerSubaccount = new Map<string, number>()
    transactions?.forEach((tx) => {
      tx.details.forEach((detail) => {
        const key = detail.subaccount.subaccount_number
        const value = totalPerSubaccount.get(key) || 0
        totalPerSubaccount.set(
          key,
          detail.type === 'debit'
            ? value + detail.amount
            : value - detail.amount,
        )
      })
    })
    return { totalPerSubaccount }
  }, [transactions])

  const subaccountsMap = useMemo(() => {
    const subaccountsMap = new Map<string, string[]>()
    subaccounts?.forEach((subaccount) => {
      const curr = subaccountsMap.get(subaccount.account_number) ?? []
      subaccountsMap.set(subaccount.account_number, [
        ...curr,
        subaccount.subaccount_number,
      ])
    })
    return subaccountsMap
  }, [subaccounts])

  return (
    <Document>
      {/** Page defines a single page of content. */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={{ textAlign: 'center', marginBottom: '12px' }}>
            Neraca Report
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
            {accounts.map((acc) => {
              let total = 0
              return (
                <Fragment key={acc.account_number}>
                  <TR>
                    <TD weighting={1}>{acc.account_name}</TD>
                  </TR>
                  {subaccountsMap.get(acc.account_number)?.map((subaccount) => {
                    const amount = totalPerSubaccount.get(subaccount)
                    total += amount ?? 0
                    if (!amount) return null
                    return (
                      <TR key={subaccount}>
                        <TD>{subaccount}</TD>
                        <TD>{subaccount}</TD>
                        <TD>
                          {amount && amount > 0 && moneyFormatter(amount)}
                        </TD>
                        <TD>
                          {amount && amount < 0 && moneyFormatter(-amount)}
                        </TD>
                      </TR>
                    )
                  })}
                  <TR>
                    <TD>Total</TD>
                    <TD></TD>
                    <TD></TD>
                    <TD>{moneyFormatter(total)}</TD>
                  </TR>
                  <TR>
                    <TD weighting={1}> </TD>
                  </TR>
                </Fragment>
              )
            })}
          </Table>
        </View>
      </Page>
    </Document>
  )
}
