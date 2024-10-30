// @ts-nocheck
import {
  IParentDetailPayload,
  IParentDetailResponse,
  IParentSelectResponse,
} from 'src/models/parent.model'
import { IDataResponse } from 'src/models/request.model'
import axios from 'axios'
import { BASE_URL } from './api.service'

export const fetchParentSelectList = async (
  search: string,
  abortController: AbortController,
) => {
  return await axios.get<IDataResponse<IParentSelectResponse>>(
    `${BASE_URL}/parents/autocomplete?search=${search}`,
    { signal: abortController.signal },
  )
}

export const fetchParentDetail = async (queryParams?: IParentDetailPayload) => {
  return await axios.get<IDataResponse<IParentDetailResponse>>(
    `${BASE_URL}/parents/${queryParams?.id}`,
  )
}
