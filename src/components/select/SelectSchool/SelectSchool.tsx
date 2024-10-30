// @ts-nocheck
import { Button, Flex, Select } from 'antd'
import React from 'react'
import useSelectSchoolController from './controller/useSelectSchoolController'
import { AiOutlinePlus } from 'react-icons/ai'
import { appColors } from 'src/assets/styles/styles'
import Spacer from 'src/components/view/Spacer'
import ModalAddSchool from 'src/components/modal/ModalAddSchool'

interface ISelectSchoolProps {
  handleChange: (e: number) => void
  value?: number | undefined
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
  placeholder?: string
  allowClear?: boolean
  disabled?: boolean
  withAdd?: boolean
}

const SelectSchool: React.FC<ISelectSchoolProps> = ({
  value,
  handleChange,
  placement,
  placeholder = 'Select School',
  allowClear = false,
  disabled,
  withAdd = true,
}) => {
  const {
    isLoading,
    schoolData,
    isAddSchoolModalVisible,
    onHandleAddSchoolModalVisibility,
  } = useSelectSchoolController()
  return (
    <Flex>
      <Select
        options={schoolData}
        loading={isLoading}
        value={value}
        onChange={handleChange}
        placement={placement}
        placeholder={placeholder}
        allowClear={allowClear}
        disabled={disabled}
      />
      {withAdd ? (
        <>
          <Spacer margin="auto .5rem" />
          <Button
            type="primary"
            disabled={disabled}
            onClick={() => onHandleAddSchoolModalVisibility()}>
            <AiOutlinePlus
              color={disabled ? appColors?.neutral50 : appColors?.neutral0}
              size={16}
            />
          </Button>

          {isAddSchoolModalVisible ? (
            <ModalAddSchool
              handleClose={onHandleAddSchoolModalVisibility}
              isVisible={isAddSchoolModalVisible}
            />
          ) : null}
        </>
      ) : null}
    </Flex>
  )
}

export default SelectSchool
