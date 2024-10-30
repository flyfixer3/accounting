// @ts-nocheck
import { IUserIBO, IUserTrainingCenter } from './user.model'

export interface ILoginPayloadRequest {
  username: string
  password: string
}

export interface ILoginResponse {
  data: {
    user: string
    token: string
    role: string
    trainingCenter?: IUserTrainingCenter
    ibo?: IUserIBO
  }
}

export interface ILogoutResponse {
  message: string
}
