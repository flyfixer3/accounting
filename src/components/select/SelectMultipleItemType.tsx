// @ts-nocheck
import { SUPPLIER_ORDER_TYPE } from 'src/enums/enums'
import { ISelectData } from 'src/models/general.model'
import { Select } from 'antd'
import React from 'react'

interface ISelectMultipleItemTypeProps {
  handleChange: (e: ISelectData[]) => void
  disabled?: boolean
  allowClear?: boolean
  placeholder?: string
}

const SelectMultipleItemType: React.FC<ISelectMultipleItemTypeProps> = ({
  handleChange,
  disabled,
  allowClear,
  placeholder,
}) => {
  const itemTypeOptions: ISelectData[] = [
    { value: SUPPLIER_ORDER_TYPE?.book, label: 'Book' },
    { value: SUPPLIER_ORDER_TYPE?.equipment, label: 'Equipment' },
    { value: SUPPLIER_ORDER_TYPE?.courseVoucher, label: 'Course Voucher' },
  ]

  return (
    <Select
      mode="multiple"
      allowClear={allowClear}
      style={{ width: '100%' }}
      placeholder={placeholder}
      onChange={handleChange}
      options={itemTypeOptions}
      disabled={disabled}
    />
  )
}

export default SelectMultipleItemType
