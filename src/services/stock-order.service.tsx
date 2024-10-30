// @ts-nocheck
import { toQueryString } from 'src/helpers/request.helper'
import { IDataResponse, IListDataResponse } from 'src/models/request.model'
import {
  IStockOrderAvailableListData,
  IStockOrderAvailableListQueryParams,
  IStockOrderCreateRequestPayload,
  IStockOrderDetailResponse,
  IStockOrderListMetaResponse,
  IStockOrderListResponse,
  IStockOrderReceiveItemDetailResponse,
  IStockOrderRequestResponse,
} from 'src/models/stock-order.model'
import axios from 'axios'
import { IQueryParams } from 'src/models/general.model'
import { BASE_URL } from './api.service'

export const fetchStockOrderList = async (queryParams?: IQueryParams) => {
  return await axios.get<
    IListDataResponse<IStockOrderListResponse, IStockOrderListMetaResponse>
  >(`${BASE_URL}/orders${toQueryString(queryParams)}`)
}

export const fetchStockOrderDetail = async (orderId: number) => {
  return await axios.get<IStockOrderDetailResponse>(
    `${BASE_URL}/orders/detail/${orderId}`,
  )
}

export const fetchStockReceiveOrderDetail = async (orderDetailId: number) => {
  return await axios.get<IStockOrderReceiveItemDetailResponse>(
    `${BASE_URL}/orders/order-detail/${orderDetailId}`,
  )
}

export const fetchStockOrderAvailableList = async (
  queryParams?: IStockOrderAvailableListQueryParams,
) => {
  return await axios.get<IDataResponse<IStockOrderAvailableListData>>(
    `${BASE_URL}/orders/item-list${toQueryString(queryParams)}`,
  )
}

export const requestCreateOrderCheckout = async (
  payload: IStockOrderCreateRequestPayload,
) => {
  return await axios.post<IStockOrderRequestResponse>(
    `${BASE_URL}/orders/create`,
    payload,
  )
}

export const requestConfirmReceiveOrder = async (
  orderDetailId: number,
  sentDetailId: number,
) => {
  return await axios.post<IStockOrderRequestResponse>(
    `${BASE_URL}/orders/order-detail/${orderDetailId}/confirm-received-order/${sentDetailId}`,
  )
}
