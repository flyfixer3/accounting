// @ts-nocheck
import { toQueryString } from 'src/helpers/request.helper'
import {
  ICourseVoucherCountResponse,
  ICourseVoucherData,
  ICourseVoucherMetaResponse,
  ICourseVoucherRequestPayload,
  ICourseVoucherRequestResponse,
  ICourseVoucherBundlePriceRequestPayload,
  ICourseVoucherBundlePriceRequestResponse,
  ICourseVoucherOrderRequestPayload,
  ICourseVoucherIBOPriceListData,
  ICourseVoucherIBOPriceListMetaResponse,
  ICourseVoucherIBOPriceRequestPayload,
  ICourseVoucherIBOPriceRequestResponse,
  ICourseVoucherIBOStockSearchData,
} from 'src/models/course-voucher.model'
import { IDataResponse, IListDataResponse } from 'src/models/request.model'
import axios from 'axios'
import { BASE_URL } from './api.service'
import { IQueryParams } from 'src/models/general.model'

export const fetchCourseVoucherList = async (queryParams: IQueryParams) => {
  return await axios.get<
    IListDataResponse<ICourseVoucherData, ICourseVoucherMetaResponse>
  >(`${BASE_URL}/orders/course-vouchers${toQueryString(queryParams)}`)
}

export const requestOrderCourseVoucher = async (
  payload: ICourseVoucherRequestPayload,
) => {
  return await axios.post<ICourseVoucherRequestResponse>(
    `${BASE_URL}/orders/course-vouchers/create`,
    payload,
  )
}

export const fetchAvailableCourseVoucher = async () => {
  return await axios.get<IDataResponse<ICourseVoucherCountResponse>>(
    `${BASE_URL}/course-vouchers/available/count`,
  )
}

export const fetchCourseVoucherBundlePriceByCourseId = async (
  payload: ICourseVoucherBundlePriceRequestPayload,
) => {
  return await axios.get<
    IDataResponse<ICourseVoucherBundlePriceRequestResponse>
  >(`${BASE_URL}/course-vouchers/bundle-price`, { params: payload })
}

// IBO
export const fetchCourseVoucherOrderList = async (
  queryParams: IQueryParams,
) => {
  return await axios.get<
    IListDataResponse<ICourseVoucherData, ICourseVoucherMetaResponse>
  >(`${BASE_URL}/ibo/orders/course-vouchers${toQueryString(queryParams)}`)
}

export const requestUpdateCourseVoucherOrderStatus = async (
  id: number,
  payload: ICourseVoucherOrderRequestPayload,
) => {
  return await axios.put<ICourseVoucherRequestResponse>(
    `${BASE_URL}/ibo/orders/course-vouchers/update/${id}`,
    payload,
  )
}

export const fetchIBOCourseVoucherPriceList = async (
  queryParams: IQueryParams,
) => {
  return await axios.get<
    IListDataResponse<
      ICourseVoucherIBOPriceListData,
      ICourseVoucherIBOPriceListMetaResponse
    >
  >(`${BASE_URL}/ibo/course-voucher-prices${toQueryString(queryParams)}`)
}

export const requestIBOUpdateCourseVoucherPrice = async (
  id: number,
  payload: ICourseVoucherIBOPriceRequestPayload,
) => {
  return await axios.put<ICourseVoucherIBOPriceRequestResponse>(
    `${BASE_URL}/ibo/course-voucher-prices/update/${id}`,
    payload,
  )
}

export const fetchIBOCourseVoucherSearchStock = async (
  search: string,
  abortController?: AbortController,
) => {
  const payload = abortController ? { signal: abortController.signal } : {}
  return await axios.get<IDataResponse<ICourseVoucherIBOStockSearchData>>(
    `${BASE_URL}/ibo/stocks/course-voucher/search${toQueryString({ search })}`,
    payload,
  )
}
