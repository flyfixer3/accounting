// @ts-nocheck
import { ICourseData } from './course.model'
import { IUserTrainingCenter } from './user.model'

export interface ICourseVoucherData {
  id: number
  bundleQty: number
  orderCourseVoucherStatus: string
  course: ICourseData
  trainingCenter: IUserTrainingCenter
  rejectReason?: string
  createdAt: string
  updatedAt: string
}

export interface ICourseVoucherMetaResponse {
  currentTotalData: number
  totalData: number
  totalPending: number
  totalAccepted: number
  totalRejected: number
}

export interface ICourseVoucherListPayload {
  page: number
  limit: number
  status?: string
  search?: string
}

export interface ICourseVoucherRequestPayload {
  bundleQty: number
  courseId: number
}

export interface ICourseVoucherRequestResponse {
  message: string
  data?: ICourseVoucherData
}

export interface ICourseVoucherByCourseData {
  courseName: string
  totalAvailable: number
}

export interface ICourseVoucherCountResponse {
  data: ICourseVoucherByCourseData[]
}

export interface ICourseVoucherBundlePriceRequestPayload {
  courseId: number
}

export interface ICourseVoucherBundlePriceRequestResponse {
  courseVoucherBundlePrice: string
}

export interface ICourseVoucherOrderRequestPayload {
  orderCourseVoucherStatus: string
  rejectReason?: string
}

export interface ICourseVoucherOrderRequestResponse {
  message: string
}

// IBO

export interface ICourseVoucherIBOPriceListData {
  id: number
  course: ICourseData
  price: string
  createdAt: string
  updatedAt: string
}

export interface ICourseVoucherIBOPriceRequestPayload {
  price: string
}

export interface ICourseVoucherIBOPriceListMetaResponse {
  currentTotalData: number
  totalData: number
}

export interface ICourseVoucherIBOPriceRequestResponse {
  message: string
}

export interface ICourseVoucherIBOStockSearchData {
  itemId: number
  itemName: string
}
