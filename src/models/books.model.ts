// @ts-nocheck
import { STATUS_ENUM } from 'src/enums/enums'
import { ICourseData, ICourseLevelData } from './course.model'
import { IFile } from './general.model'
import { ISalesInvoiceDetailResponse } from './invoice.model'
import { IUserTrainingCenter } from './user.model'

export interface IBookData {
  id: number
  bookNumber: string
  bookName: string
  bookPrice: string
  bookImageUrl?: string
  purchaseAt: string
  updatedAt?: string
  createdAt?: string
  status: string
  courseId: number
  courseLevelId: number
  bookStatus: string
}

export interface IBookFormData {
  id: number
  bookNumber: string
  bookName: string
  bookPrice: string
  bookImageUrl?: IFile
  purchaseAt: string
  status?: string
  courseId: number
  courseLevelId: number
  bookStatus: string
}

export interface IBookMetaResponse {
  currentTotalData: number
  totalData: number
  totalAvailableData: number
  totalTakenData: number
  totalDamagedData: number
}

export interface IBookListPayload {
  page: number
  limit: number
  status?: string
  search?: string
}

export interface IBookTableData {
  bookNumber: string
  bookName: string
  bookPrice: string
}

export interface IBookDetailResponse {
  id: number
  bookNumber: string
  bookName: string
  bookPrice: string
  bookImageUrl: string | undefined
  course: ICourseData
  courseLevel: ICourseLevelData
  student: number | undefined
  bookStatus: string
  createdAt: string
  updatedAt: string
  deletedAt: string
  status: string
}

export interface IBookByCourseLevelListResponse {
  id: number
  name: string
}

export interface IBookRequestResponse {
  message: string
  data?: IBookDetailResponse
}

export interface IBookRequestPayload {
  book_status: STATUS_ENUM
}

export interface IBookPurchaseFormData {
  studentId: number
  bookId: number
}

export interface IBookPurchasePayload {
  studentId: number
  bookId: number
}

export interface IBookPurchaseRequestResponse {
  message: string
  data?: ISalesInvoiceDetailResponse
}

export interface IBookStockListPayload {
  page?: number
  limit?: number
  search?: string
  status?: string
}

export interface IBookStockListData {
  id: number
  bookName: string
  bookPrice: string
  bookImageUrl: string
  course: ICourseData
  courseLevel: ICourseLevelData
  qty: string
  currentStock?: number
}

export interface IBookOrderAddFormData {
  bookObj?: IBookStockListData
  qty: number
}

export interface IBookOrderCartData {
  bookObj?: IBookStockListData
  qty: number
}

export interface IBookOrderListData {
  id: number
  totalQty: number
  orderBookStatus: string
  createdAt: string
  updatedAt: string
}
export interface IBookOrderMetaResponse {
  currentTotalData: number
  totalData: number
  totalPending: number
  totalAccepted: number
  totalComplete: number
  totalRejected: number
}

export interface IBookOrderDetailData {
  id: number
  book: IBookData
  qty: string
  createdAt: string
  updatedAt: string
}
export interface IBookOrderDetailResponse extends IBookOrderListData {
  orderBookDetails: IBookOrderDetailData[]
  orderBookStatus: string
  rejectReason: string
}

export interface IBookOrderRequestPayload {
  orderBookList: {
    bookStockId: number
    qty: number
  }[]
}

export interface IBookOrderRequestResponse {
  message: string
}

// IBO

export interface IBookOrderIBOData {
  id: number
  trainingCenter: IUserTrainingCenter
  totalQty: number
  rejectReason: string | null
  orderBookStatus: string
  createdAt: string
  updatedAt: string
}

export interface IBookOrderIBOMetaResponse {
  currentTotalData: number
  totalData: number
  totalPending: number
  totalAccepted: number
  totalComplete: number
  totalRejected: number
}

export interface IIBookOrderIBOData {
  id: number
  book: IBookData
  qty: string
  createdAt: string
  updatedAt: string
}

export interface IBookOrderIBODetailResponse {
  id: number
  trainingCenter: IUserTrainingCenter
  rejectReason: string | null
  orderBookStatus: string
  orderBookDetails: IIBookOrderIBOData[]
  createdAt: string
  updatedAt: string
}

export interface IBookOrderIBORequestPaylaod {
  orderBookStatus: string
  rejectReason?: string
}

export interface IBookOrderIBORequestResponse {
  message: string
}

// stock
export interface IBookStockIBOListData {
  id: number
  bookName: string
  bookPrice: string
  bookImageUrl: string
  totalBook: number
  totalAvailableBook: number
  course: ICourseData
  courseLevel: ICourseLevelData
  createdAt: string
  updatedAt: string
}

export interface IBookStockIBOMetaResponse {
  currentTotalData: number
  totalBookData: number
  totalOutOfStock: number
}

// stock detail
export interface IBookStockIBOStockDetailListData {
  id: number
  bookNumber: string
  bookStatus: string
  createdAt: string
  updatedAt: string
}

export interface IBookStockIBOStockDetailListMetaResponse {
  currentTotalData: number
  totalBookNumber: number
  totalAvailable: number
  totalDamaged: number
  totalSold: number
}

// stock detail list
export interface IBookStockStockDetailListData {
  id: number
  bookId: number
  quantity: number
  description: string
  prev_stock: number
  createdAt: string
  updatedAt: string
}
export interface IBookStockStockDetailListMetaResponse {
  currentTotalData: number
}

export interface IBookStockIBODetailResponse {
  id: number
  bookName: string
  bookPrice: string
  bookImageUrl: string
  course: ICourseData
  courseLevel: ICourseLevelData
  totalAvailable: number
  totalSold: number
  totalDamaged: number
  createdAt: string
  updatedAt: string
}

// create & update stock
export interface IBookStockFormData {
  bookName: string
  bookPrice: string
  bookImageUrl: string
  bookImageFile: IFile
  courseId: number
  courseLevelId: number
}
export interface IBookStockCreateRequestPayload {
  bookName: string
  bookPrice: string
  bookImageUrl: string
  courseId: number
  courseLevelId: number
}

export interface IBookStockUpdateRequestPayload {
  bookName: string
  bookPrice: string
  bookImageUrl: string
  courseId: number
  courseLevelId: number
}

export interface IBookStockRequestResponse {
  message: string
  data?: IBookStockIBOListData
}

export interface IBookStockDetailCreateRequestPayload {
  bookNumberList: string[]
}

export interface IBookStockDetailUpdateStatusRequestPayload {
  bookStatus: string
}

export interface IBookStockDetailUpdateBookNumberRequestPayload {
  bookNumber: string
}
