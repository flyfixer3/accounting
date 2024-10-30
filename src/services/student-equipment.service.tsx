// @ts-nocheck
import axios from 'axios'
import { toQueryString } from 'src/helpers/request.helper'
import { IQueryParams } from 'src/models/general.model'
import {
  IDataResponse,
  IDetailPayload,
  IListDataResponse,
} from 'src/models/request.model'
import {
  IEquipmentStockStockDetailListData,
  IEquipmentStockStockDetailListMetaResponse,
  IStudentEquipmentList,
  IStudentEquipmentListPayload,
  IStudentEquipmentMetaResponse,
  IStudentEquipmentOrderDetailResponse,
  IStudentEquipmentOrderIBOData,
  IStudentEquipmentOrderIBODetailResponse,
  IStudentEquipmentOrderIBOListQueryParams,
  IStudentEquipmentOrderIBOMetaResponse,
  IStudentEquipmentOrderIBORequestPayload,
  IStudentEquipmentOrderIBORequestResponse,
  IStudentEquipmentOrderListData,
  IStudentEquipmentOrderListPayload,
  IStudentEquipmentOrderMetaResponse,
  IStudentEquipmentOrderRequestPayload,
  IStudentEquipmentOrderRequestResponse,
  IStudentEquipmentPurchasePayload,
  IStudentEquipmentPurchaseRequestResponse,
  IStudentEquipmentStockCreateRequestPayload,
  IStudentEquipmentStockIBODetailResponse,
  IStudentEquipmentStockIBOListData,
  IStudentEquipmentStockIBOMetaResponse,
  IStudentEquipmentStockListData,
  IStudentEquipmentStockListPayload,
  IStudentEquipmentStockRequestResponse,
  IStudentEquipmentStockUpdateRequestPayload,
} from 'src/models/student-equipment.model'
import { BASE_URL } from './api.service'

export const fetchStudentEquipmentList = async (
  queryParams?: IStudentEquipmentListPayload,
) => {
  return await axios.get<
    IListDataResponse<IStudentEquipmentList, IStudentEquipmentMetaResponse>
  >(`${BASE_URL}/equipment${toQueryString(queryParams)}`)
}

export const requestPurchaseEquipment = async (
  payload: IStudentEquipmentPurchasePayload,
) => {
  return await axios.post<IStudentEquipmentPurchaseRequestResponse>(
    `${BASE_URL}/purchase/equipment`,
    payload,
  )
}

// TC Order

export const fetchStudentEquipmentStockList = async (
  queryParams?: IStudentEquipmentStockListPayload,
) => {
  return await axios.get<IDataResponse<IStudentEquipmentStockListData>>(
    `${BASE_URL}/orders/equipment/available-items${toQueryString(queryParams)}`,
  )
}

export const fetchStudentEquipmentOrderList = async (
  queryParams?: IStudentEquipmentOrderListPayload,
) => {
  return await axios.get<
    IListDataResponse<
      IStudentEquipmentOrderListData,
      IStudentEquipmentOrderMetaResponse
    >
  >(`${BASE_URL}/orders/equipment${toQueryString(queryParams)}`)
}

export const fetchStudentEquipmentOrderDetail = async (
  queryParams?: IDetailPayload,
) => {
  return await axios.get<IDataResponse<IStudentEquipmentOrderDetailResponse>>(
    `${BASE_URL}/orders/equipment/detail/${queryParams?.id}`,
  )
}

export const requestStudentEquipmentOrderCheckout = async (
  payload: IStudentEquipmentOrderRequestPayload,
) => {
  return await axios.post<IStudentEquipmentOrderRequestResponse>(
    `${BASE_URL}/orders/equipment/create`,
    payload,
  )
}

export const requestUpdateStudentEquipmentOrderStatus = async (id: number) => {
  return await axios.put<IStudentEquipmentOrderRequestResponse>(
    `${BASE_URL}/orders/equipment/update-status-received/${id}`,
  )
}

// IBO
export const fetchIBOStudentEquipmentOrderList = async (
  queryParams?: IStudentEquipmentOrderIBOListQueryParams,
) => {
  return await axios.get<
    IListDataResponse<
      IStudentEquipmentOrderIBOData,
      IStudentEquipmentOrderIBOMetaResponse
    >
  >(`${BASE_URL}/ibo/orders/equipment${toQueryString(queryParams)}`)
}

export const fetchIBOStudentEquipmentOrderDetail = async (id: string) => {
  return await axios.get<
    IDataResponse<IStudentEquipmentOrderIBODetailResponse>
  >(`${BASE_URL}/ibo/orders/equipment/detail/${id}`)
}

export const requestUpdateStudentEquipmentOrderIBOStatus = async (
  id: number,
  payload: IStudentEquipmentOrderIBORequestPayload,
) => {
  return await axios.put<IStudentEquipmentOrderIBORequestResponse>(
    `${BASE_URL}/ibo/orders/equipment/update-status/${id}`,
    payload,
  )
}

// stock
export const fetchIBOStudentEquipmentStockList = async (
  queryParams?: IQueryParams,
  abortController?: AbortController,
) => {
  const payload = abortController ? { signal: abortController.signal } : {}
  return await axios.get<
    IListDataResponse<
      IStudentEquipmentStockIBOListData,
      IStudentEquipmentStockIBOMetaResponse
    >
  >(`${BASE_URL}/ibo/stocks/equipment${toQueryString(queryParams)}`, payload)
}

export const fetchIBOStudentEquipmentStockDetail = async (id: number) => {
  return await axios.get<
    IDataResponse<IStudentEquipmentStockIBODetailResponse>
  >(`${BASE_URL}/ibo/stocks/equipment/detail/${id}`)
}

export const requestCreateIBOStudentEquipmentStock = async (
  payload: IStudentEquipmentStockCreateRequestPayload,
) => {
  return await axios.post<IStudentEquipmentStockRequestResponse>(
    `${BASE_URL}/ibo/stocks/equipment/insert`,
    payload,
  )
}

export const requestUpdateIBOStudentEquipmentStock = async (
  id: number,
  payload: IStudentEquipmentStockUpdateRequestPayload,
) => {
  return await axios.put<IStudentEquipmentStockRequestResponse>(
    `${BASE_URL}/ibo/stocks/equipment/update/${id}`,
    payload,
  )
}

export const fetchIBOEquipmentStockStockDetailList = async (
  id: number,
  queryParams: IQueryParams,
) => {
  return await axios.get<
    IListDataResponse<
      IEquipmentStockStockDetailListData,
      IEquipmentStockStockDetailListMetaResponse
    >
  >(
    `${BASE_URL}/ibo/stocks/equipment/detail/${id}/stock${toQueryString(
      queryParams,
    )}`,
  )
}
