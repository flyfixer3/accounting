// @ts-nocheck
import { Select } from 'antd'
import React from 'react'

interface IGenderOptions {
  value: string
  label: string
}

interface ISelectGenderProps {
  handleChange: (e: string) => void
  value: string
  disabled?: boolean
}

const SelectGender: React.FC<ISelectGenderProps> = ({
  handleChange,
  value,
  disabled,
}) => {
  const genderOptions: IGenderOptions[] = [
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' },
  ]

  return (
    <Select
      options={genderOptions}
      value={value}
      onChange={handleChange}
      disabled={disabled}
    />
  )
}

export default SelectGender
