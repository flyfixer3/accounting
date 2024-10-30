// @ts-nocheck
export type PageData<Data> = {
  current_page: number
  data: Data[]
  first_page_url: string
  from: string | null
  last_page: number
  last_page_url: string | null
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: string | null
  total: number
}
