// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { ISchoolFormData } from 'src/models/school.model'
import { IRequestResponse } from 'src/models/student-registration.model'
import { requestCreateSchool } from 'src/services/school.service'
import { AxiosError, AxiosResponse } from 'axios'
import { useCallback, useState } from 'react'
import useToggle from 'src/hooks/useToggle'
import { FormInstance } from 'antd'

const useModalAddSchoolController = () => {
  const { notify } = useApp()
  const [inputError, setInputError] = useState('')
  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const _onSubmit = useCallback(
    async (payload: ISchoolFormData, form: FormInstance) => {
      setIsSubmitted()

      try {
        const res: AxiosResponse<IRequestResponse> =
          await requestCreateSchool(payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()
        form.resetFields()
      } catch (err) {
        const { status }: AxiosError = err?.response
        const { message }: AxiosError = err?.response?.data

        if (status === 422 || status === 400) {
          setInputError(message)
        } else {
          notify.error({
            message: 'Error',
            description: message,
            duration: 5,
          })
        }
        setIsSubmitted()
      }
    },
    [],
  )

  return {
    isSubmitted,
    inputError,
    onSubmit: _onSubmit,
  }
}
export default useModalAddSchoolController
