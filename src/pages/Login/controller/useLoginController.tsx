// @ts-nocheck
import { setCSRFCookie } from 'src/services/api.service'
import { useAuth } from 'src/context/auth.context'
import { doRequestLogin } from 'src/services/auth.service'
import { ILoginPayloadRequest, ILoginResponse } from '@src/models/login.model'
import { useCallback, useState } from 'react'
import useToggle from 'src/hooks/useToggle'
import { AxiosError, AxiosResponse } from 'axios'
import { ILoggedInUser } from '@src/models/user.model'
import { useApp } from 'src/context/app.context'

const useLoginController = () => {
  const { doLogin } = useAuth()
  const { notify } = useApp()

  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useToggle(false)

  const _onSubmitLogin = useCallback(
    async (payload?: ILoginPayloadRequest) => {
      setIsSubmitting()

      await setCSRFCookie()

      try {
        const res: AxiosResponse<ILoginResponse> = await doRequestLogin(payload)

        const data = res?.data?.data
        if (data) {
          const token = data?.token
          const user: ILoggedInUser = {
            user: data?.user,
            role: data.role,
          }

          if (data?.trainingCenter) user.trainingCenter = data?.trainingCenter
          if (data?.ibo) user.ibo = data.ibo

          localStorage.setItem('user', JSON.stringify(user))
          localStorage.setItem('token', JSON.stringify(token))

          await doLogin()
        }
      } catch (err) {
        const { status }: AxiosError = err?.response
        const { message }: AxiosError = err?.response?.data

        if (status === 422 || status === 400) {
          setErrorMsg(message)
        } else {
          notify.error({
            message: 'Error',
            description: message,
            duration: 5,
          })
        }
      }

      setIsSubmitting()
    },
    [doLogin, notify, setIsSubmitting],
  )

  const _onFormValueChange = () => {
    setErrorMsg('')
  }

  return {
    onSubmitLogin: _onSubmitLogin,
    isSubmitting: isSubmitting,
    errorMsg,
    onFormValueChange: _onFormValueChange,
  }
}

export default useLoginController
