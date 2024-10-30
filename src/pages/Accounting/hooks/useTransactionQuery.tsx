import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { BASE_URL } from 'src/services/api.service'
import { AccountingTransaction } from '../types'

export default function useTransactionQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['transaction', id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await axios.get(
        `${BASE_URL}/accounting/transactions/${id}`,
      )
      return data as { data: AccountingTransaction }
    },
  })
}
