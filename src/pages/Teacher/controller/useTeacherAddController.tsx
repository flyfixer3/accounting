// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { useCallback, useState } from 'react'
import {
  ITeacherCreateRequestPayload,
  ITeacherData,
  ITeacherRequestResponse,
} from 'src/models/teacher.model'
import useToggle from 'src/hooks/useToggle'
import { AxiosError, AxiosResponse } from 'axios'
import {
  requestCreateTeacher,
  requestUpdateTeacher,
} from 'src/services/teacher.service'
import dayjs from 'dayjs'
import { useNavigate, useParams } from 'react-router-dom'
import { currencyFloatConverter } from 'src/helpers/formatter.helper'

const useTeacherAddController = () => {
  const navigate = useNavigate()
  const params = useParams()

  const { onSetBreadcrumbs, notify } = useApp()

  const [formErrorMsg, setFormErrorMsg] = useState(null)

  const [isSubmitting, setIsSubmitting] = useToggle(false)

  const _onCreateTeacher = useCallback(async (payload: ITeacherData) => {
    setIsSubmitting()

    const newPayload: ITeacherCreateRequestPayload = {
      teacherName: payload?.teacherName || '',
      teacherNickname: payload?.teacherNickname || '',
      gender: payload?.gender || 'M',
      teacherAddress: payload?.teacherAddress || '',
      teacherPlaceOfBirth: payload?.teacherPlaceOfBirth || '',
      teacherDateOfBirth: dayjs(payload.teacherJoinDate).format('YYYY-MM-DD'),
      teacherJoinDate: dayjs(payload.teacherJoinDate).format('YYYY-MM-DD'),
      teacherEducationId: payload?.teacherEducation,
      religionId: payload?.religion,
      teacherPhoneNumber: payload?.teacherPhoneNumber,
      teacherEmail: payload?.teacherEmail,
      teacherStatus: 'ACTIVE',
      courseLevelId: payload?.courseLevelId,
      baseSalary: currencyFloatConverter(payload?.baseSalary),
    }

    try {
      const res: AxiosResponse<ITeacherRequestResponse> =
        await requestCreateTeacher(newPayload)

      notify.success({
        message: 'Success',
        description: res?.data?.message,
        duration: 5,
      })

      setIsSubmitting()

      navigate(`/teacher/${res?.data?.data?.teacherNumber}`)
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
      setIsSubmitting()
    }
  }, [])

  const _onUpdateTeacher = useCallback(
    async (id: string, payload: ITeacherData) => {
      setIsSubmitting()

      const newPayload: ITeacherCreateRequestPayload = {
        teacherName: payload?.teacherName || '',
        teacherNickname: payload?.teacherNickname || '',
        gender: payload?.gender,
        teacherAddress: payload?.teacherAddress || '',
        teacherPlaceOfBirth: payload?.teacherPlaceOfBirth || '',
        teacherDateOfBirth: dayjs(payload.teacherJoinDate).format('YYYY-MM-DD'),
        teacherJoinDate: dayjs(payload.teacherJoinDate).format('YYYY-MM-DD'),
        teacherEducationId: payload?.teacherEducation,
        religionId: payload?.religion,
        teacherPhoneNumber: payload?.teacherPhoneNumber,
        teacherEmail: payload?.teacherEmail,
        teacherStatus: payload?.teacherStatus,
        courseLevelId: payload?.courseLevelId,
        baseSalary: currencyFloatConverter(payload?.baseSalary),
      }

      try {
        const res: AxiosResponse<ITeacherRequestResponse> =
          await requestUpdateTeacher(id, newPayload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitting()

        navigate(`/teacher/${id}`)
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
        setIsSubmitting()
      }
    },
    [],
  )

  const _handleSubmitTeacherForm = (payload: ITeacherData, isEdit: boolean) => {
    if (isEdit) {
      _onUpdateTeacher(params?.id, payload)
    } else {
      _onCreateTeacher(payload)
    }
  }

  return {
    handleSubmitCourseForm: _handleSubmitTeacherForm,
    formErrorMsg,
    setFormErrorMsg,
    isSubmitting,
    onSetBreadcrumbs,
    params,
  }
}
export default useTeacherAddController
