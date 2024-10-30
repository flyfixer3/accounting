// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { useStudentRegistrationContext } from '../context/student-registration.context'
import { useCallback, useState } from 'react'
import {
  IRequestResponse,
  IStudentRegistrationParentFormPayload,
  IStudentRegistrationSubmitPayload,
  IStudentRequestPayload,
} from 'src/models/student-registration.model'
import { AxiosError, AxiosResponse } from 'axios'
import { requestSubmitStudentRegistration } from 'src/services/student-registration.service'
import useToggle from 'src/hooks/useToggle'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'

const useReviewFormController = () => {
  const { notify } = useApp()
  const {
    formStep,
    courseDetailDataPayload,
    studentDataPayload,
    parentDataPayload,
    courseClassDataPayload,
    handleBackBtn,
  } = useStudentRegistrationContext()

  const navigate = useNavigate()

  const [formErrorMsg, setFormErrorMsg] = useState(null)

  const [isSubmitting, setIsSubmitting] = useToggle(false)

  const _onSubmit = useCallback(
    async (payload: IStudentRegistrationSubmitPayload) => {
      setIsSubmitting()

      try {
        const res: AxiosResponse<IRequestResponse> =
          await requestSubmitStudentRegistration(payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitting()
        navigate(`/student-registration`)
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

  const _onHandleSubmit = () => {
    let newStudentPayload: IStudentRequestPayload = {}
    if (studentDataPayload?.studentId) {
      newStudentPayload.studentId = studentDataPayload?.studentId
    } else {
      newStudentPayload = {
        ...studentDataPayload,
        studentDateOfBirth: dayjs(
          studentDataPayload?.studentDateOfBirth,
        ).format(DATETIME_FORMATTER_ENUM?.payloadPrimary),
      }
    }

    let newParentPayload: IStudentRegistrationParentFormPayload = {}
    if (parentDataPayload?.parentId) {
      newParentPayload.parentId = parentDataPayload?.parentId
    } else {
      newParentPayload = {
        ...parentDataPayload,
      }
    }

    const payload: IStudentRegistrationSubmitPayload = {
      studentData: newStudentPayload,
      parentData: newParentPayload,
      courseDetailData: courseDetailDataPayload,
      courseClassData: courseClassDataPayload,
    }

    _onSubmit(payload)
  }

  return {
    formStep,
    courseDetailDataPayload,
    studentDataPayload,
    parentDataPayload,
    courseClassDataPayload,
    isSubmitting,
    formErrorMsg,
    handleBackBtn,
    handleSubmit: _onHandleSubmit,
  }
}

export default useReviewFormController
