// @ts-nocheck
import React, { useEffect } from 'react'
import useSelectDiscountVoucherController from './controller/useSelectDiscountVoucherController'
import { Select } from 'antd'
import { IDiscountVoucherData } from '@src/models/discount-voucher.model'

interface ISelectDiscountVoucherProps {
  handleChange: (e: number, o: IDiscountVoucherData) => void
  value: number | undefined
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
  disabled?: boolean
  placeholder?: string
  studentId: number
  allowClear?: boolean
}

const SelectDiscountVoucher: React.FC<ISelectDiscountVoucherProps> = ({
  value,
  handleChange,
  placement,
  disabled,
  placeholder = 'Select Discount Voucher',
  studentId,
  allowClear,
}) => {
  const { data, isLoading, onRefetch } = useSelectDiscountVoucherController()

  useEffect(() => {
    if (studentId) onRefetch(studentId)
  }, [studentId])

  return (
    <>
      <Select
        options={data}
        loading={isLoading}
        value={value}
        onChange={(value, obj: IDiscountVoucherData) =>
          handleChange(value, obj)
        }
        disabled={disabled}
        placement={placement}
        placeholder={placeholder}
        allowClear={allowClear}
      />
    </>
  )
}

export default SelectDiscountVoucher
