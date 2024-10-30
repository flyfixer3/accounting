// @ts-nocheck
import axios from 'axios'
import {
  IReligionResponse,
  ITeacherEduResponse,
} from 'src/models/general.model'
import { IDataResponse } from 'src/models/request.model'
import { ISchoolRequestResponse } from 'src/models/school.model'

export const BASE_URL = process.env.REACT_APP_BASE_URL

// API Error Handler
export const errorHandler = (error: { response: any; message: string }) => {
  const message = ((error.response || {}).data || {}).message
  return { message }
}

export const setCSRFCookie = async (queryParams?: any) => {
  try {
    const res = await axios.get(`${BASE_URL}/sanctum/csrf-cookie`)
    return res
  } catch (e) {
    const msg = errorHandler
    return msg
  }
}

export const fetchReligionList = async () => {
  return await axios.get<IDataResponse<IReligionResponse>>(
    `${BASE_URL}/religions`,
  )
}

export const fetchTeacherEduList = async () => {
  return await axios.get<IDataResponse<ITeacherEduResponse>>(
    `${BASE_URL}/teacher-educations`,
  )
}

export const fetchSchoolSelectList = async () => {
  return await axios.get<IDataResponse<ISchoolRequestResponse>>(
    `${BASE_URL}/schools/autocomplete`,
  )
}
