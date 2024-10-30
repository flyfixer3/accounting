// @ts-nocheck
import { Select } from 'antd'
import React, { useEffect } from 'react'
import useSelectCourseLevelByStudentController from './controller/useSelectCourseLevelByStudentController'

interface ISelectCourseLevelUpByStudentProps {
  courseId: number
  studentId: number
  handleChange: (e: number, obj: any) => void
  value: number | undefined
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
}

const SelectCourseLevelUpByStudent: React.FC<
  ISelectCourseLevelUpByStudentProps
> = ({ courseId, studentId, value, handleChange, placement }) => {
  const { onFetchCourseLevelList, courseLevelData, isLoading } =
    useSelectCourseLevelByStudentController()

  useEffect(() => {
    if (courseId && studentId) onFetchCourseLevelList(studentId, courseId)
  }, [courseId, studentId])

  return (
    <Select
      options={courseLevelData}
      loading={isLoading}
      value={value}
      onChange={(value, obj) => handleChange(value, obj)}
      disabled={!courseId}
      placement={placement}
    />
  )
}

export default SelectCourseLevelUpByStudent
