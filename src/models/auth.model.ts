// @ts-nocheck
import { NotificationInstance } from 'antd/es/notification/interface'

export interface IAuthData {
  doLogin: () => void
  doLogout: () => void
  user?: any
  token?: String
  getUserData: any
  isAuthenticated: boolean
  getUserRole: string
  isModalChangePasswordVisible?: boolean
  handleModalChangePasswordVisibility?: () => void
}

export interface IAuthProviderProps {
  children?: any
}

export interface IChangePasswordRequestPayload {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export interface IChangePasswordRequestResponse {
  message: string
}
