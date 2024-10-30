// @ts-nocheck
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import moment from 'moment'
import { appColors } from 'src/assets/styles/styles'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import { ISalaryData } from 'src/models/salary.model'
import { ITeacherTableData } from 'src/models/teacher.model'

export default function PayslipPdf({
  salary,
  teacher,
}: {
  salary: ISalaryData
  teacher: ITeacherTableData
}) {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: 'white',
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      margin: 16,
      padding: 8,
    },
  })

  return (
    <Document>
      {/** Page defines a single page of content. */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Payslip for {teacher.teacherName}</Text>
          <Text
            style={{
              fontSize: '12px',
              paddingTop: '8px',
              color: appColors.neutral60,
            }}>
            Teacher #{teacher.teacherNumber} -{' '}
            {moment({
              month: parseInt(salary.month) - 1,
              year: parseInt(salary.year),
            }).format('MMMM YYYY')}
          </Text>
          <Text style={{ fontSize: '14px', paddingTop: '32px' }}>
            Base Salary: {moneyFormatter(parseInt(salary.base_salary))}
          </Text>
          <Text style={{ fontSize: '14px', paddingTop: '8px' }}>
            Commission: {moneyFormatter(parseInt(salary.commission))}
          </Text>
          <Text
            style={{
              fontSize: '12px',
              paddingTop: '4px',
              color: appColors.neutral60,
            }}>
            Previous month students: {parseInt(salary.prev_total_students + '')}
          </Text>
          <Text
            style={{
              fontSize: '12px',
              paddingTop: '4px',
              color: appColors.neutral60,
            }}>
            Current month students: {parseInt(salary.total_students + '')}
          </Text>
          <Text
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              paddingTop: '16px',
            }}>
            Total:{' '}
            {moneyFormatter(
              parseInt(salary.base_salary) + parseInt(salary.commission),
            )}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
