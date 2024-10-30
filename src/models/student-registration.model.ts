// @ts-nocheck
import { Dayjs } from 'dayjs'
import { ICourseData, ICourseLevelData } from './course.model'
import { IStudentDetailResponse, StudentGenderType } from './student.model'
import { IClassData } from './class.model'
import { IBookData } from './books.model'

export interface IStudentRegistrationListData {
  id: number
  studentRegistrationNumber: string
  student: IStudentDetailResponse
  studentCourseDetail: {
    course: {
      id: number
      courseNumber: number
      courseName: string
    }
    courseLevel: {
      id: number
      courseLevelName: string
    }
    book: {
      id: number
      bookNumber: string
      bookName: string
    }
  }
}

export interface IStudentRegistrationMetaResponse {
  totalData: number
  totalActiveData: number
  totalInactiveData: number
  currentTotalData: number
}
export interface IStudentRegistrationStudentFormData {
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

export interface IStudentRegistrationParentFormPayload {
  parentId?: number
  parentName?: string
  parentPhone?: string
  parentEmail?: string
  parentOccupation?: string
}

export interface IStudentRegistrationCourseDetailFormData {
  courseId: number
  courseLevelId: number
  bookId: number
  selectedCourseObj?: ICourseData
  selectedCourseLevelObj?: ICourseLevelData
  selectedBookObj?: IBookData
}

export interface IStudentRegistrationCourseDetailPayload {
  courseId: number
  courseLevelId: number
  bookId: number
}

export interface IStudentRegistrationCourseClassFormData {
  courseId: number
  courseLevelId: number
  courseClassIdList: number[]
  courseClassIdObj?: IClassData[]
}

export interface IStudentRegistrationCourseClassPayload {
  courseId: number
  courseLevelId: number
  courseClassIdList: number[]
}

export interface IStudentFormPayload {
  studentId?: number
  studentName?: string
  studentEmail?: string
  studentPhoneNumber?: string
  gender?: StudentGenderType
  studentPlaceOfBirth?: string
  studentDateOfBirth?: Dayjs
  religionId?: number
  studentAddress?: string
  studentCity?: string
  schoolId?: number
}

export interface IStudentRequestPayload {
  studentId?: number
  studentName?: string
  studentEmail?: string
  studentPhoneNumber?: string
  gender?: StudentGenderType
  studentPlaceOfBirth?: string
  studentDateOfBirth?: string
  religionId?: number
  studentAddress?: string
  studentCity?: string
  schoolId?: number
}

export interface IRequestResponse {
  message: string
}

export interface IStudentRegistrationSubmitPayload {
  studentData: IStudentRequestPayload
  parentData: IStudentRegistrationParentFormPayload
  courseDetailData: IStudentRegistrationCourseDetailPayload
  courseClassData: IStudentRegistrationCourseClassPayload
}

export interface IStudentRegistrationDetailPayload {
  id: string
}

export interface IStudentRegistrationDetailResponse {
  id: number
  studentRegistrationNumber: string
  courseVoucher: {
    id: number
    courseVoucherNumber: string
    courseVoucherBundle: {
      id: number
      courseVoucherBundleNumber: string
    }
  }
  studentCourseDetail: {
    id: number
    course: ICourseData
    courseLevel: ICourseLevelData
    book: IBookData
  }
  student: IStudentDetailResponse
  parent: IStudentRegistrationParentFormPayload
  invoice: {
    id: null
    invoiceNumber: string
    invoiceStatus: string
  }
}

export interface IStudentCourseLevelUpRequestPayload {
  courseLevelId: number
}

export interface IStudentCourseLevelUpRequestResponse {
  message: string
}
