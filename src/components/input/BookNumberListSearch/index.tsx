// @ts-nocheck
import { Flex, Select } from 'antd'
import React, { useEffect } from 'react'
import { ISelectData } from 'src/models/general.model'
import useBookNumberListSearchController from './controller/useBookNumberListSearchController'

interface IBookNumberListSearchProps {
  bookId: number
  allowClear?: boolean
  handleSelectedData: (e: ISelectData[]) => void
  disabled?: boolean
  placeholder?: string
}

const BookNumberListSearch: React.FC<IBookNumberListSearchProps> = ({
  bookId,
  allowClear,
  handleSelectedData,
  disabled,
  placeholder = 'Search Book Number List',
}) => {
  const { data, selectedOption, onChange, onFetchList } =
    useBookNumberListSearchController()

  useEffect(() => {
    if (selectedOption && Object.keys(selectedOption).length > 0) {
      handleSelectedData(selectedOption)
    }
  }, [selectedOption])

  useEffect(() => {
    if (bookId) {
      onFetchList(bookId)
    }
  }, [bookId])

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

export default BookNumberListSearch
