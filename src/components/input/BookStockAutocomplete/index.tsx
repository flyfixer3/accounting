// @ts-nocheck
import { AutoComplete, Button, Flex } from 'antd'
import React, { useEffect } from 'react'
import useBookStockAutocompleteController from './controller/useBookStockAutocompleteController'
import { ISelectData } from 'src/models/general.model'
import Spacer from 'src/components/view/Spacer'
import { AiOutlinePlus } from 'react-icons/ai'
import { appColors } from 'src/assets/styles/styles'
import ModalAddBookStock from 'src/components/modal/ModalAddBookStock'

interface IBookStockAutocompleteProps {
  allowClear?: boolean
  handleSelectedData: (e: ISelectData) => void
  disabled?: boolean
  placeholder?: string
  withAdd: boolean
}

const BookStockAutocomplete: React.FC<IBookStockAutocompleteProps> = ({
  allowClear,
  handleSelectedData,
  disabled,
  placeholder = 'Search Book Stock Name',
  withAdd,
}) => {
  const {
    data,
    isModalAddBookStockVisible,
    handleModalAddBookStockVisibility,
    onSelect,
    selectedOption,
    onChange,
  } = useBookStockAutocompleteController()

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
            onClick={handleModalAddBookStockVisibility}>
            <AiOutlinePlus color={appColors?.neutral0} size={16} />
          </Button>

          {isModalAddBookStockVisible ? (
            <ModalAddBookStock
              isVisible={isModalAddBookStockVisible}
              handleClose={handleModalAddBookStockVisibility}
            />
          ) : null}
        </>
      ) : null}
    </Flex>
  )
}

export default BookStockAutocomplete
