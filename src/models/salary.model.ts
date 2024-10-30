// @ts-nocheck
import { IBank } from './payment-method.model'

export interface ISalaryData {
  id: number
  month: string
  year: string
  commission: string
  base_salary: string
  bank?: IBank
  prev_total_students?: number
  total_students: number
  payment_method_id: number
  created_at: string
  updated_at: string
}

export interface ISalaryMetaResponse {
  totalData: number
  currentTotalData: number
  newTeacherCount: number
}

export interface ISalaryListPayload {
  page: number
  limit: number
  search?: string
  year?: number
  month?: number
  status?: 'all' | 'new'
}

export interface ISalaryUpdatePaymentRequestPayload {
  paymentMethodId: number
  bankId: number
}
