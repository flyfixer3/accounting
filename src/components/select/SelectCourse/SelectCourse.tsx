// @ts-nocheck
import { Select } from 'antd'
import React, { useEffect } from 'react'
import useSelectCourseController from './controller/useSelectCourseController'

interface ISelectCourse {
  handleChange: (e: number | string, o: any) => void
  value: number | string | undefined
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
  placeholder?: string
  allowClear?: boolean
}

const SelectCourse: React.FC<ISelectCourse> = ({
  value,
  handleChange,
  placement,
  placeholder = 'Select Course',
  allowClear = true,
}) => {
  const { onFetchCourseList, courseData, isLoading } =
    useSelectCourseController()

  useEffect(() => {
    onFetchCourseList()
  }, [])

  return (
    <Select
      options={courseData}
      loading={isLoading}
      value={value}
      onChange={(value, obj) => {
        handleChange(value, obj)
      }}
      placement={placement}
      placeholder={placeholder}
      allowClear={allowClear}
    />
  )
}

export default SelectCourse
