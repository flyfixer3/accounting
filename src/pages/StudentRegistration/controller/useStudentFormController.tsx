// @ts-nocheck
import {
  IStudentDetailPayload,
  IStudentDetailResponse,
  IStudentSelect,
} from 'src/models/student.model'
import { useCallback, useEffect, useState } from 'react'
import useToggle from 'src/hooks/useToggle'
import { useStudentRegistrationContext } from '../context/student-registration.context'
import {
  IStudentRegistrationStudentFormData,
  IStudentFormPayload,
  IRequestResponse,
  IStudentRequestPayload,
} from 'src/models/student-registration.model'
import { AxiosError, AxiosResponse } from 'axios'
import { requestValidateStudentForm } from 'src/services/student-registration.service'
import { useApp } from 'src/context/app.context'
import { IDataResponse } from 'src/models/request.model'
import { fetchStudentDetail } from 'src/services/student.service'
import { errorHandler } from 'src/services/api.service'
import { FormInstance } from 'antd'
import dayjs from 'dayjs'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'

const useStudentFormController = () => {
  const { notify } = useApp()
  const {
    formAddType,
    handleSelectedAddType,
    formStep,
    handleChangeFormStep,
    handleSetStudentData,
    studentDataPayload,
  } = useStudentRegistrationContext()

  const [detailData, setDetailData] = useState<IStudentDetailResponse>(null)

  const [formErrorMsg, setFormErrorMsg] = useState(null)
  const [isLoading, setIsLoading] = useToggle(false)
  const [isSubmitting, setIsSubmitting] = useToggle(false)

  const _onValidateStepStudent = useCallback(
    async (payload: IStudentRegistrationStudentFormData, id?: number) => {
      setIsSubmitting()
      let newPayload: IStudentRequestPayload = {}
      if (id) {
        newPayload.studentId = id
      } else {
        newPayload = {
          ...payload,
          religionId: payload?.studentReligion,
          gender: payload?.studentGender,
          schoolId: payload?.studentSchool,
          studentDateOfBirth: dayjs(payload.studentDateOfBirth).format(
            DATETIME_FORMATTER_ENUM?.payloadPrimary,
          ),
        }
      }

      try {
        const res: AxiosResponse<IRequestResponse> =
          await requestValidateStudentForm(newPayload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitting()

        const studentData = {
          ...payload,
          religionId: payload?.studentReligion,
          gender: payload?.studentGender,
          schoolId: payload?.studentSchool,
          studentId: id,
        }

        handleSetStudentData(studentData)
        handleChangeFormStep(formStep?.step + 1)
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

  const _onSetExistingData = (
    form: FormInstance,
    data: IStudentDetailResponse | IStudentFormPayload,
  ) => {
    form.setFieldsValue({
      studentName: data?.studentName,
      studentPhoneNumber: data?.studentPhoneNumber,
      studentGender: data?.gender,
      studentEmail: data?.studentEmail,
      studentAddress: data?.studentAddress,
      studentCity: data?.studentCity,
      studentDateOfBirth: dayjs(data?.studentDateOfBirth),
      studentPlaceOfBirth: data?.studentPlaceOfBirth,
      studentReligion:
        'religion' in data
          ? (data as IStudentDetailResponse).religion?.id
          : (data as IStudentFormPayload).religionId,
      studentSchool:
        'school' in data
          ? (data as IStudentDetailResponse).school?.id
          : (data as IStudentFormPayload).schoolId,
    })
  }

  const handleSelectedExistingStudent = (e: IStudentSelect) => {
    const studentId: number = parseInt(e?.value)
    _onFetchDetail(studentId)
  }

  useEffect(() => {
    handleSelectedAddType('search_existing')
  }, [formStep])

  return {
    formErrorMsg,
    isSubmitting,
    handleSelectedExistingStudent,
    setFormErrorMsg,
    formAddType,
    formStep,
    setIsSubmitting,
    handleSelectedAddType,
    onValidateStepStudent: _onValidateStepStudent,
    detailData,
    isLoading,
    studentDataPayload,
    onSetExistingData: _onSetExistingData,
  }
}

export default useStudentFormController
