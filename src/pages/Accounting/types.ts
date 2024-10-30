export type AccountingAccount = {
  id: number
  account_number: string
  account_name: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
  subaccounts: AccountingSubaccount[]
}

export type AccountingAccountPayload = {
  id?: number
  account_number: string
  account_name: string
  description: string
  is_active: boolean
}

export type AccountingSubaccount = {
  accounting_account_id: number
  created_at: string
  description: string
  id: number
  subaccount_name: string
  subaccount_number: string
  total_credit: number
  total_debit: number
  is_active: boolean
  updated_at: string
  accounting_account: AccountingAccount
}
export type AccountingSubaccountPayload = {
  id?: number
  accounting_account_id: number
  subaccount_number: string
  subaccount_name: string
  description: string
  is_active: boolean
}

export type AccountingTransaction = {
  id: number
  label: string
  description: string
  date: string
  accounting_posting_id: number | null
  automated: boolean
  created_at: string
  updated_at: string
  details: AccountingTransactionDetail[]
}

export type AccountingTransactionDetail = {
  id: number
  subaccount: AccountingSubaccount
  amount: number
  type: 'credit' | 'debit'
  created_at: string
  updated_at: string
}
