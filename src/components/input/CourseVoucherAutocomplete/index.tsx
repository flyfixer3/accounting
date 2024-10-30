// @ts-nocheck
import { AutoComplete, Flex } from 'antd'
import React, { useEffect } from 'react'
import { ISelectData } from 'src/models/general.model'
import useCourseVoucherAutocompleteController from './controller/useCourseVoucherAutocompleteController'

interface ICourseVoucherAutocompleteProps {
  allowClear?: boolean
  handleSelectedData: (e: ISelectData) => void
  disabled?: boolean
  placeholder?: string
}

const CourseVoucherAutocomplete: React.FC<ICourseVoucherAutocompleteProps> = ({
  allowClear,
  handleSelectedData,
  disabled,
  placeholder = 'Search Course Voucher Name',
}) => {
  const { data, onSelect, selectedOption, onChange } =
    useCourseVoucherAutocompleteController()

  useEffect(() => {
    if (selectedOption && Object.keys(selectedOption).length > 0) {
      handleSelectedData(selectedOption)
    }
  }, [selectedOption])

  return (
    <Flex>
      <AutoComplete
        placeholder={placeholder}
        onSelect={(val, option: ISelectData) => onSelect(val, option)}
        // onSearch={onSearch}
        onChange={onChange}
        value={selectedOption?.label}
        options={data}
        allowClear={allowClear}
        disabled={disabled}
      />
    </Flex>
  )
}

export default CourseVoucherAutocomplete
