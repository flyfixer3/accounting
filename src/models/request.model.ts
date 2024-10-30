// @ts-nocheck
export interface IListPaginationData {
  page: number
  totalPage: number
  limit: number
}

export interface IListDataResponse<T, X = {}> {
  data: T[]
  meta?: Partial<X>
  pagination?: IListPaginationData
}

export interface IDataResponse<T> {
  data: T
}

export interface IDetailPayload {
  id: string
}
