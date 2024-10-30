import { Table, TD, TH, TR } from '@ag-media/react-pdf-table'
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import dayjs from 'dayjs'
import { Fragment } from 'react'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import { AccountingTransaction } from '../types'

export default function JournalPdf({
  transactions,
}: {
  transactions: AccountingTransaction[] | undefined
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
  console.log(transactions);
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
              <TD>Date</TD>
              <TD>Account</TD>
              <TD>Debit</TD>
              <TD>Credit</TD>
            </TH>
            {transactions?.map((tx, idx) => (
              <Fragment key={idx}>
                <TR key={idx}>
                  <TD weighting={1}>{tx.label}</TD>
                </TR>
                {tx.details.map((detail, idx) => (
                  <TR key={idx}>
                    <TD>
                      {idx === 0
                        ? dayjs(tx.date).format(
                            DATETIME_FORMATTER_ENUM.primaryWithTime,
                          )
                        : ''}
                    </TD>
                    <TD>
                      ({detail.subaccount.subaccount_number}){' '}
                      {detail.subaccount.subaccount_name}
                    </TD>
                    <TD>
                      {detail.type === 'debit'
                        ? moneyFormatter(detail.amount)
                        : ''}
                    </TD>
                    <TD>
                      {detail.type === 'credit'
                        ? moneyFormatter(detail.amount)
                        : ''}
                    </TD>
                  </TR>
                ))}
              </Fragment>
            ))}
          </Table>
        </View>
      </Page>
    </Document>
  )
}
