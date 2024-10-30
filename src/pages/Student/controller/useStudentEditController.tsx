// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import { IDataResponse } from 'src/models/request.model'
import {
  IStudentDetailPayload,
  IStudentDetailResponse,
  IStudentFormData,
  IStudentFormPayload,
  IStudentRequestResponse,
} from 'src/models/student.model'
import { errorHandler } from 'src/services/api.service'
import {
  fetchStudentDetail,
  requestUpdateStudent,
} from 'src/services/student.service'
import { AxiosError, AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'

const useStudentEditController = () => {
  const params = useParams()
  const navigate = useNavigate()

  const { notify } = useApp()
  const [detailData, setDetailData] = useState<IStudentDetailResponse>(null)
  const [formErrorMsg, setFormErrorMsg] = useState(null)

  const [isLoading, setIsLoading] = useToggle(false)
  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const _onFetchDetail = useCallback(
    async (id: number) => {
      setIsLoading()

      const payload: IStudentDetailPayload = { id }

      try {
        const res: AxiosResponse<IDataResponse<IStudentDetailResponse>> =
          await fetchStudentDetail(payload)

        const studentDetail: IStudentDetailResponse = res?.data?.data
        setDetailData(studentDetail)

        setIsLoading()
      } catch (err) {
        const { message } = errorHandler(err)
        notify.error({
          message: 'Error',
          description: message,
          duration: 5,
        })

        setIsLoading()
      }
    },
    [notify],
  )

  const _onSubmitForm = useCallback(
    async (id: string, payload: IStudentFormData) => {
      setIsSubmitted()

      const newPayload: IStudentFormPayload = {
        ...payload,
        studentDateOfBirth: dayjs(payload.studentDateOfBirth).format(
          DATETIME_FORMATTER_ENUM?.payloadPrimary,
        ),
        religionId: payload?.studentReligion,
        gender: payload?.studentGender,
        schoolId: payload?.studentSchool,
      }

      try {
        const res: AxiosResponse<IStudentRequestResponse> =
          await requestUpdateStudent(id, newPayload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()
        navigate(-1)
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

  const _onHandleSubmitForm = (payload: IStudentFormData) => {
    _onSubmitForm(params?.id, payload)
  }

  useEffect(() => {
    if (params?.id) {
      const id = parseInt(params?.id)
      _onFetchDetail(id)
    }
  }, [params?.id])

  return {
    detailData,
    isSubmitted,
    isLoading,
    formErrorMsg,
    setFormErrorMsg,
    onHandleSubmitForm: _onHandleSubmitForm,
  }
}

export default useStudentEditController
