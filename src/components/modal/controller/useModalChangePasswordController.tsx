// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { AxiosError, AxiosResponse } from 'axios'
import { useCallback, useState } from 'react'
import useToggle from 'src/hooks/useToggle'
import { FormInstance } from 'antd'
import {
  IChangePasswordRequestPayload,
  IChangePasswordRequestResponse,
} from 'src/models/auth.model'
import { doRequestChangePassword } from 'src/services/auth.service'
import { useAuth } from 'src/context/auth.context'

const useModalChangePasswordController = () => {
  const { handleModalChangePasswordVisibility } = useAuth()
  const { notify } = useApp()
  const [inputError, setInputError] = useState(null)
  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const _onSubmit = useCallback(
    async (payload: IChangePasswordRequestPayload, form: FormInstance) => {
      setIsSubmitted()

      try {
        const res: AxiosResponse<IChangePasswordRequestResponse> =
          await doRequestChangePassword(payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()
        form.resetFields()
        handleModalChangePasswordVisibility()
      } catch (err) {
        const { status }: AxiosError = err?.response
        const { message }: AxiosError = err?.response?.data

        if (status === 422 || status === 400) {
          setInputError(err?.response?.data)
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
    setInputError,
    onSubmit: _onSubmit,
  }
}
export default useModalChangePasswordController
