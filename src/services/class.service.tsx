// @ts-nocheck
import {
  IDataResponse,
  IDetailPayload,
  IListDataResponse,
} from 'src/models/request.model'
import { BASE_URL } from './api.service'
import axios from 'axios'
import { toQueryString } from 'src/helpers/request.helper'
import {
  IClassData,
  IClassDetailResponse,
  IClassMetaResponse,
  IClassRequestPayload,
  IClassRequestResponse,
} from 'src/models/class.model'
import { IQueryParams } from 'src/models/general.model'

export const fetchClassList = async (queryParams?: IQueryParams) => {
  return await axios.get<IListDataResponse<IClassData, IClassMetaResponse>>(
    `${BASE_URL}/classes${toQueryString(queryParams)}`,
  )
}

export const fetchClassDetail = async (queryParams?: IDetailPayload) => {
  return await axios.get<IDataResponse<IClassDetailResponse>>(
    `${BASE_URL}/classes/${queryParams?.id}`,
  )
}

export const requestCreateClass = async (payload?: IClassRequestPayload) => {
  return await axios.post<IClassRequestResponse>(
    `${BASE_URL}/classes/create`,
    payload,
  )
}
export const requestUpdateClass = async (
  id: string,
  payload?: IClassRequestPayload,
) => {
  return await axios.put<IClassRequestResponse>(
    `${BASE_URL}/classes/${id}`,
    payload,
  )
}

export const fetchClassListByCourseLevel = async (
  courseLevelId: number,
  queryParams?: IQueryParams,
) => {
  return await axios.get<IListDataResponse<IClassData, IClassMetaResponse>>(
    `${BASE_URL}/classes/course-level/${courseLevelId}${toQueryString(
      queryParams,
    )}`,
  )
}
