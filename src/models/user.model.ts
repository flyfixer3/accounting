// @ts-nocheck
import { message } from 'antd'
export interface IUser {
  id: number
  number: string
  name: string
  email: string
  phoneNumber: string
  address: string
  owner: string
}

export interface IUserTrainingCenter extends IUser {}

export interface IUserIBO extends IUser {
  iboNumber: String
}

export interface ILoggedInUser {
  user: any
  role: string
  ibo?: IUserIBO
  trainingCenter?: IUserTrainingCenter
}

export interface IUserTrainingCenterData {
  id: number
  trainingCenterNumber: string
  trainingCenterName: string
  trainingCenterEmail: string
  trainingCenterPhoneNumber: string
  trainingCenterAddress: string
  trainingCenterOwnerName: string
  createdAt: string
  updatedAt: string
}

export interface IUserTrainingCenterMetaResponse {
  currentTotalData: number
}

export interface IUserTrainingCenterRequestPayload {
  loginUsername?: string
  loginPassword?: string
  loginConfirmPassword: string
  trainingCenterNumber: string
  trainingCenterName: string
  trainingCenterEmail: string
  trainingCenterPhoneNumber: string
  trainingCenterAddress: string
  trainingCenterOwnerName: string
}

export interface IUserTrainingCenterRequestResponse {
  message: string
  data?: IUserTrainingCenterData
}

export interface IUserTrainingCenterChangePasswordRequestPayload {
  newPassword: string
  confirmPassword: string
}

export interface IUserTrainingCenterChangePasswordRequestResponse {
  message: string
}

export interface IUserTrainingCenterUserListData {
  id: number
  username: string
  createdAt: string
  updatedAt: string
}
