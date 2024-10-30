// @ts-nocheck
import { AutoComplete, Button, Flex } from 'antd'
import React, { useEffect } from 'react'
import { ISelectData } from 'src/models/general.model'
import Spacer from 'src/components/view/Spacer'
import { AiOutlinePlus } from 'react-icons/ai'
import { appColors } from 'src/assets/styles/styles'
import useEquipmentStockAutocompleteController from './controller/useEquipmentStockAutocompleteController'
import ModalAddEquipmentStock from 'src/components/modal/ModalAddEquipmentStock'

interface IEquipmentStockAutocompleteProps {
  allowClear?: boolean
  handleSelectedData: (e: ISelectData) => void
  disabled?: boolean
  placeholder?: string
  withAdd: boolean
}

const EquipmentStockAutocomplete: React.FC<
  IEquipmentStockAutocompleteProps
> = ({
  allowClear,
  handleSelectedData,
  disabled,
  placeholder = 'Search Equipment Stock Name',
  withAdd,
}) => {
  const {
    data,
    isModalAddEquipmentStockVisible,
    handleModalAddEquipmentStockVisibility,
    onSelect,
    selectedOption,
    onChange,
  } = useEquipmentStockAutocompleteController()

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
            onClick={handleModalAddEquipmentStockVisibility}>
            <AiOutlinePlus color={appColors?.neutral0} size={16} />
          </Button>

          {isModalAddEquipmentStockVisible ? (
            <ModalAddEquipmentStock
              isVisible={isModalAddEquipmentStockVisible}
              handleClose={handleModalAddEquipmentStockVisibility}
            />
          ) : null}
        </>
      ) : null}
    </Flex>
  )
}

export default EquipmentStockAutocomplete
