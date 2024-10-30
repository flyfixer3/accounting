// @ts-nocheck
import { IListDataResponse } from 'src/models/request.model'
import axios from 'axios'
import {
  IReportPurchaseListMetaResponse,
  IReportPurchaseListResponse,
  IReportPurchaseQueryParams,
  IReportSalesListMetaResponse,
  IReportSalesListResponse,
  IReportSalesQueryParams,
  IReportStocksListMetaResponse,
  IReportStocksListResponse,
  IReportStocksQueryParams,
} from 'src/models/report.model'
import { BASE_URL } from './api.service'
import { toQueryString } from 'src/helpers/request.helper'

// IBO
export const fetchIBOReportPurchaseList = async (
  queryParams?: IReportPurchaseQueryParams,
) => {
  return await axios.get<
    IListDataResponse<
      IReportPurchaseListResponse,
      IReportPurchaseListMetaResponse
    >
  >(`${BASE_URL}/ibo/reports/purchase${toQueryString(queryParams)}`)
}

export const fetchIBOReportSalesList = async (
  queryParams?: IReportSalesQueryParams,
) => {
  return await axios.get<
    IListDataResponse<IReportSalesListResponse, IReportSalesListMetaResponse>
  >(`${BASE_URL}/ibo/reports/sales${toQueryString(queryParams)}`)
}

export const fetchIBOReportStocksList = async (
  queryParams?: IReportStocksQueryParams,
) => {
  return await axios.get<
    IListDataResponse<IReportStocksListResponse, IReportStocksListMetaResponse>
  >(`${BASE_URL}/ibo/reports/stocks${toQueryString(queryParams)}`)
}
