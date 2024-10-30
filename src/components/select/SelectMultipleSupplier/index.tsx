// @ts-nocheck
import { Flex, Select } from 'antd'
import React, { useEffect } from 'react'
import { ISelectData } from 'src/models/general.model'
import useSelectMultipleSupplierController from './controller/useSelectMultipleSupplierController'

interface ISelectMultipleSupplierProps {
  allowClear?: boolean
  handleSelectedData: (e: ISelectData[]) => void
  disabled?: boolean
  placeholder?: string
}

const SelectMultipleSupplier: React.FC<ISelectMultipleSupplierProps> = ({
  allowClear,
  handleSelectedData,
  disabled,
  placeholder = 'Search Supplier ID',
}) => {
  const { data, selectedOption, onChange, onFetchList } =
    useSelectMultipleSupplierController()

  useEffect(() => {
    handleSelectedData(selectedOption)
  }, [selectedOption])

  useEffect(() => {
    onFetchList()
  }, [])

  return (
    <Flex>
      <Select
        mode="multiple"
        allowClear={allowClear}
        style={{ width: '100%' }}
        placeholder={placeholder}
        onChange={onChange}
        options={data}
        disabled={disabled}
      />
    </Flex>
  )
}

export default SelectMultipleSupplier
