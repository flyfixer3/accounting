// @ts-nocheck
import { toQueryString } from 'src/helpers/request.helper'
import { IDataResponse, IListDataResponse } from 'src/models/request.model'
import {
  ITeacherCreateRequestPayload,
  ITeacherData,
  ITeacherDetailPayload,
  ITeacherDetailResponse,
  ITeacherListPayload,
  ITeacherMetaResponse,
  ITeacherRequestResponse,
} from 'src/models/teacher.model'
import { BASE_URL } from './api.service'
import axios from 'axios'

export const fetchTeacherList = async (queryParams?: ITeacherListPayload) => {
  return await axios.get<IListDataResponse<ITeacherData, ITeacherMetaResponse>>(
    `${BASE_URL}/teachers${toQueryString(queryParams)}`,
  )
}

export const requestCreateTeacher = async (
  payload?: ITeacherCreateRequestPayload,
) => {
  return await axios.post<ITeacherRequestResponse>(
    `${BASE_URL}/teachers/create`,
    payload,
  )
}

export const fetchTeacherDetail = async (
  queryParams?: ITeacherDetailPayload,
) => {
  return await axios.get<IDataResponse<ITeacherDetailResponse>>(
    `${BASE_URL}/teachers/${queryParams?.id}`,
  )
}

export const requestUpdateTeacher = async (
  id: string,
  payload?: ITeacherCreateRequestPayload,
) => {
  return await axios.put<ITeacherRequestResponse>(
    `${BASE_URL}/teachers/${id}`,
    payload,
  )
}
