// @ts-nocheck
import React from 'react'
import { Select } from 'antd'
import useSelectBankController from './controller/useSelectBankController'

interface ISelectPaymentMethodProps {
  handleChange: (e: number, o: any) => void
  value: number | undefined
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
  disabled?: boolean
  placeholder?: string
}

const SelectBank: React.FC<ISelectPaymentMethodProps> = ({
  value,
  handleChange,
  placement,
  disabled,
  placeholder = 'Select Bank',
}) => {
  const { data, isLoading } = useSelectBankController()
  return (
    <>
      <Select
        options={data}
        loading={isLoading}
        value={value}
        onChange={(value, obj) => handleChange(value, obj)}
        disabled={disabled}
        placement={placement}
        placeholder={placeholder}
      />
    </>
  )
}

export default SelectBank
