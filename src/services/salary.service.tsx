// @ts-nocheck
import {
  ISalaryListPayload,
  ISalaryMetaResponse,
  ISalaryUpdatePaymentRequestPayload,
} from '@src/models/salary.model'
import { ITeacherData } from '@src/models/teacher.model'
import axios from 'axios'
import { toQueryString } from 'src/helpers/request.helper'
import { IListDataResponse } from 'src/models/request.model'
import { BASE_URL } from './api.service'

export const fetchSalaryList = async (queryParams?: ISalaryListPayload) => {
  return await axios.get<IListDataResponse<ITeacherData, ISalaryMetaResponse>>(
    `${BASE_URL}/salaries${toQueryString(queryParams)}`,
  )
}

export const generatePayslip = async ({
  ids,
  month,
  year,
  baseSalariesOverrides,
}: {
  ids: number[]
  month: number
  year: number
  baseSalariesOverrides?: { teacherNumber: number; baseSalary: number }[]
}) => {
  return await axios.post(`${BASE_URL}/salaries/payslip`, {
    teacher_numbers: ids,
    month,
    year,
    baseSalariesOverrides,
  })
}

export const updateSalaryPayment = async ({
  salaryId,
  payload,
}: {
  salaryId: number
  payload: ISalaryUpdatePaymentRequestPayload
}) => {
  return await axios.post(`${BASE_URL}/salaries/${salaryId}`, payload)
}
