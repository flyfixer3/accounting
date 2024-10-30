// @ts-nocheck
import queryString from 'query-string'

export function toQueryString(queryStringObject?: { [key: string]: any }) {
  return queryStringObject
    ? `?${queryString.stringify(queryStringObject, { arrayFormat: 'bracket' })}`
    : ''
}
