// @ts-nocheck
import { AutoComplete } from 'antd'
import React, { useEffect } from 'react'
import useStudentAutocompleteController from './controller/useStudentAutocompleteController'
import { IStudentSelect } from 'src/models/student.model'

interface IStudentAutocompleteProps {
  allowClear?: boolean
  handleSelectedData: (e: IStudentSelect) => void
  disabled?: boolean
  placeholder?: string
}

const StudentAutocomplete: React.FC<IStudentAutocompleteProps> = ({
  allowClear,
  handleSelectedData,
  disabled,
  placeholder = 'Search Student name or email',
}) => {
  const { studentData, onSelect, selectedOption, onChange } =
    useStudentAutocompleteController()

  useEffect(() => {
    if (selectedOption && Object.keys(selectedOption).length > 0) {
      handleSelectedData(selectedOption)
    }
  }, [selectedOption])

  return (
    <>
      <AutoComplete
        placeholder={placeholder}
        onSelect={(val, option: IStudentSelect) => onSelect(val, option)}
        // onSearch={onSearch}
        onChange={onChange}
        value={selectedOption?.label}
        options={studentData}
        allowClear={allowClear}
        disabled={disabled}></AutoComplete>
    </>
  )
}

export default StudentAutocomplete
