// @ts-nocheck
import { IStudentDetailResponse } from './student.model'

export interface IDiscountVoucherData {
  id: number
  voucherCode: string
  student: IStudentDetailResponse
  voucherDiscountValue: string
  voucherDiscountPercentage: number | undefined
  voucherDiscountMaximumValue: number | undefined
  voucherMinimumUsage: number | undefined
  voucherValidity: string
  voucherType: string
  voucherStatus: string
  status: string
  createdAt?: string
}

export interface IDiscountVoucherRequestPayload {
  studentId: number
}

export interface IDiscountVoucherRequestResponse {
  message: string
  data?: IDiscountVoucherData
}

export interface IDiscountVoucherMetaResponse {
  currentTotalData: number
  totalData: number
  totalAvailable: number
  totalRedemeed: number
  totalExpired: number
}
