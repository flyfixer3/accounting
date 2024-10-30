// @ts-nocheck
import { Dayjs } from 'dayjs'
import { IBank } from './payment-method.model'
import { ISupplierDataResponse } from './supplier.model'
import { IUserTrainingCenter } from './user.model'

export interface IReportQueryParams {
  page: number
  limit: number
  startDate: string | Dayjs
  endDate: string | Dayjs
  totalData: number
}

export interface IReportPurchaseQueryParams extends IReportQueryParams {
  supplierIdList?: number[]
  search: string
}

export interface IReportPurchaseListMetaResponse {
  currentTotalData: number
}

export interface IReportPurchaseListResponse {
  id?: string
  orderId: number
  orderDate: string
  supplier: ISupplierDataResponse
  itemName: string
  itemType: string
  orderQty: string
  buyPrice: string
  totalBuyPrice: string
  totalReceivedQty: number
  sellingPrice: string
  paymentStatus: string
  paymentMethod?: string
  bank?: IBank
}

export interface IReportSalesQueryParams extends IReportQueryParams {
  trainingCenterIdList?: number[]
  search: string
}

export interface IReportSalesListMetaResponse {
  currentTotalData: number
}

export interface IReportSalesListResponse {
  id?: string
  orderId: number
  orderDate: string
  trainingCenter: IUserTrainingCenter
  itemName: string
  itemType: string
  orderQty: string
  buyPrice: string
  totalBuyPrice: string
  totalSentQty: number
  totalReceivedQty: number
  sellingPrice: string
  orderStatus: string
  paymentMethod?: string
  bank?: IBank
}

export interface IReportStocksQueryParams extends IReportQueryParams {
  itemTypeList?: number[]
}

export interface IReportStocksListMetaResponse {
  currentTotalData: number
}

export interface IReportStocksListResponse {
  id?: string
  itemId: number
  itemType: string
  itemName: string
  initialStock: number
  stockIn: number
  stockOutSold: number
  stockOutDamaged?: number
  finalStock: number
  avgPurchasePrice: string
  avgSalesPrice: string
  currentSalesPrice: string
}
