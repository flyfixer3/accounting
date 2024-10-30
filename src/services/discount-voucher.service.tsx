// @ts-nocheck
import {
  IDiscountVoucherData,
  IDiscountVoucherMetaResponse,
  IDiscountVoucherRequestPayload,
  IDiscountVoucherRequestResponse,
} from 'src/models/discount-voucher.model'
import { IDataResponse, IListDataResponse } from 'src/models/request.model'
import axios from 'axios'
import { BASE_URL } from './api.service'
import { toQueryString } from 'src/helpers/request.helper'
import { IQueryParams } from 'src/models/general.model'

export const fetchDiscountVoucherList = async (queryParams: IQueryParams) => {
  return await axios.get<
    IListDataResponse<IDiscountVoucherData, IDiscountVoucherMetaResponse>
  >(`${BASE_URL}/discount-vouchers${toQueryString(queryParams)}`)
}

export const fetchDiscountVoucherByStudentId = async (id: number) => {
  return await axios.get<IDataResponse<IDiscountVoucherData>>(
    `${BASE_URL}/discount-vouchers/${id}/available`,
  )
}

export const requestCreateDiscountVoucher = async (
  payload: IDiscountVoucherRequestPayload,
) => {
  return await axios.post<IDiscountVoucherRequestResponse>(
    `${BASE_URL}/discount-vouchers/create/monthly-fee-discount-vouchers`,
    payload,
  )
}
