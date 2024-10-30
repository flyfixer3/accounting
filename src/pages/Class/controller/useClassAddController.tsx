// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import {
  IClassFormData,
  IClassRequestPayload,
  IClassRequestResponse,
} from 'src/models/class.model'
import {
  requestCreateClass,
  requestUpdateClass,
} from 'src/services/class.service'
import { AxiosError, AxiosResponse } from 'axios'
import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import { IRequestErrorData } from '@src/models/general.model'

const useClassAddController = () => {
  const navigate = useNavigate()
  const params = useParams()

  const { onSetBreadcrumbs, notify } = useApp()

  const [formErrorMsg, setFormErrorMsg] = useState({
    message: '',
    errors: [],
  })

  const [isSubmitting, setIsSubmitting] = useToggle(false)

  const _onCreateClass = useCallback(async (payload: IClassFormData) => {
    setIsSubmitting()

    const newPayload: IClassRequestPayload = {
      className: payload?.className,
      classDay: payload?.classDay,
      classStartTime: dayjs(payload?.classStartTime).format(
        DATETIME_FORMATTER_ENUM.time,
      ),
      classEndTime: dayjs(payload?.classEndTime).format(
        DATETIME_FORMATTER_ENUM.time,
      ),
      teacherId: payload.classTeacher,
      courseId: payload.classCourse,
      courseLevelId: payload.classCourseLevel,
      status: 'ACTIVE',
    }

    try {
      const res: AxiosResponse<IClassRequestResponse> =
        await requestCreateClass(newPayload)

      notify.success({
        message: 'Success',
        description: res?.data?.message,
        duration: 5,
      })

      setIsSubmitting()

      navigate(`/class/${res?.data?.data?.id}`)
    } catch (err) {
      const { status }: AxiosError = err?.response
      const { message }: AxiosError = err?.response?.data

      setFormErrorMsg(err?.response?.data)

      notify.error({
        message: 'Error',
        description: message,
        duration: 5,
      })

      setIsSubmitting()
    }
  }, [])

  const _onUpdateClass = useCallback(
    async (id: string, payload: IClassFormData) => {
      setIsSubmitting()

      const newPayload: IClassRequestPayload = {
        className: payload?.className,
        classDay: payload?.classDay,
        classStartTime: dayjs(payload?.classStartTime).format(
          DATETIME_FORMATTER_ENUM.time,
        ),
        classEndTime: dayjs(payload?.classEndTime).format(
          DATETIME_FORMATTER_ENUM.time,
        ),
        teacherId: payload.classTeacher,
        courseId: payload.classCourse,
        courseLevelId: payload.classCourseLevel,
        status: payload.status,
      }

      try {
        const res: AxiosResponse<IClassRequestResponse> =
          await requestUpdateClass(id, newPayload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitting()

        navigate(`/class/${id}`)
      } catch (err) {
        const { status }: AxiosError = err?.response
        const { message }: AxiosError = err?.response?.data

        setFormErrorMsg(err?.response?.data)

        notify.error({
          message: 'Error',
          description: message,
          duration: 5,
        })

        setIsSubmitting()
      }
    },
    [],
  )

  const _handleSetFormMessage = (e: IRequestErrorData) => {
    const newFormErrorMsg = { ...formErrorMsg }
    newFormErrorMsg.message = e?.message || ''
    newFormErrorMsg.errors = e?.errors || null
    setFormErrorMsg(newFormErrorMsg)
  }

  const _handleSubmitCourseForm = (
    payload: IClassFormData,
    isEdit: boolean,
  ) => {
    if (isEdit) {
      _onUpdateClass(params?.id, payload)
    } else {
      _onCreateClass(payload)
    }
  }

  return {
    handleSubmitCourseForm: _handleSubmitCourseForm,
    formErrorMsg,
    setFormErrorMsg,
    isSubmitting,
    onSetBreadcrumbs,
    params,
    handleSetFormMessage: _handleSetFormMessage,
  }
}

export default useClassAddController
