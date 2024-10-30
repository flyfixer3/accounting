// @ts-nocheck
type TeacherEducation = {
  sd: 'SD'
  smp: 'SMP'
  sma: 'SMA/SMK'
  d3: 'D3'
  s1: 'S1'
}

export interface IFile {
  file: File
  url: string | undefined
}
export interface ISelectData {
  value: number | string
  label: string
}

export interface IReligionResponse {
  id: number
  name: string
}

export interface ITeacherEduResponse {
  id: number
  teacherEducation: TeacherEducation
  createdAt: string
  updatedAt: string
  deletedAt: string
  status: string
}

export interface IRequestErrorData {
  message: string
  errors: any
}

export interface IQueryParams {
  page: number
  limit: number
  search?: string
  month?:number
  year?:number
  status?: string
  filter_day?: string
  totalData: number
}
