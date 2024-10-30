// @ts-nocheck
import { ITeacherData } from '@src/models/teacher.model'
import { Button, InputNumber, Modal } from 'antd'
import dayjs from 'dayjs'
import moment from 'moment'
import { useState } from 'react'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import {
  currencyInputFormatter,
  currencyInputParser,
} from 'src/helpers/formatter.helper'
import styles from './SalaryCheckerModal.module.scss'

export default function SalaryCheckerModal({
  close,
  isOpen,
  onSuccess,
  teachers,
}: {
  isOpen: boolean
  close: () => void
  onSuccess: (data: { teacherNumber: number; baseSalary: number }[]) => void
  teachers: ITeacherData[]
}) {
  const [teacherBaseSalaries, setTeacherBaseSalaries] = useState<
    { teacherNumber: number; baseSalary: number }[]
  >([])

  return (
    <Modal
      title={
        'These teachers started working from this month, please input their salary for this month'
      }
      open={isOpen}
      onCancel={() => close()}
      centered
      footer={null}>
      {teachers.map((teacher, idx) => (
        <div key={teacher.teacherNumber} className={styles.Container}>
          <div>
            <span style={{ fontWeight: 'medium' }}>
              {teacher.teacherName} ({teacher.teacherEmail})
            </span>
            <span>
              {' '}
              - started from{' '}
              {moment(dayjs(teacher?.teacherJoinDate).toDate()).format(
                DATETIME_FORMATTER_ENUM?.primary,
              )}
            </span>
          </div>
          <InputNumber
            formatter={(value: string) => currencyInputFormatter(value, 'Rp')}
            parser={(value: string) => currencyInputParser(value, 'Rp')}
            onChange={(val) =>
              setTeacherBaseSalaries((prev) => {
                const newTeacherBaseSalaries = [...prev]
                newTeacherBaseSalaries[idx] = {
                  teacherNumber: parseInt(teacher.teacherNumber),
                  baseSalary: parseInt((val ?? 0).toString()),
                }
                return newTeacherBaseSalaries
              })
            }
            value={(teacherBaseSalaries[idx]?.baseSalary || 0).toString()}
            style={{ width: '100%' }}
          />
          <div
            style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'flex-end',
              marginTop: '16px',
            }}>
            <Button type="default" onClick={() => close()}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                close()
                onSuccess(teacherBaseSalaries)
              }}>
              Confirm
            </Button>
          </div>
        </div>
      ))}
    </Modal>
  )
}
