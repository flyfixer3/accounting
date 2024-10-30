// @ts-nocheck
import { IClassDetailResponse } from './class.model'
import { ICourseVoucherByCourseData } from './course-voucher.model'
import { IStudentDetailResponse } from './student.model'

// TC
export interface IDashboardMetaResponse {
  totalUnpaidInvoice: number
  totalStudent: number
  orderMetadata: IDashboardOrderMetadata
  totalAvailableCourseVoucher: ICourseVoucherByCourseData[]
  studentWhoCelebrateBirthayList: IStudentDetailResponse[]
  todayClassList: IClassDetailResponse[]
}

interface IDashboardOrderMetadata {
  totalPending: number
  totalUnpaid: number
}

// IBO
export interface IDashboardIBOMetaResponse {
  orderSupplierMetadata: IDashboardOrderSupplierMetadata
  orderTcMetadata: IDashboardOrderTcMetadata
  totalTrainingCenter: number
}

interface IDashboardOrderSupplierMetadata {
  totalUnpaid: number
  totalPaid: number
  totalComplete: number
  totalIncomplete: number
}

interface IDashboardOrderTcMetadata {
  totalPending: number
  totalReject: number
  totalUnpaid: number
  totalPaid: number
  totalComplete: number
  totalIncomplete: number
}
