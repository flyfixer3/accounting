import { PageData } from '@src/models/pagination.model'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { BASE_URL } from 'src/services/api.service'
import { AccountingTransaction } from '../types'
import { number } from 'zod'

export function useTransactionsQuery(query: { search: string, 
  month: number,
  year: number
 }) {
  return useQuery({
    queryKey: ['transactions', query],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/accounting/transactions`, {
        params: query,
      })
      const data = res.data as {
        page: PageData<AccountingTransaction>
        meta: { total: number }
      }
      return data
    },
  })
}

export function useAllTransactionsQuery({
  endDate,
  startDate,
  month
}: {
  startDate?: string
  endDate?: string
  month?: number
}) {
  return useQuery({
    queryKey: ['transactions', { startDate, endDate }],
    queryFn: async () => {
      const res = await axios.get(
        `${BASE_URL}/accounting/transactions/all?startDate=${startDate}&endDate=${endDate}&month=${month}`,
      )
      const data = res.data as {
        data: {
          data: AccountingTransaction[]
        }
      }
      return data.data.data
    },
    enabled: !!startDate && !!endDate,
  })
}
