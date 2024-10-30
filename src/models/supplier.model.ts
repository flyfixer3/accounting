// @ts-nocheck
import { Dayjs } from 'dayjs'
import { IBank, IPaymentMethod } from './payment-method.model'

export interface ISupplierOrderListResponse {
  id: number
  supplier: ISupplierDataResponse
  paymentStatus: string
  orderDate: string
  totalPrice: number
  createdAt: string
  updatedAt: string
}

export interface ISupplierOrderListMetaResponse {
  currentTotalData: number
  totalData: number
  totalPaid: number
  totalUnpaid: number
  totalPaidAmount: string
  totalUnpaidAmount: string
  totalAmount: number
}

export interface ISupplierOrderDetailData {
  id: number
  itemName: string
  itemType: string
  price: string
  sellingPrice?: string
  qty: string
  receivedQty?: number
  isPerBundle?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ISupplierOrderDetailResponse {
  id: number
  // supplierName: string
  supplier: ISupplierDataResponse
  paymentStatus: string
  orderDate: string
  totalPrice: string
  orderDetails: ISupplierOrderDetailData[]
  paymentMethod?: IPaymentMethod
  bank?: IBank
  createdAt: string
  updatedAt: string
}

export interface ISupplierOrderReceiveItemDetailData {
  id: number
  itemNumberList: string[]
  qty: number
  receivedAt: string
  createdAt: string
  updatedAt: string
}

export interface ISupplierOrderReceiveItemDetailResponse {
  id: number
  itemName: string
  itemType: string
  price: string
  qty: string
  isPerBundle: boolean
  orderItemReceivedDetails: ISupplierOrderReceiveItemDetailData[]
  createdAt: string
  updatedAt: string
}

export interface ISupplierOrderReceiveItemDetailUpdateBookNumberRequestPayload {
  itemNumberList?: string[]
}

export interface ISupplierOrderReceiveBookFormData {
  bookId: number
  bookNumberList?: string
  qty: number
}

export interface ISupplierOrderReceiveCourseVoucherFormData {
  courseId: number
  courseVoucherNumberList?: string
  qty: number
}

export interface ISupplierOrderReceiveEquipmentFormData {
  qty: number
}

export interface ISupplierOrderReceiveOrderItemRequestPayload {
  qty: number
  itemNumberList?: string[]
}

export interface ISupplierOrderUpdatePaymentRequestPayload {
  paymentMethodId: number
  bankId: number
}

export interface ISupplierOrderReceiveOrderItemRequestResponse {
  message: string
}

export interface IItemIdNamePair {
  itemId: number
  itemName: string
}

// Need to use itemIdNamePair to make Form component read the value
export interface ISupplierOrderCreateOrderDetailFormData {
  id?: number
  itemIdNamePair: IItemIdNamePair
  itemType: string
  price: string
  qty: number
}

export interface ISupplierOrderCreateFormData {
  supplierId: number
  orderDate: Dayjs
  paymentStatus: string
  paymentMethodId?: number
  bankId?: number
  orderDetailList: ISupplierOrderCreateOrderDetailFormData[]
}

export interface ISupplierOrderCreateOrderDetailPayload {
  itemId: number
  itemName: string
  itemType: string
  price: string
  qty: number
}

export interface ISupplierOrderCreateRequestPayload {
  supplierId: number
  orderDate: string
  paymentStatus: string
  paymentMethodId?: number
  bankId?: number
  orderDetailList: ISupplierOrderCreateOrderDetailPayload[]
}

export interface ISupplierOrderCreateRequestResponse {
  message: string
}

// Supplier User data
export interface ISupplierDataResponse {
  id: number
  supplierName: string
  supplierAddress: string
  supplierPhoneNumber?: string
  supplierEmail?: string
  supplierPicName?: string
  supplierPicPhoneNumber?: string
  createdAt: string
  updatedAt: string
}

export interface ISupplierDataListMetaResponse {
  currentTotalData: number
  totalData: number
}

export interface ISupplierDataCreateRequestPayload {
  supplierName: string
  supplierAddress: string
  supplierPhoneNumber?: string
  supplierEmail?: string
  supplierPicName?: string
  supplierPicPhoneNumber?: string
}

export interface ISupplierDataForm {
  supplierName: string
  supplierAddress: string
  supplierPhoneNumber?: string
  supplierEmail?: string
  supplierPicName?: string
  supplierPicPhoneNumber?: string
}

export interface ISupplierDataCreateRequestResponse {
  message: string
}
