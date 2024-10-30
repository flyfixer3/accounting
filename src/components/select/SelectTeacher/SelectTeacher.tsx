// @ts-nocheck
import { Select } from 'antd'
import React, { useEffect } from 'react'
import useSelectTeacherController from './controller/useSelectTeacher'

interface ISelectTeacher {
  handleChange: (e: number) => void
  value: number | undefined
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
  placeholder?: string
  allowClear?: boolean
  courseId: number
}

const SelectTeacher: React.FC<ISelectTeacher> = ({
  value,
  handleChange,
  placement,
  placeholder = 'Select Teacher',
  allowClear = false,
  courseId,
}) => {
  const { teacherData, isLoading, onRefetch } = useSelectTeacherController()

  useEffect(() => {
    if (courseId) {
      onRefetch(courseId)
    }
  }, [courseId])

  return (
    <Select
      options={teacherData}
      loading={isLoading}
      value={value}
      onChange={handleChange}
      placement={placement}
      placeholder={placeholder}
      allowClear={allowClear}
    />
  )
}

export default SelectTeacher
