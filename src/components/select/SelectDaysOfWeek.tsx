// @ts-nocheck
import { DAYS_OF_WEEK_NAME_ENUM } from 'src/enums/enums'
import { Select } from 'antd'
import React from 'react'

const { Option } = Select

interface ISelectDayProps {
  handleChange: (e: string) => void
  value?: string
  disabled?: boolean
  withAll?: boolean
  placeholder?: string
}

const SelectDayName: React.FC<ISelectDayProps> = ({
  value,
  handleChange,
  disabled,
  withAll,
  placeholder = 'Select Day Name',
}) => {
  const daysOfWeekArray = Object.values(DAYS_OF_WEEK_NAME_ENUM)

  return (
    <Select
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      disabled={disabled}>
      {withAll ? <Option value={''}>All Day</Option> : null}
      {daysOfWeekArray.map((day, index) => (
        <Option key={day} value={day}>
          {day}
        </Option>
      ))}
    </Select>
  )
}

export default SelectDayName
