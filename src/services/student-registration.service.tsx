// @ts-nocheck
import { IDataResponse, IListDataResponse } from 'src/models/request.model'
import axios from 'axios'
import {
  IStudentRegistrationListData,
  IStudentRegistrationMetaResponse,
  IStudentFormPayload,
  IRequestResponse,
  IStudentRegistrationParentFormPayload,
  IStudentRegistrationCourseDetailFormData,
  IStudentRegistrationCourseClassPayload,
  IStudentRegistrationSubmitPayload,
  IStudentRegistrationDetailResponse,
  IStudentRegistrationDetailPayload,
  IStudentRequestPayload,
} from 'src/models/student-registration.model'
import { BASE_URL } from './api.service'
import { toQueryString } from 'src/helpers/request.helper'
import { IQueryParams } from 'src/models/general.model'

export const fetchStudentRegistList = async (queryParams?: IQueryParams) => {
  return await axios.get<
    IListDataResponse<
      IStudentRegistrationListData,
      IStudentRegistrationMetaResponse
    >
  >(`${BASE_URL}/student-registrations${toQueryString(queryParams)}`)
}

export const fetchStudentRegistDetail = async (
  payload?: IStudentRegistrationDetailPayload,
) => {
  return await axios.get<IDataResponse<IStudentRegistrationDetailResponse>>(
    `${BASE_URL}/student-registrations/${payload.id}`,
  )
}

export const requestValidateStudentForm = async (
  payload?: IStudentRequestPayload,
) => {
  return await axios.post<IRequestResponse>(
    `${BASE_URL}/student-registrations/validate/student-data`,
    payload,
  )
}

export const requestValidateParentForm = async (
  payload?: IStudentRegistrationParentFormPayload,
) => {
  return await axios.post<IRequestResponse>(
    `${BASE_URL}/student-registrations/validate/parent-data`,
    payload,
  )
}

export const requestValidateCourseDetailForm = async (
  payload?: IStudentRegistrationCourseDetailFormData,
) => {
  return await axios.post<IRequestResponse>(
    `${BASE_URL}/student-registrations/validate/course-detail-data`,
    payload,
  )
}

export const requestValidateCourseClassForm = async (
  payload?: IStudentRegistrationCourseClassPayload,
) => {
  return await axios.post<IRequestResponse>(
    `${BASE_URL}/student-registrations/validate/course-class-data`,
    payload,
  )
}

export const requestSubmitStudentRegistration = async (
  payload: IStudentRegistrationSubmitPayload,
) => {
  return await axios.post<IRequestResponse>(
    `${BASE_URL}/student-registrations/submit`,
    payload,
  )
}

export const requestSubmitUpdateStudentRegistClass = async (
  studentId: number,
  payload: IStudentRegistrationCourseClassPayload,
) => {
  return await axios.post<IRequestResponse>(
    `${BASE_URL}/students/class-details/${studentId}`,
    payload,
  )
}
