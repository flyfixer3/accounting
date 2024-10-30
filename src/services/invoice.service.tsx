// @ts-nocheck
import axios from 'axios'
import { toQueryString } from 'src/helpers/request.helper'
import { IQueryParams } from 'src/models/general.model'
import {
  IPurchaseReportListMetaResponse,
  IPurchaseReportListResponse,
  ISalesInvoiceCalculateDiscountPayload,
  ISalesInvoiceCalculateDiscountResponse,
  ISalesInvoiceDetailPayload,
  ISalesInvoiceDetailResponse,
  ISalesInvoiceIBODetailResponse,
  ISalesInvoiceIBOList,
  ISalesInvoiceIBORequestPayload,
  ISalesInvoiceIBORequestResponse,
  ISalesInvoiceList,
  ISalesInvoiceMetaResponse,
  ISalesInvoicePaymentRequestPayload,
  ISalesInvoiceRequestResponse,
} from 'src/models/invoice.model'
import { IDataResponse, IListDataResponse } from 'src/models/request.model'
import { BASE_URL } from './api.service'

export const fetchSalesInvoiceList = async (queryParams?: IQueryParams) => {
  return await axios.get<
    IListDataResponse<ISalesInvoiceList, ISalesInvoiceMetaResponse>
  >(`${BASE_URL}/invoices${toQueryString(queryParams)}`)
}

export const fetchPurchaseReportList = async (queryParams?: IQueryParams) => {
  return await axios.get<
    IListDataResponse<
      IPurchaseReportListResponse,
      IPurchaseReportListMetaResponse
    >
  >(`${BASE_URL}/invoices/purchase${toQueryString(queryParams)}`)
}

export const fetchSalesInvoiceDetail = async (
  payload: ISalesInvoiceDetailPayload,
) => {
  return await axios.get<IDataResponse<ISalesInvoiceDetailResponse>>(
    `${BASE_URL}/invoices/detail/${payload?.id}`,
  )
}

export const requestSalesInvoicePayment = async (
  invoiceNumber: string,
  invoiceDetailType: string,
  invoiceDetailId: number,
  payload: ISalesInvoicePaymentRequestPayload,
) => {
  return await axios.put<ISalesInvoiceRequestResponse>(
    `${BASE_URL}/invoices/update/${invoiceNumber}/${invoiceDetailType}/${invoiceDetailId}`,
    payload,
  )
}

export const requestSalesInvoiceDiscountVoucherCalculation = async (
  payload: ISalesInvoiceCalculateDiscountPayload,
) => {
  return await axios.post<
    IDataResponse<ISalesInvoiceCalculateDiscountResponse>
  >(`${BASE_URL}/invoices/calculate-with-discount-voucher`, payload)
}

// IBO
export const fetchIBOSalesInvoiceList = async (queryParams?: IQueryParams) => {
  return await axios.get<
    IListDataResponse<ISalesInvoiceIBOList, ISalesInvoiceMetaResponse>
  >(`${BASE_URL}/ibo/invoices${toQueryString(queryParams)}`)
}

export const fetchIBOSalesInvoiceDetail = async (
  queryParams: ISalesInvoiceDetailPayload,
) => {
  return await axios.get<IDataResponse<ISalesInvoiceIBODetailResponse>>(
    `${BASE_URL}/ibo/invoices/detail/${queryParams?.id}`,
  )
}

export const requestUpdateStatusSalesInvoiceIBO = async (
  invoiceNumber: string,
  payload: ISalesInvoiceIBORequestPayload,
) => {
  return await axios.put<ISalesInvoiceIBORequestResponse>(
    `${BASE_URL}/ibo/invoices/update-status/${invoiceNumber}`,
    payload,
  )
}
