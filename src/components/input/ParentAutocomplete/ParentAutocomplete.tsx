// @ts-nocheck
import { AutoComplete } from 'antd'
import React, { useEffect } from 'react'
import useParentAutocompleteController from './controller/useParentAutocompleteController'
import { IParentSelect } from 'src/models/parent.model'

interface IParentAutocompleteProps {
  allowClear?: boolean
  handleSelectedData: (e: IParentSelect) => void
  disabled?: boolean
  placeholder?: string
}

const ParentAutocomplete: React.FC<IParentAutocompleteProps> = ({
  allowClear,
  handleSelectedData,
  disabled,
  placeholder = 'Search Parent name or email',
}) => {
  const { parentData, onSelect, selectedOption, onChange } =
    useParentAutocompleteController()

  useEffect(() => {
    if (selectedOption && Object.keys(selectedOption).length > 0) {
      handleSelectedData(selectedOption)
    }
  }, [selectedOption])

  return (
    <>
      <AutoComplete
        placeholder={placeholder}
        onSelect={(val, option) => onSelect(val, option)}
        onChange={onChange}
        value={selectedOption?.label}
        options={parentData}
        allowClear={allowClear}
        disabled={disabled}></AutoComplete>
    </>
  )
}

export default ParentAutocomplete
