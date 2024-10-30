// @ts-nocheck
import { ISelectData } from 'src/models/general.model'
import { Select } from 'antd'
import React from 'react'

const { Option } = Select

interface ISelectActiveStatus {
  handleChange: (e: string) => void
  value?: string | undefined
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
  placeholder?: string
  allowClear?: boolean
  list?: ISelectData[]
  withAll?: boolean
  withAllTxt?: string
}

const SelectActiveStatus: React.FC<ISelectActiveStatus> = ({
  list,
  handleChange,
  value,
  placement,
  placeholder,
  allowClear,
  withAll,
  withAllTxt = 'All Status',
}) => {
  const activeOptions: ISelectData[] = [
    { value: 'ACTIVE', label: 'ACTIVE' },
    { value: 'INACTIVE', label: 'INACTIVE' },
  ]

  const options = list ? list : activeOptions

  return (
    <Select
      // options={options}
      value={value}
      onChange={handleChange}
      placement={placement}
      placeholder={placeholder}
      allowClear={allowClear}>
      {withAll ? <Option value={''}>{withAllTxt}</Option> : null}
      {options.map((item, index) => (
        <Option key={index} value={item?.value}>
          {item?.label}
        </Option>
      ))}
    </Select>
  )
}

export default SelectActiveStatus
