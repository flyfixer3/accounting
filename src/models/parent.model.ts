// @ts-nocheck
export interface IParentSelectResponse {
  id: number
  name: string
}

export interface IParentSelect {
  label: string
  value: string
}

export interface IParentDetailPayload {
  id: number
}

export interface IParentDetailResponse {
  id: number
  parentName: string
  parentEmail?: string
  parentPhoneNumber: string
  parentOccupation?: string
}
