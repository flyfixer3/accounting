// @ts-nocheck
import { ISchoolFormData } from 'src/models/school.model'
import axios from 'axios'
import { BASE_URL } from './api.service'
import { ISchoolRequestResponse } from '@src/models/school.model'

export const requestCreateSchool = async (payload?: ISchoolFormData) => {
  return await axios.post<ISchoolRequestResponse>(
    `${BASE_URL}/schools/create`,
    payload,
  )
}
