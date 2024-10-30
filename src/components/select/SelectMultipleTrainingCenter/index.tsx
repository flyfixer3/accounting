// @ts-nocheck
import { Flex, Select } from 'antd'
import React, { useEffect } from 'react'
import { ISelectData } from 'src/models/general.model'

import useSelectMultipleTrainingCenterController from './controller/useSelectMultipleTrainingCenterController'

interface ISelectMultipleTrainingCenterProps {
  allowClear?: boolean
  handleSelectedData: (e: ISelectData[]) => void
  disabled?: boolean
  placeholder?: string
}

const SelectMultipleTrainingCenter: React.FC<
  ISelectMultipleTrainingCenterProps
> = ({
  allowClear,
  handleSelectedData,
  disabled,
  placeholder = 'Search Training Center',
}) => {
  const { data, selectedOption, onChange, onFetchList } =
    useSelectMultipleTrainingCenterController()

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

export default SelectMultipleTrainingCenter
