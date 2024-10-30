// @ts-nocheck
import axios from 'axios'
import { toQueryString } from 'src/helpers/request.helper'
import {
  IReportPurchaseListMetaResponse,
  IReportPurchaseListResponse,
  IReportPurchaseQueryParams,
  IReportSalesListMetaResponse,
  IReportSalesListResponse,
  IReportSalesQueryParams,
} from 'src/models/report.model'
import { IListDataResponse } from 'src/models/request.model'
import { BASE_URL } from './api.service'

// IBO
export const fetchIBOCreditDebtsList = async (
  queryParams?: IReportPurchaseQueryParams,
) => {
  return await axios.get<
    IListDataResponse<
      IReportPurchaseListResponse,
      IReportPurchaseListMetaResponse
    >
  >(`${BASE_URL}/ibo/credits/debts${toQueryString(queryParams)}`)
}

export const fetchIBOCreditReceivablesList = async (
  queryParams?: IReportSalesQueryParams,
) => {
  return await axios.get<
    IListDataResponse<IReportSalesListResponse, IReportSalesListMetaResponse>
  >(`${BASE_URL}/ibo/credits/receivables${toQueryString(queryParams)}`)
}
