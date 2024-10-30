// @ts-nocheck
import { Select } from 'antd'
import useFetchTeacherEduController from './controller/useFetchTeacherEdu'
import { useEffect } from 'react'

interface ISelectTeacherEdu {
  handleChange: (e: number) => void
  value: number | undefined
}

const SelectTeacherEducation: React.FC<ISelectTeacherEdu> = ({
  value,
  handleChange,
}) => {
  const { teacherEduData, isLoading, onFetchList } =
    useFetchTeacherEduController()

  useEffect(() => {
    onFetchList()
  }, [])

  return (
    <Select
      options={teacherEduData}
      loading={isLoading}
      value={value}
      onChange={handleChange}
    />
  )
}

export default SelectTeacherEducation
