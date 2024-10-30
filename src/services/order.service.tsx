// @ts-nocheck
import { IQueryParams } from 'src/models/general.model'
import {
  IIBOChangeStatusOrderRequestPaylaod,
  IIBOChangeStatusOrderRequestResponse,
  IIBOOrderDetailResponse,
  IIBOOrderListResponse,
  IIBOOrderMetaResponse,
  IIBOSendOrderItemDetailResponse,
  IIBOSendOrderItemRequestPayload,
} from 'src/models/order.model'
import { IListDataResponse } from 'src/models/request.model'
import axios from 'axios'
import { BASE_URL } from './api.service'
import { toQueryString } from 'src/helpers/request.helper'

export const fetchIBOOrderList = async (queryParams?: IQueryParams) => {
  return await axios.get<
    IListDataResponse<IIBOOrderListResponse, IIBOOrderMetaResponse>
  >(`${BASE_URL}/ibo/orders${toQueryString(queryParams)}`)
}

export const fetchIBOOrderDetail = async (orderId: number) => {
  return await axios.get<IIBOOrderDetailResponse>(
    `${BASE_URL}/ibo/orders/detail/${orderId}`,
  )
}

export const requestIBOUpdateOrderStatus = async (
  orderId: number,
  payload: IIBOChangeStatusOrderRequestPaylaod,
) => {
  return await axios.put<IIBOChangeStatusOrderRequestResponse>(
    `${BASE_URL}/ibo/orders/change-order-status/${orderId}`,
    payload,
  )
}

export const requestIBOSendOrderItem = async (
  orderDetailId: number,
  payload: IIBOSendOrderItemRequestPayload,
) => {
  return await axios.post<IIBOChangeStatusOrderRequestResponse>(
    `${BASE_URL}/ibo/orders/send-item/${orderDetailId}`,
    payload,
  )
}

export const fetchIBOOrderSendDetail = async (orderDetailId: number) => {
  return await axios.get<IIBOSendOrderItemDetailResponse>(
    `${BASE_URL}/ibo/orders/order-detail/send-item-detail/${orderDetailId}`,
  )
}
