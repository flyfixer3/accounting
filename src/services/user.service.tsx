// @ts-nocheck
import { IDataResponse, IListDataResponse } from 'src/models/request.model'
import {
  IUserTrainingCenterChangePasswordRequestPayload,
  IUserTrainingCenterChangePasswordRequestResponse,
  IUserTrainingCenterData,
  IUserTrainingCenterMetaResponse,
  IUserTrainingCenterRequestPayload,
  IUserTrainingCenterRequestResponse,
  IUserTrainingCenterUserListData,
} from 'src/models/user.model'
import axios from 'axios'
import { BASE_URL } from './api.service'
import { toQueryString } from 'src/helpers/request.helper'
import { IQueryParams } from 'src/models/general.model'

export const fetchTrainingCenterUserList = async (
  queryParams: IQueryParams,
) => {
  return await axios.get<
    IListDataResponse<IUserTrainingCenterData, IUserTrainingCenterMetaResponse>
  >(`${BASE_URL}/ibo/training-centers${toQueryString(queryParams)}`)
}

export const fetchTrainingCenterUserDetail = async (id: string) => {
  return await axios.get<IDataResponse<IUserTrainingCenterData>>(
    `${BASE_URL}/ibo/training-centers/detail/${id}`,
  )
}

export const requestCreateTrainingCenterUser = async (
  payload?: IUserTrainingCenterRequestPayload,
) => {
  return await axios.post<IUserTrainingCenterRequestResponse>(
    `${BASE_URL}/ibo/training-centers/create`,
    payload,
  )
}

export const requestUpdateTrainingCenterUser = async (
  id: string,
  payload?: IUserTrainingCenterRequestPayload,
) => {
  return await axios.put<IUserTrainingCenterRequestResponse>(
    `${BASE_URL}/ibo/training-centers/update/${id}`,
    payload,
  )
}

export const fetchTrainingCenterUsersList = async (
  trainingCenterNumber: string,
  queryParams: IQueryParams,
) => {
  return await axios.get<
    IListDataResponse<
      IUserTrainingCenterUserListData,
      IUserTrainingCenterMetaResponse
    >
  >(
    `${BASE_URL}/ibo/training-centers/user-list/${trainingCenterNumber}${toQueryString(
      queryParams,
    )}`,
  )
}

export const requestUpdateTrainingCenterUserPassword = async (
  userId: number,
  payload?: IUserTrainingCenterChangePasswordRequestPayload,
) => {
  return await axios.post<IUserTrainingCenterChangePasswordRequestResponse>(
    `${BASE_URL}/ibo/training-centers/user/${userId}`,
    payload,
  )
}
