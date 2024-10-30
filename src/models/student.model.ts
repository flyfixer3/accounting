// @ts-nocheck
import { Dayjs } from 'dayjs'
import { IBookData } from './books.model'
import { IClassDetailResponse } from './class.model'
import { ICourseData, ICourseLevelData } from './course.model'

export type StudentGenderType = 'M' | 'F'
export interface IStudentSelectResponse {
  id: number
  name: string
}

export interface IStudentSelect {
  label: string
  value: string
}

export interface IStudentDetailPayload {
  id: number
}

export interface IStudentDetailResponse {
  id: number
  studentName: string
  studentEmail: string
  studentPhoneNumber: string
  gender: StudentGenderType
  studentPlaceOfBirth: string
  studentDateOfBirth: string
  religion: {
    id: number
    name: string
  }
  studentAddress: string
  studentCity: string
  school: {
    id: number
    schoolName: string
  }
}

export interface IStudentClassDetailResponse {
  id: number
  courseClass: IClassDetailResponse
  createdAt: string
  updatedAt: string
}

export interface IStudentFormData {
  studentId?: number
  studentName: string
  studentEmail: string
  studentPhoneNumber: string
  studentGender: StudentGenderType
  studentPlaceOfBirth: string
  studentDateOfBirth: Dayjs
  studentReligion: number
  studentAddress: string
  studentCity: string
  studentSchool: number
}

export interface IStudentFormPayload {
  studentId?: number
  studentName: string
  studentEmail: string
  studentPhoneNumber?: string
  gender: StudentGenderType
  studentPlaceOfBirth: string
  studentDateOfBirth: string
  religionId: number
  studentAddress: string
  studentCity: string
  schoolId: number
}

export interface IStudentRequestResponse {
  message: string
  data?: IStudentDetailResponse
}
