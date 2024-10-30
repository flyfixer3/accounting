// @ts-nocheck
import { IBookData } from './books.model'
import { ICourseVoucherData } from './course-voucher.model'
import { ICourseData, ICourseLevelData } from './course.model'
import { IBank, IPaymentMethod } from './payment-method.model'
import { IStudentDetailResponse } from './student.model'
import { IUserTrainingCenter } from './user.model'

export type SalesInvoiceType =
  | 'equipment'
  | 'monthly-fee'
  | 'registration'
  | 'book'
  | 'course-voucher'

export interface ISalesInvoiceList {
  id: number
  invoiceNumber: string
  invoiceStatus: string
  student?: IStudentDetailResponse
  totalAmount: string
  totalPaidAmount: string
  totalUnpaidAmount: string
  isManuallyCreated: boolean
  createdAt: string
  updatedAt: string
}

export interface ISalesInvoiceMetaResponse {
  currentTotalData: number
  totalData: number
  totalPaid: number
  totalPartialPaid: number
  totalUnpaid: number
  totalPaidAmount: string
  totalUnpaidAmount: string
  totalAmount: string
}

export interface IPurchaseReportListMetaResponse {
  currentTotalData: number
}

export interface IPurchaseReportListResponse {
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

export interface IEquipmentHistoryData {
  equipmentName: string
  equipmentPrice: string
  equipmentImageUrl: string
}

export interface ISalesInvoiceDetailPayload {
  id: string
}

export interface IInvoiceEquipmentDetail {
  id: number
  equipmentId: number
  equipmentHistoryData: IEquipmentHistoryData
  qty: number
  totalPrice: string
  paymentMethod: IPaymentMethod | undefined
  bank?: IBank
  invoiceDetailStatus: string
  createdAt: string
  updatedAt: string
}

export interface IInvoiceBookDetail {
  id: number
  book: IBookData
  bookPrice: string
  paymentMethod: IPaymentMethod | undefined
  bank?: IBank
  invoiceDetailStatus: string
  createdAt: string
  updatedAt: string
}

export interface IInvoiceMonthlyFeeDetail {
  id: number
  courseLevel: ICourseLevelData
  monthlyFeePrice: string
  paymentMethod: IPaymentMethod | undefined
  bank?: IBank
  invoiceDetailStatus: string
  createdAt: string
  updatedAt: string
}

export interface IInvoiceRegistrationDetail {
  id: number
  course: ICourseData
  registrationPrice: string
  paymentMethod: IPaymentMethod | undefined
  bank?: IBank
  invoiceDetailStatus: string
  createdAt: string
  updatedAt: string
}

export interface ISalesInvoiceDetailResponse {
  id: number
  invoiceNumber: string
  student: IStudentDetailResponse
  invoiceBookDetail?: IInvoiceBookDetail[]
  invoiceEquipmentDetail?: IInvoiceEquipmentDetail[]
  invoiceMonthlyFeeDetail?: IInvoiceMonthlyFeeDetail[]
  invoiceRegistrationDetail?: IInvoiceRegistrationDetail[]
  invoiceStatus: string
  totalAmount: string
  totalPaidAmount: string
  totalUnpaidAmount: string
  isManuallyCreated: boolean
  createdAt: string
  updatedAt: string
}

export interface ISalesInvoiceSelectedData
  extends IInvoiceBookDetail,
    IInvoiceEquipmentDetail,
    IInvoiceMonthlyFeeDetail,
    IInvoiceRegistrationDetail {
  invoiceDetailId: number
  name: string
  totalPrice: string
  invoiceDetailType: SalesInvoiceType
  invoiceNumber: string
  studentId: number
}

export interface ISalesInvoicePaymentFormData {
  paymentMethodId: number
  bankId?: number
  discountVoucherId?: number
}

export interface ISalesInvoicePaymentRequestPayload {
  paymentMethodId: number
  bankId?: number
  invoiceDetailStatus: string
  voucherCode: string
}

export interface ISalesInvoiceRequestResponse {
  message: string
  isShowGenerateVoucherPopup: boolean
  data?: ISalesInvoiceDetailResponse
}

export interface ISalesInvoiceCalculateDiscountPayload {
  voucherCode: string
  invoiceDetailId: number
}

export interface ISalesInvoiceCalculateDiscountResponse {
  discountedPrice: string
  discountValue: string
}

// IBO
export interface IInvoiceCourseVoucherDetail {
  id: number
  orderCourseVoucher: ICourseVoucherData
  totalPrice: string
  price: string
  invoiceDetailStatus: string
  courseVoucherDetails: {
    id: number
    generatedCourseVoucerBundle: {
      id: number
      courseVoucherBundleId: string
      createdAt: string
      updatedAt: string
    }
    createdAt: string
    updatedAt: string
  }[]
  createdAt: string
  updatedAt: string
}

export interface IInvoiceBookDetail {
  id: number
  orderBook: {
    id: number
    orderBookStatus: string
  }
  invoiceBookDetailDetail: IBookData[]
}

export interface ISalesInvoiceIBOList {
  id: number
  invoiceNumber: string
  invoiceStatus: string
  trainingCenter: IUserTrainingCenter
  totalAmount: string
  totalPaidAmount: string
  totalUnpaidAmount: string
  isManuallyCreated: boolean
  createdAt: string
  updatedAt: string
}

export interface ISalesInvoiceIBODetailResponse {
  id: number
  invoiceNumber: string
  invoiceCourseVoucherDetail: IInvoiceCourseVoucherDetail[]
  invoiceBookDetail: IInvoiceBookDetail[]
  invoiceStatus: string
  trainingCenter: IUserTrainingCenter
  totalAmount: string
  totalPaidAmount: string
  totalUnpaidAmount: string
  isManuallyCreated: boolean
  createdAt: string
  updatedAt: string
}

export interface ISalesInvoiceIBOSelectedData {
  invoiceNumber: string
}

export interface ISalesInvoiceIBORequestPayload {
  invoiceStatus: string
}

export interface ISalesInvoiceIBORequestResponse {
  message: string
}
