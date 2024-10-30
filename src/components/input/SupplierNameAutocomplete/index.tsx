// @ts-nocheck
import { AutoComplete, Button, Flex } from 'antd'
import { ISelectData } from 'src/models/general.model'
import useSupplierNameAutocompleteController from './controller/useSupplierNameAutocompleteController'
import Spacer from 'src/components/view/Spacer'
import { AiOutlinePlus } from 'react-icons/ai'
import { appColors } from 'src/assets/styles/styles'
import { useEffect } from 'react'

interface ISupplierDataAutocompleteProps {
  allowClear?: boolean
  handleSelectedData: (e: ISelectData) => void
  disabled?: boolean
  placeholder?: string
  withAdd: boolean
}

const SupplierNameAutocomplete = ({
  allowClear,
  handleSelectedData,
  disabled,
  placeholder = 'Search Supplier Name',
  withAdd,
}: ISupplierDataAutocompleteProps) => {
  const { data, onSelect, selectedOption, onChange, onAddButtonClick } =
    useSupplierNameAutocompleteController()

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

      {withAdd ? (
        <>
          <Spacer margin="auto .5rem" />
          <Button
            type="primary"
            disabled={disabled}
            onClick={() => {
              onAddButtonClick()
            }}>
            <AiOutlinePlus color={appColors?.neutral0} size={16} />
          </Button>
        </>
      ) : null}
    </Flex>
  )
}

export default SupplierNameAutocomplete
