// @ts-nocheck
import { IFile } from './general.model'
import { ISalesInvoiceDetailResponse } from './invoice.model'
import { IUserTrainingCenter } from './user.model'

export interface IStudentEquipmentList {
  id: number
  equipmentName: string
  equipmentPrice: string
  equipmentImageUrl?: string
  equipmentStatus: string
  qty: string
  createdAt: string
  updatedAt: string
}

export interface IStudentEquipmentMetaResponse {
  currentTotalData: number
  totalData: number
  totalAvailable: number
  totalOutOfStock: number
}

export interface IStudentEquipmentListPayload {
  page: number
  limit: number
  status?: string
  search?: string
}

export interface IStudentEquipmentPurchaseFormData {
  studentId: number
  qty: number
  equipmentId: number
}

export interface IStudentEquipmentPurchasePayload {
  studentId: number
  qty: number
  equipmentId: number
}

export interface IStudentEquipmentPurchaseRequestResponse {
  message: string
  data?: ISalesInvoiceDetailResponse
}

// TC Order to IBO

export interface IStudentEquipmentStockListPayload {
  page?: number
  limit?: number
  search?: string
}

export interface IStudentEquipmentStockListData {
  id: number
  equipmentName: string
  equipmentPrice: string
  equipmentImageUrl?: string
  qty: string
  currentStock?: number
}

export interface IStudentEquipmentOrderAddFormData {
  equipmentObj?: IStudentEquipmentStockListData
  qty: number
}

export interface IStudentEquipmentOrderCartData {
  equipmentObj?: IStudentEquipmentStockListData
  qty: number
}

export interface IStudentEquipmentOrderListData {
  id: number
  totalQty: number
  orderEquipmentStatus: string
  rejectReason: string
  createdAt: string
  updatedAt: string
}

export interface IStudentEquipmentOrderListPayload {
  page: number
  limit: number
  totalPage?: number
  status?: string
}
export interface IStudentEquipmentOrderMetaResponse {
  currentTotalData: number
  totalData: number
  totalPending: number
  totalAccepted: number
  totalComplete: number
  totalRejected: number
}

export interface IStudentEquipmentOrderDetailData {
  id: number
  iboEquipmentStock: IStudentEquipmentStockListData
  qty: string
  createdAt: string
  updatedAt: string
}

export interface IStudentEquipmentOrderDetailResponse {
  id: number
  rejectReason: string
  orderEquipmentStatus: string
  orderEquipmentDetails: IStudentEquipmentOrderDetailData[]
  createdAt: string
  updatedAt: string
}

export interface IStudentEquipmentOrderRequestPayload {
  orderEquipmentList: {
    equipmentStockId: number
    qty: number
  }[]
}

export interface IStudentEquipmentOrderRequestResponse {
  message: string
}

// IBO
export interface IStudentEquipmentOrderIBOData {
  id: number
  trainingCenter: IUserTrainingCenter
  totalQty: number
  rejectReason: string | null
  orderEquipmentStatus: string
  createdAt: string
  updatedAt: string
}

export interface IStudentEquipmentOrderIBOListQueryParams {
  page: number
  limit: number
  status?: string
  search?: string
}

export interface IStudentEquipmentOrderIBOMetaResponse {
  currentTotalData: number
  totalData: number
  totalPending: number
  totalAccepted: number
  totalComplete: number
  totalRejected: number
}

export interface IIStudentEquipmentOrderIBOData {
  id: number
  iboEquipmentStock: IStudentEquipmentStockListData
  qty: string
  createdAt: string
  updatedAt: string
}

export interface IStudentEquipmentOrderIBODetailResponse {
  id: number
  trainingCenter: IUserTrainingCenter
  rejectReason: string | null
  orderEquipmentStatus: string
  orderEquipmentDetails: IIStudentEquipmentOrderIBOData[]
  createdAt: string
  updatedAt: string
}

export interface IStudentEquipmentOrderIBORequestPayload {
  orderEquipmentStatus: string
  rejectReason?: string
}

export interface IStudentEquipmentOrderIBORequestResponse {
  message: string
}

// stock
export interface IStudentEquipmentStockIBOListData {
  id: number
  equipmentName: string
  equipmentPrice: string
  equipmentImageUrl: string
  qty: string
  createdAt: string
  updatedAt: string
}

export interface IStudentEquipmentStockIBOListPayload {
  page: number
  limit: number
  search?: string
  status?: string
}

export interface IStudentEquipmentStockIBOMetaResponse {
  currentTotalData: number
  totalEquipmentData: number
  totalOutOfStock: number
}

// stock detail
export interface IStudentEquipmentStockIBODetailResponse {
  id: number
  equipmentName: string
  equipmentPrice: string
  equipmentImageUrl: string
  qty: string
  createdAt: string
  updatedAt: string
}

// stock history
export interface IEquipmentStockStockDetailListData {
  id: number
  equipmentId: number
  quantity: number
  description: string
  prev_stock: number
  createdAt: string
  updatedAt: string
}
export interface IEquipmentStockStockDetailListMetaResponse {
  currentTotalData: number
}

// create & update stock
export interface IStudentEquipmentStockFormData {
  equipmentName: string
  equipmentPrice: string
  equipmentImageUrl: string
  equipmentImageFile: IFile
  qty: number
}
export interface IStudentEquipmentStockCreateRequestPayload {
  equipmentName: string
  equipmentPrice: string
  equipmentImageUrl: string
  qty: number
}

export interface IStudentEquipmentStockUpdateRequestPayload {
  equipmentName: string
  equipmentPrice: string
  equipmentImageUrl: string
  qty: number
}

export interface IStudentEquipmentStockRequestResponse {
  message: string
  data?: IStudentEquipmentStockIBODetailResponse
}
