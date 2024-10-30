import { useQuery } from '@tanstack/react-query'
import { Select, SelectProps } from 'antd'
import axios from 'axios'
import { useMemo } from 'react'
import { BASE_URL } from 'src/services/api.service'

export function useSubaccounts() {
  return useQuery({
    queryKey: ['subaccounts'],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/accounting/subaccounts`)
      return res.data as {
        id: number
        subaccount_name: string
        subaccount_number: string
        account_number: string
      }[]
    },
  })
}

export default function SubaccountSelect(
  props: Omit<SelectProps, 'options'> & { filterCategoryNumber?: string },
) {
  const { data } = useSubaccounts()
  const options = useMemo(() => {
    const filtered = props.filterCategoryNumber
      ? data?.filter((el) => el.account_number === props.filterCategoryNumber)
      : data
    return filtered?.map((el) => ({
      label: `(${el.subaccount_number}) ${el.subaccount_name}`,
      value: el.id,
    }))
  }, [props.filterCategoryNumber, data])

  return (
    <Select
      {...props}
      showSearch
      optionFilterProp="label"
      filterSort={(optionA, optionB) => {
        if (
          typeof optionA?.label !== 'string' ||
          typeof optionB?.label !== 'string'
        )
          return 0

        return ((optionA?.label ?? '') as any)
          .toLowerCase()
          .localeCompare(((optionB?.label ?? '') as any).toLowerCase())
      }}
      placeholder="Select Account"
      options={options}
    />
  )
}
