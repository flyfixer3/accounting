// @ts-nocheck
import { IDataResponse } from 'src/models/request.model'
import {
  IStudentClassDetailResponse,
  IStudentDetailPayload,
  IStudentDetailResponse,
  IStudentFormPayload,
  IStudentRequestResponse,
  IStudentSelectResponse,
} from 'src/models/student.model'
import { BASE_URL } from './api.service'
import axios from 'axios'
import { toQueryString } from 'src/helpers/request.helper'

export const fetchStudentSelectList = async (
  search: string,
  abortController: AbortController,
) => {
  return await axios.get<IDataResponse<IStudentSelectResponse>>(
    `${BASE_URL}/students/autocomplete?search=${search}`,
    { signal: abortController.signal },
  )
}

export const fetchStudentDetail = async (
  queryParams?: IStudentDetailPayload,
) => {
  return await axios.get<IDataResponse<IStudentDetailResponse>>(
    `${BASE_URL}/students/${queryParams?.id}`,
  )
}

export const fetchStudentClassDetail = async (
  id?: number,
  queryParams?: { courseId: number },
) => {
  return await axios.get<IDataResponse<IStudentClassDetailResponse[]>>(
    `${BASE_URL}/students/class-details/${id}${toQueryString(queryParams)}`,
  )
}

export const requestUpdateStudent = async (
  id: string,
  payload?: IStudentFormPayload,
) => {
  return await axios.put<IStudentRequestResponse>(
    `${BASE_URL}/students/update/${id}`,
    payload,
  )
}
