// @ts-nocheck
import { Dayjs } from 'dayjs'
import { ICourseData, ICourseLevelData } from './course.model'
import { ITeacherData } from './teacher.model'

export interface IClassData {
  id: number
  className: string
  classDay: string
  classStartTime: string
  classEndTime: string
  classTeacher: ITeacherData
  classCourse: ICourseData
  classCourseLevel: ICourseLevelData
  status: string
}

export interface IClassMetaResponse {
  totalData: number
  totalActiveData: number
  totalInactiveData: number
  currentTotalData: number
}

export interface IClassDetailResponse extends IClassData {
  createdAt: string
  updatedAt: string
  deletedAt: string
  totalStudent: number
}

export interface IClassRequestPayload {
  className: string
  classDay: string
  classStartTime: string
  classEndTime: string
  teacherId: number
  courseId: number
  courseLevelId: number
  status: string
}

export interface IClassRequestResponse {
  message: string
  data?: IClassDetailResponse
}

export interface IClassFormData {
  id: number
  className: string
  classDay: string
  classStartTime: Dayjs
  classEndTime: Dayjs
  classTeacher: number
  classCourse: number
  classCourseLevel: number
  status: string
}
