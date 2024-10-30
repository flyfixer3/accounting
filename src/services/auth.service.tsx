// @ts-nocheck
import axios from 'axios'
import { BASE_URL } from './api.service'
import {
  ILoginPayloadRequest,
  ILoginResponse,
  ILogoutResponse,
} from 'src/models/login.model'
import {
  IChangePasswordRequestPayload,
  IChangePasswordRequestResponse,
} from 'src/models/auth.model'

export const doRequestLogin = async (payload?: ILoginPayloadRequest) => {
  return await axios.post<ILoginResponse>(`${BASE_URL}/masuk`, payload)
}

export const doRequestLogout = async () => {
  return await axios.post<ILogoutResponse>(`${BASE_URL}/logout`)
}

export const doRequestChangePassword = async (
  payload: IChangePasswordRequestPayload,
) => {
  return await axios.post<IChangePasswordRequestResponse>(
    `${BASE_URL}/change-password`,
    payload,
  )
}
