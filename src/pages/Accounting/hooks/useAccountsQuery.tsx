import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { PageData } from 'src/models/pagination.model'
import { BASE_URL } from 'src/services/api.service'
import { AccountingAccount } from '../types'

export function useAccountsQuery(query: { search: string } = { search: '' }) {
  return useQuery({
    queryKey: ['accounts', query],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/accounting/accounts`, {
        params: query,
      })
      const data = res.data as {
        page: PageData<AccountingAccount>
        meta: { total: number }
      }
      return data
    },
  })
}
