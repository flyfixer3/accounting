// @ts-nocheck
import React from 'react'
import useSelectPaymentMethodController from './controller/useSelectPaymentMethodController'
import { Select } from 'antd'

interface ISelectPaymentMethodProps {
  handleChange: (e: number, o: any) => void
  value: number | undefined
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
  disabled?: boolean
  placeholder?: string
}

const SelectPaymentMethod: React.FC<ISelectPaymentMethodProps> = ({
  value,
  handleChange,
  placement,
  disabled,
  placeholder = 'Select Payment Method',
}) => {
  const { data, isLoading } = useSelectPaymentMethodController()
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

export default SelectPaymentMethod
