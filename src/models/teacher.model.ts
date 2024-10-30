// @ts-nocheck
import { Dayjs } from 'dayjs'
import { ReactNode } from 'react'
import { ISalaryData } from './salary.model'

export type TeacherGenderType = 'M' | 'F'

export interface ITeacherData {
  id: number
  teacherNumber: string
  teacherName: string
  teacherNickname: string
  teacherEducation: number
  teacherPhoneNumber: string
  teacherEmail: string
  teacherStatus: string
  gender: TeacherGenderType
  teacherPlaceOfBirth: string
  teacherDateOfBirth: Dayjs
  teacherJoinDate: Dayjs
  teacherAddress: string
  religion: number
  courseId: string
  courseLevelId: number
  baseSalary: string
}

export interface ITeacherTableData {
  teacherNumber: string
  teacherName: string
  teacherNickname: string
  teacherPhoneNumber: string
  teacherEmail: string
  teacherStatus: string
  gender: TeacherGenderType
  teacherPlaceOfBirth: string
  teacherDateOfBirth: Dayjs
  teacherJoinDate: Dayjs
  teacherAddress: string
  religion: number
  baseSalary: string
  teacherCourse: {
    courseName: string
    courseLevelName: string
  }
  teacherEducation: {
    id: number
    name: string
  }
  teacherSalaries: ISalaryData[]
  action: ReactNode
  createdAt: string
  updatedAt?: string
  deletedAt?: string
}

export interface ITeacherMetaResponse {
  totalData: number
  totalActiveData: number
  totalInactiveData: number
  currentTotalData: number
  totalResignData: number
}

export interface ITeacherListPayload {
  page: number
  limit: number
  status?: string
  search?: string
  totalData?: number
  courseId?: number | undefined
}

export interface ITeacherRequestResponse {
  message: string
  data?: ITeacherDetailResponse
}

export interface ITeacherCreateRequestPayload {
  teacherName: string
  teacherNickname: string
  gender: TeacherGenderType
  teacherAddress: string
  teacherPlaceOfBirth: string
  teacherDateOfBirth: string
  religionId: number
  teacherJoinDate: string
  teacherEducationId: number
  teacherPhoneNumber: string
  teacherEmail: string
  teacherStatus: string
  courseLevelId: number
  baseSalary: string
}

export interface ITeacherDetailPayload {
  id: string
}

export interface ITeacherDetailResponse {
  teacherNumber: string
  teacherName: string
  teacherNickname: string
  gender: string
  teacherAddress: string
  teacherPlaceOfBirth: string
  teacherDateOfBirth: string
  religion: {
    id: number
    name: string
  }
  teacherJoinDate: string
  teacherEducation: {
    id: number
    name: string
  }
  teacherPhoneNumber: string
  teacherEmail: string
  teacherStatus: string
  teacherCourseLevel: {
    id: number
    courseNumber: string
    courseName: string
    courseLevelId: number
    courseLevelName: string
  }
  baseSalary: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
}
