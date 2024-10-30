// @ts-nocheck
import { Select } from 'antd'
import useFetchReligionController from './controller/useFetchReligionController'
import { useEffect } from 'react'

interface ISelectGenderProps {
  handleChange: (e: number) => void
  value: number | undefined
  disabled?: boolean
}
const SelectReligion: React.FC<ISelectGenderProps> = ({
  value,
  handleChange,
  disabled,
}) => {
  const { religionData, onFetchList, isLoading } = useFetchReligionController()

  useEffect(() => {
    onFetchList()
  }, [])

  return (
    <Select
      options={religionData}
      loading={isLoading}
      value={value}
      onChange={handleChange}
      disabled={disabled}
    />
  )
}

export default SelectReligion
