// @ts-nocheck
import {
  ICourseData,
  ICourseRequestResponse,
  ICourseDetailPayload,
  ICourseDetailResponse,
  ICourseLevelData,
  ICourseListPayload,
  ICourseMetaResponse,
  ICourseIBORequestPayload,
  ICourseLevelIBORequestPayload,
  ICourseLevelUpListResponse,
  ICourseLevelUpHistoryResponse,
} from 'src/models/course.model'
import { IDataResponse, IListDataResponse } from 'src/models/request.model'
import axios from 'axios'
import { toQueryString } from 'src/helpers/request.helper'
import { BASE_URL } from './api.service'
import { IQueryParams } from 'src/models/general.model'
import { IStudentCourseLevelUpRequestPayload } from '@src/models/student-registration.model'

export const fetchCourseList = async (queryParams?: IQueryParams) => {
  return await axios.get<IListDataResponse<ICourseData, ICourseMetaResponse>>(
    `${BASE_URL}/courses${toQueryString(queryParams)}`,
  )
}

export const fetchActiveCourseList = async (
  queryParams?: ICourseListPayload,
) => {
  return await axios.get<IListDataResponse<ICourseData, ICourseMetaResponse>>(
    `${BASE_URL}/courses/active${toQueryString(queryParams)}`,
  )
}

export const fetchCourseDetail = async (queryParams?: ICourseDetailPayload) => {
  return await axios.get<IDataResponse<ICourseDetailResponse>>(
    `${BASE_URL}/courses/${queryParams?.id}`,
  )
}

export const fetchCourseLevelList = async (
  id: string | number,
  queryParams?: IQueryParams,
) => {
  return await axios.get<
    IListDataResponse<ICourseLevelData, ICourseMetaResponse>
  >(`${BASE_URL}/course-levels/${id}${toQueryString(queryParams)}`)
}

export const fetchCourseLevelActive = async (
  id: string | number,
  queryParams?: ICourseListPayload,
) => {
  return await axios.get<
    IListDataResponse<ICourseLevelData, ICourseMetaResponse>
  >(`${BASE_URL}/course-levels/${id}/active${toQueryString(queryParams)}`)
}

export const fetchCourseLevelUpList = async (
  studentId: number,
  courseId: number,
) => {
  return await axios.get<IDataResponse<ICourseLevelUpListResponse>>(
    `${BASE_URL}/student-course-details/level-up/${studentId}/course/${courseId}/course-level-list`,
  )
}

export const requestCourseLevelUp = async (
  studentId: number,
  courseId: number,
  payload: IStudentCourseLevelUpRequestPayload,
) => {
  return await axios.post<ICourseRequestResponse>(
    `${BASE_URL}/student-course-details/level-up/${studentId}/course/${courseId}`,
    payload,
  )
}

export const fetchCourseLevelUpHistory = async (
  studentId: number,
  courseId: number,
) => {
  return await axios.get<IDataResponse<ICourseLevelUpHistoryResponse[]>>(
    `${BASE_URL}/student-course-details/history/${studentId}/course/${courseId}`,
  )
}

// IBO

export const fetchIBOCourseList = async (queryParams?: IQueryParams) => {
  return await axios.get<IListDataResponse<ICourseData, ICourseMetaResponse>>(
    `${BASE_URL}/ibo/courses${toQueryString(queryParams)}`,
  )
}

export const fetchIBOCourseDetail = async (
  queryParams?: ICourseDetailPayload,
) => {
  return await axios.get<IDataResponse<ICourseDetailResponse>>(
    `${BASE_URL}/ibo/courses/${queryParams?.id}`,
  )
}

export const requestIBOCreateCourse = async (
  payload?: ICourseIBORequestPayload,
) => {
  return await axios.post<ICourseRequestResponse>(
    `${BASE_URL}/ibo/courses/create`,
    payload,
  )
}

export const requestIBOUpdateCourse = async (
  courseNumber: string,
  payload?: ICourseIBORequestPayload,
) => {
  return await axios.put<ICourseRequestResponse>(
    `${BASE_URL}/ibo/courses/update/${courseNumber}`,
    payload,
  )
}

export const fetchIBOCourseLevelList = async (
  courseNumber: string,
  queryParams?: IQueryParams,
) => {
  return await axios.get<
    IListDataResponse<ICourseLevelData, ICourseMetaResponse>
  >(
    `${BASE_URL}/ibo/course-levels/${courseNumber}${toQueryString(
      queryParams,
    )}`,
  )
}

export const requestIBOUpdateCourseLevel = async (
  courseLevelId: number,
  payload?: ICourseLevelIBORequestPayload,
) => {
  return await axios.put<ICourseRequestResponse>(
    `${BASE_URL}/ibo/course-levels/update/${courseLevelId}`,
    payload,
  )
}

export const requestIBOCreateCourseLevel = async (
  courseNumber: string,
  payload?: ICourseLevelIBORequestPayload,
) => {
  return await axios.post<ICourseRequestResponse>(
    `${BASE_URL}/ibo/course-levels/${courseNumber}/create`,
    payload,
  )
}

export const fetchIBOCourseLevelActive = async (
  id: string | number,
  queryParams?: ICourseListPayload,
) => {
  return await axios.get<
    IListDataResponse<ICourseLevelData, ICourseMetaResponse>
  >(`${BASE_URL}/ibo/course-levels/${id}/active${toQueryString(queryParams)}`)
}
