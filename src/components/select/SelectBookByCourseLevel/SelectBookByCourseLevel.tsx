// @ts-nocheck
import { Select } from 'antd'
import React, { useEffect } from 'react'
import ueSelectBookByCourseLevelController from './controller/useSelectBookByCourseLevelController'

interface ISelectBookByCourseLevelProps {
  courseLevelId: number
  handleChange: (e: number, o: any) => void
  value: number | undefined
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
  disabled?: boolean
}

const SelectBookByCourseLevel: React.FC<ISelectBookByCourseLevelProps> = ({
  courseLevelId,
  value,
  handleChange,
  placement,
  disabled,
}) => {
  const { onRefetch, data, isLoading } = ueSelectBookByCourseLevelController()

  useEffect(() => {
    if (courseLevelId) onRefetch(courseLevelId)
  }, [courseLevelId])

  return (
    <Select
      options={data}
      loading={isLoading}
      value={value}
      onChange={(value, obj) => handleChange(value, obj)}
      disabled={!courseLevelId || disabled}
      placement={placement}
    />
  )
}

export default SelectBookByCourseLevel
