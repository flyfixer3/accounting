// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'

import { requestUpdateIBOBookStock } from 'src/services/books.service'
import { AxiosError, AxiosResponse } from 'axios'
import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  IUserTrainingCenterRequestPayload,
  IUserTrainingCenterRequestResponse,
} from 'src/models/user.model'
import {
  requestCreateTrainingCenterUser,
  requestUpdateTrainingCenterUser,
} from 'src/services/user.service'

const useTrainingCenterAddController = () => {
  const navigate = useNavigate()
  const params = useParams()

  const { notify } = useApp()

  const [formErrorMsg, setFormErrorMsg] = useState('')
  const [errors, setErrors] = useState(null)

  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const _onSubmitCreateTrainingCenter = useCallback(
    async (payload: IUserTrainingCenterRequestPayload) => {
      setIsSubmitted()

      try {
        const res: AxiosResponse<IUserTrainingCenterRequestResponse> =
          await requestCreateTrainingCenterUser(payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()

        navigate(
          `/user/training-center/${res?.data?.data?.trainingCenterNumber}`,
        )
      } catch (err) {
        const { status }: AxiosError = err?.response
        const { message }: AxiosError = err?.response?.data

        if (status === 422 || status === 400) {
          setFormErrorMsg(message)
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

  const _onSubmitUpdateTrainingCenterUser = useCallback(
    async (id: string, payload: IUserTrainingCenterRequestPayload) => {
      setIsSubmitted()

      try {
        const res: AxiosResponse<IUserTrainingCenterRequestResponse> =
          await requestUpdateTrainingCenterUser(id, payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()

        navigate(
          `/user/training-center/${res?.data?.data?.trainingCenterNumber}`,
        )
      } catch (err) {
        const { status }: AxiosError = err?.response
        const { message }: AxiosError = err?.response?.data

        if (status === 422 || status === 400) {
          setFormErrorMsg(message)
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

  const _handleSubmitForm = (
    payload: IUserTrainingCenterRequestPayload,
    isEdit: boolean,
  ) => {
    if (isEdit) {
      _onSubmitUpdateTrainingCenterUser(params?.id, payload)
    } else {
      _onSubmitCreateTrainingCenter(payload)
    }
  }

  return {
    isSubmitted,
    formErrorMsg,
    setFormErrorMsg,
    handleSubmitForm: _handleSubmitForm,
  }
}

export default useTrainingCenterAddController
