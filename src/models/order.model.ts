// @ts-nocheck
// IBO

import { IBank, IPaymentMethod } from './payment-method.model'
import { IUserTrainingCenter } from './user.model'

export interface IIBOOrderListResponse {
  id: number
  trainingCenter: IUserTrainingCenter
  rejectReason?: string
  orderStatus: string
  createdAt: string
  updatedAt: string
}

export interface IIBOOrderMetaResponse {
  currentTotalData: number
  totalData: number
  totalPending: number
  totalRejected: number
  totalUnpaid: number
  totalPaid: number
  totalPaidAmount: string
  totalUnpaidAmount: string
  totalAmount: string
}

export interface IIBOOrderDetails {
  id: number
  itemId: number
  itemName: string
  itemType: string
  price: string
  qty: string
  sentQty: number
  sentStatus: string
  isPerBundle: boolean
  createdAt: string
  updatedAt: string
}

export interface IIBOOrderDetailResponse {
  id: number
  trainingCenter: IUserTrainingCenter
  rejectReason?: string
  orderStatus: string
  orderDetails: IIBOOrderDetails[]
  paymentMethod: IPaymentMethod
  bank?: IBank
  createdAt: string
  updatedAt: string
}

export interface IIBOChangeStatusOrderRequestPaylaod {
  orderStatus: string
  paymentMethodId?: number
  bankId?: number
  rejectReason?: string
}

export interface IIBOChangeStatusOrderRequestResponse {
  message: string
}

export interface IIBOSendOrderItemFormData {
  qty: number
  itemNumberList?: string[]
}

export interface IIBOSendOrderItemRequestPayload {
  qty: number
  itemNumberList?: string[]
}

export interface IIBOSendOrderItemReceivedDetail {
  id: number
  itemNumberList: string[]
  qty: number
  sendAt: string
  createdAt: string
  updatedAt: string
}

export interface IIBOSendOrderItemDetailResponse {
  id: number
  itemName: string
  itemType: string
  price: string
  qty: number
  isPerBundle: boolean
  orderItemReceivedDetails: IIBOSendOrderItemReceivedDetail
  createdAt: string
  updatedAt: string
}
