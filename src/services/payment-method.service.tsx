// @ts-nocheck
import {
  IBank,
  IPaymentMethodListResponse,
} from 'src/models/payment-method.model'
import axios from 'axios'
import { BASE_URL } from './api.service'
import { IDataResponse } from 'src/models/request.model'

export const fetchPaymentMethodList = async () => {
  return await axios.get<IDataResponse<IPaymentMethodListResponse>>(
    `${BASE_URL}/payment-methods`,
  )
}

export const fetchBankList = async () => {
  return await axios.get<IDataResponse<IBank[]>>(`${BASE_URL}/banks`)
}

export const fetchIBOPaymentMethodList = async () => {
  return await axios.get<IDataResponse<IPaymentMethodListResponse>>(
    `${BASE_URL}/ibo/payment-methods`,
  )
}

export const fetchIBOBankList = async () => {
  return await axios.get<IDataResponse<IBank[]>>(`${BASE_URL}/ibo/banks`)
}
