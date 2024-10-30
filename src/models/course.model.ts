// @ts-nocheck
import { ReactNode } from 'react'

export interface ICourseData {
  id: number
  courseNumber: string
  courseName: string
  courseLevelList?: string
  courseRegistrationFee: string
  status: string
}

export interface ICourseMetaResponse {
  totalData: number
  totalActiveData: number
  totalInactiveData: number
  currentTotalData: number
}

export interface ICourseListPayload {
  page: number
  limit: number
  status?: string
  search?: string
}

export interface ICourseDetailResponse {
  courseNumber: string
  courseName: string
  courseRegistrationFee: string
  status: string
  createdAt: string
  updatedAt?: string
  deletedAt?: string
}

export interface ICourseDetailPayload {
  id: string
}

export interface ICourseLevelData {
  id: number
  courseLevelId: number
  courseLevelName: string
  courseLevelMonthlyFee: string
  status: string
}

export interface ICourseTableData extends ICourseData, ICourseLevelData {
  action: ReactNode
  createdAt: string
  updatedAt?: string
  deletedAt?: string
}

export interface ICourseRequestResponse {
  message: string
}

export interface ICourseLevelUpListResponse {
  id: number
  courseLevelName: string
  courseLevelMonthlyFee: string
  createdAt: string
  updatedAt: string
  status: string
}

export interface ICourseLevelUpHistoryResponse {
  id: number
  course: ICourseData
  courseLevel: ICourseLevelData
  score?: number
  status: string
  createdAt: string
  updatedAt: string
}

// IBO
export interface ICourseIBORequestPayload {
  courseNumber: string
  courseName: string
  courseRegistrationFee: string
  courseVoucherPricePerBundle?: string
}

export interface ICourseLevelIBORequestPayload {
  id: number
  courseLevelName: string
  courseLevelMonthlyFee: string
}
