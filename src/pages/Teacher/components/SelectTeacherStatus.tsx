// @ts-nocheck
import { TEACHER_STATUS_ENUM } from 'src/enums/enums'
import { Select } from 'antd'
import React from 'react'

interface ISelectTeacherStatusProps {
  handleChange: (e: string) => void
  value: string | undefined
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
}

const TEACHER_STATUS_OPTIONS = [
  {
    value: TEACHER_STATUS_ENUM?.active,
    label: TEACHER_STATUS_ENUM?.active,
  },
  {
    value: TEACHER_STATUS_ENUM?.inactive,
    label: TEACHER_STATUS_ENUM?.inactive,
  },
  {
    value: TEACHER_STATUS_ENUM?.resign,
    label: TEACHER_STATUS_ENUM?.resign,
  },
]

const SelectTeacherStatus: React.FC<ISelectTeacherStatusProps> = ({
  value,
  handleChange,
  placement,
}) => {
  return (
    <Select
      options={TEACHER_STATUS_OPTIONS}
      value={value}
      onChange={handleChange}
      placement={placement}
    />
  )
}

export default SelectTeacherStatus
