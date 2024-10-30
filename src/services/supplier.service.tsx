// @ts-nocheck
import axios from 'axios'
import { toQueryString } from 'src/helpers/request.helper'
import { IQueryParams } from 'src/models/general.model'
import { IListDataResponse } from 'src/models/request.model'
import {
  ISupplierDataCreateRequestPayload,
  ISupplierDataCreateRequestResponse,
  ISupplierDataListMetaResponse,
  ISupplierDataResponse,
  ISupplierOrderCreateRequestPayload,
  ISupplierOrderDetailResponse,
  ISupplierOrderListMetaResponse,
  ISupplierOrderListResponse,
  ISupplierOrderReceiveItemDetailResponse,
  ISupplierOrderReceiveItemDetailUpdateBookNumberRequestPayload,
  ISupplierOrderReceiveOrderItemRequestPayload,
  ISupplierOrderReceiveOrderItemRequestResponse,
  ISupplierOrderUpdatePaymentRequestPayload,
} from 'src/models/supplier.model'
import { BASE_URL } from './api.service'

export const fetchSupplierOrderList = async (queryParams?: IQueryParams) => {
  return await axios.get<
    IListDataResponse<
      ISupplierOrderListResponse,
      ISupplierOrderListMetaResponse
    >
  >(`${BASE_URL}/ibo/supplier-orders${toQueryString(queryParams)}`)
}

export const fetchSupplierOrderDetail = async (orderId?: number) => {
  return await axios.get<ISupplierOrderDetailResponse>(
    `${BASE_URL}/ibo/supplier-orders/detail/${orderId}`,
  )
}

export const requestSupplierReceiveOrder = async (
  orderDetailId: number,
  payload?: ISupplierOrderReceiveOrderItemRequestPayload,
) => {
  return await axios.post<ISupplierOrderReceiveOrderItemRequestResponse>(
    `${BASE_URL}/ibo/supplier-orders/received-item/${orderDetailId}`,
    payload,
  )
}

export const fetchSupplierReceiveItemDetail = async (
  orderDetailId?: number,
) => {
  return await axios.get<ISupplierOrderReceiveItemDetailResponse>(
    `${BASE_URL}/ibo/supplier-orders/order-detail/${orderDetailId}`,
  )
}

export const requestUpdateSupplierPaymentStatus = async (
  orderId: number,
  payload: ISupplierOrderUpdatePaymentRequestPayload,
) => {
  return await axios.put<ISupplierOrderReceiveOrderItemRequestResponse>(
    `${BASE_URL}/ibo/supplier-orders/update-payment-status/${orderId}`,
    payload,
  )
}

export const requestCreateSupplierOrder = async (
  payload: ISupplierOrderCreateRequestPayload,
) => {
  return await axios.post<ISupplierOrderDetailResponse>(
    `${BASE_URL}/ibo/supplier-orders/create`,
    payload,
  )
}

export const fetchSupplierDataList = async (
  queryParams?: IQueryParams,
  abortController?: AbortController,
) => {
  const payload = abortController ? { signal: abortController.signal } : {}

  return await axios.get<
    IListDataResponse<ISupplierDataResponse, ISupplierDataListMetaResponse>
  >(`${BASE_URL}/ibo/suppliers${toQueryString(queryParams)}`, payload)
}

export const fetchSupplierDetail = async (supplierId?: number) => {
  return await axios.get<ISupplierDataResponse>(
    `${BASE_URL}/ibo/suppliers/detail/${supplierId}`,
  )
}

export const requestCreateSupplierDetail = async (
  payload: ISupplierDataCreateRequestPayload,
) => {
  return await axios.post<ISupplierDataCreateRequestResponse>(
    `${BASE_URL}/ibo/suppliers/create`,
    payload,
  )
}

export const requestUpdateSupplierDetail = async (
  supplierId: number,
  payload: ISupplierDataCreateRequestPayload,
) => {
  return await axios.put(
    `${BASE_URL}/ibo/suppliers/update/${supplierId}`,
    payload,
  )
}

export const requestUpdateSupplierOrderBookNumberList = async (
  orderItemReceivedDetailId: number,
  payload: ISupplierOrderReceiveItemDetailUpdateBookNumberRequestPayload,
) => {
  return await axios.put<ISupplierOrderReceiveOrderItemRequestResponse>(
    `${BASE_URL}/ibo/supplier-orders/order-detail/update-number-list/${orderItemReceivedDetailId}`,
    payload,
  )
}
