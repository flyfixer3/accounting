// @ts-nocheck
export interface IPaymentMethodType {
  id: number
  paymentTypeNumber: number
  paymentTypeName: string
}

export interface IPaymentMethod {
  id: number
  paymentMethodNumber: number
  paymentMethodName: string
  paymentType: IPaymentMethodType
}

export interface IPaymentMethodListResponse extends IPaymentMethod {}

export interface IBank {
  id: number
  bankNumber: string
  bankName: string
  createdAt: string
  updatedAt: string
}
