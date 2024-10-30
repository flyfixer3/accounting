// @ts-nocheck
// TC

import {
  IDashboardIBOMetaResponse,
  IDashboardMetaResponse,
} from '@src/models/dashboard.model'
import { IDataResponse } from '@src/models/request.model'
import axios from 'axios'
import { BASE_URL } from './api.service'

// TC

export const fetchDashboardMetaData = async () => {
  return await axios.get<IDataResponse<IDashboardMetaResponse>>(
    `${BASE_URL}/metadata/dashboard`,
  )
}

// IBO

export const fetchDashboardIBOMetaData = async () => {
  return await axios.get<IDataResponse<IDashboardIBOMetaResponse>>(
    `${BASE_URL}/ibo/metadata/dashboard`,
  )
}
