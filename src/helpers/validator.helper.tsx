// @ts-nocheck
import { Rule } from 'antd/es/form'
import moment, { Moment } from 'moment'

export const validatePhoneNumber: Rule = {
  validator(_, value) {
    const phoneNumberRegex = /^(0)\d{9,}$/ // Regular expression to match '0' or '+62' followed by at least 9 digits
    if (!value || value.match(phoneNumberRegex)) {
      return Promise.resolve() // Pass validation
    }
    return Promise.reject(new Error('Phone number must start with 0')) // Fail validation
  },
}
