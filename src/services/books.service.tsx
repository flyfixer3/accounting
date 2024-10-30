// @ts-nocheck
import { IQueryParams, ISelectData } from '@src/models/general.model'
import axios from 'axios'
import { toQueryString } from 'src/helpers/request.helper'
import {
  IBookByCourseLevelListResponse,
  IBookData,
  IBookDetailResponse,
  IBookMetaResponse,
  IBookOrderDetailResponse,
  IBookOrderIBOData,
  IBookOrderIBODetailResponse,
  IBookOrderIBOMetaResponse,
  IBookOrderIBORequestPaylaod,
  IBookOrderIBORequestResponse,
  IBookOrderListData,
  IBookOrderMetaResponse,
  IBookOrderRequestPayload,
  IBookOrderRequestResponse,
  IBookPurchasePayload,
  IBookPurchaseRequestResponse,
  IBookRequestPayload,
  IBookRequestResponse,
  IBookStockCreateRequestPayload,
  IBookStockDetailCreateRequestPayload,
  IBookStockDetailUpdateBookNumberRequestPayload,
  IBookStockDetailUpdateStatusRequestPayload,
  IBookStockIBODetailResponse,
  IBookStockIBOListData,
  IBookStockIBOMetaResponse,
  IBookStockIBOStockDetailListData,
  IBookStockIBOStockDetailListMetaResponse,
  IBookStockListData,
  IBookStockListPayload,
  IBookStockRequestResponse,
  IBookStockStockDetailListData,
  IBookStockStockDetailListMetaResponse,
  IBookStockUpdateRequestPayload,
} from 'src/models/books.model'
import {
  IDataResponse,
  IDetailPayload,
  IListDataResponse,
} from 'src/models/request.model'
import { BASE_URL } from './api.service'

export const fetchBookList = async (queryParams?: IQueryParams) => {
  return await axios.get<IListDataResponse<IBookData, IBookMetaResponse>>(
    `${BASE_URL}/books${toQueryString(queryParams)}`,
  )
}

export const fetchBookDetail = async (queryParams?: IDetailPayload) => {
  return await axios.get<IDataResponse<IBookDetailResponse>>(
    `${BASE_URL}/books/${queryParams?.id}`,
  )
}

export const fetchBookByCourseLevel = async (id: number) => {
  return await axios.get<IDataResponse<IBookByCourseLevelListResponse>>(
    `${BASE_URL}/books/available/${id}`,
  )
}

export const requestUpdateBookStatus = async (
  id: number,
  payload: IBookRequestPayload,
) => {
  return await axios.put<IBookRequestResponse>(
    `${BASE_URL}/books/update-book-status/${id}`,
    payload,
  )
}

export const requestPurchaseBook = async (payload: IBookPurchasePayload) => {
  return await axios.post<IBookPurchaseRequestResponse>(
    `${BASE_URL}/purchase/book`,
    payload,
  )
}

export const fetchBookStockList = async (
  queryParams?: IBookStockListPayload,
) => {
  return await axios.get<IDataResponse<IBookStockListData>>(
    `${BASE_URL}/orders/books/available-items${toQueryString(queryParams)}`,
  )
}

export const fetchBookOrderList = async (queryParams?: IQueryParams) => {
  return await axios.get<
    IListDataResponse<IBookOrderListData, IBookOrderMetaResponse>
  >(`${BASE_URL}/orders/books${toQueryString(queryParams)}`)
}

export const fetchBookOrderDetail = async (queryParams?: IDetailPayload) => {
  return await axios.get<IDataResponse<IBookOrderDetailResponse>>(
    `${BASE_URL}/orders/books/detail/${queryParams?.id}`,
  )
}

export const requestBookOrderCheckout = async (
  payload: IBookOrderRequestPayload,
) => {
  return await axios.post<IBookOrderRequestResponse>(
    `${BASE_URL}/orders/books/create`,
    payload,
  )
}

export const requestUpdateBookOrderStatus = async (id: number) => {
  return await axios.put<IBookOrderRequestResponse>(
    `${BASE_URL}/orders/books/update-status-received/${id}`,
  )
}

// IBO
export const fetchIBOBookOrderList = async (queryParams?: IQueryParams) => {
  return await axios.get<
    IListDataResponse<IBookOrderIBOData, IBookOrderIBOMetaResponse>
  >(`${BASE_URL}/ibo/orders/books${toQueryString(queryParams)}`)
}

export const fetchIBOBookOrderDetail = async (id: string) => {
  return await axios.get<IDataResponse<IBookOrderIBODetailResponse>>(
    `${BASE_URL}/ibo/orders/books/detail/${id}`,
  )
}

export const requestUpdateBookOrderIBOStatus = async (
  id: number,
  payload: IBookOrderIBORequestPaylaod,
) => {
  return await axios.put<IBookOrderIBORequestResponse>(
    `${BASE_URL}/ibo/orders/books/update-status/${id}`,
    payload,
  )
}

export const fetchIBOBookStockList = async (
  queryParams?: IQueryParams,
  abortController?: AbortController,
) => {
  const payload = abortController ? { signal: abortController.signal } : {}
  return await axios.get<
    IListDataResponse<IBookStockIBOListData, IBookStockIBOMetaResponse>
  >(`${BASE_URL}/ibo/stocks/books${toQueryString(queryParams)}`, payload)
}

export const fetchIBOBookStockDetail = async (id: number) => {
  return await axios.get<IDataResponse<IBookStockIBODetailResponse>>(
    `${BASE_URL}/ibo/stocks/books/header-detail/${id}`,
  )
}

export const fetchIBOBookStockDetailList = async (
  id: number,
  queryParams: IQueryParams,
) => {
  return await axios.get<
    IListDataResponse<
      IBookStockIBOStockDetailListData,
      IBookStockIBOStockDetailListMetaResponse
    >
  >(
    `${BASE_URL}/ibo/stocks/books/number-detail/${id}${toQueryString(
      queryParams,
    )}`,
  )
}

export const fetchIBOBookStockStockDetailList = async (
  id: number,
  queryParams: IQueryParams,
) => {
  return await axios.get<
    IListDataResponse<
      IBookStockStockDetailListData,
      IBookStockStockDetailListMetaResponse
    >
  >(
    `${BASE_URL}/ibo/stocks/books/number-detail/${id}/stock${toQueryString(
      queryParams,
    )}`,
  )
}

export const requestCreateIBOBookStock = async (
  payload: IBookStockCreateRequestPayload,
) => {
  return await axios.post<IBookStockRequestResponse>(
    `${BASE_URL}/ibo/stocks/books/insert`,
    payload,
  )
}

export const requestUpdateIBOBookStock = async (
  id: number,
  payload: IBookStockUpdateRequestPayload,
) => {
  return await axios.put<IBookStockRequestResponse>(
    `${BASE_URL}/ibo/stocks/books/update/book-data/${id}`,
    payload,
  )
}

export const requestUpdateIBOBookStockDetail = async (
  id: number,
  payload: IBookStockDetailCreateRequestPayload,
) => {
  return await axios.put<IBookStockRequestResponse>(
    `${BASE_URL}/ibo/stocks/books/add-stock/${id}`,
    payload,
  )
}

export const requestUpdateStatusIBOBookStockDetail = async (
  id: number,
  payload: IBookStockDetailUpdateStatusRequestPayload,
) => {
  return await axios.put<IBookStockRequestResponse>(
    `${BASE_URL}/ibo/stocks/books/update/book-detail-status/${id}`,
    payload,
  )
}

export const fetchIBOBookNumberListById = async (id: number) => {
  return await axios.get<IDataResponse<ISelectData[]>>(
    `${BASE_URL}/ibo/stocks/books/book-number-list/${id}`,
  )
}

export const requestUpdateBookNumberIBOBookStockDetail = async (
  bookStockDetailId: number,
  payload: IBookStockDetailUpdateBookNumberRequestPayload,
) => {
  return await axios.put<IBookStockRequestResponse>(
    `${BASE_URL}/ibo/stocks/books/update/book-detail-book-number/${bookStockDetailId}`,
    payload,
  )
}
