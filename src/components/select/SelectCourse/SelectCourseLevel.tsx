// @ts-nocheck
import { Select } from 'antd'
import React, { useEffect } from 'react'
import useSelectCourseController from './controller/useSelectCourseController'
import { ISelectData } from '@src/models/general.model'

interface ISelectCourseLevel {
  courseId: number | string
  handleChange: (e: number, obj: any) => void
  value: number | undefined
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
}

const SelectCourseLevel: React.FC<ISelectCourseLevel> = ({
  courseId,
  value,
  handleChange,
  placement,
}) => {
  const { onFetchCourseLevelList, courseLevelData, isLoading } =
    useSelectCourseController()

  useEffect(() => {
    if (courseId) onFetchCourseLevelList(courseId)
  }, [courseId])

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

export default SelectCourseLevel
