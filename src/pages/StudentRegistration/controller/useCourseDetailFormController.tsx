// @ts-nocheck
import { useCallback, useEffect, useState } from 'react'
import useToggle from 'src/hooks/useToggle'
import {
  IFormSteps,
  useStudentRegistrationContext,
} from '../context/student-registration.context'
import {
  IRequestResponse,
  IStudentRegistrationCourseDetailFormData,
} from 'src/models/student-registration.model'
import { AxiosError, AxiosResponse } from 'axios'
import { requestValidateCourseDetailForm } from 'src/services/student-registration.service'
import { useApp } from 'src/context/app.context'
import { FormInstance } from 'antd'

const useCourseDetailFormController = () => {
  const { notify } = useApp()
  const {
    formAddType,
    handleSelectedAddType,
    formStep,
    courseDetailDataPayload,
    handleChangeFormStep,
    handleSetCourseDetailData,
    handleBackBtn,
  } = useStudentRegistrationContext()

  const [formErrorMsg, setFormErrorMsg] = useState(null)

  const [isSubmitting, setIsSubmitting] = useToggle(false)

  const _onValidateStepCourseDetail = useCallback(
    async (
      payload: IStudentRegistrationCourseDetailFormData,
      formStep: IFormSteps,
    ) => {
      setIsSubmitting()

      try {
        const res: AxiosResponse<IRequestResponse> =
          await requestValidateCourseDetailForm(payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitting()
        handleSetCourseDetailData(payload)
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

  const _onSetExistingData = (
    form: FormInstance,
    data: IStudentRegistrationCourseDetailFormData,
  ) => {
    form.setFieldsValue({
      courseId: data?.courseId,
      bookId: data?.bookId,
      courseLevelId: data?.courseLevelId,
      selectedCourseObj: data?.selectedCourseObj,
      selectedCourseLevelObj: data?.selectedCourseLevelObj,
    })
  }

  const _onHandleValidate = (
    payload: IStudentRegistrationCourseDetailFormData,
    formStep: IFormSteps,
  ) => {
    _onValidateStepCourseDetail(payload, formStep)
  }

  useEffect(() => {
    handleSelectedAddType('search_existing')
  }, [formStep])

  return {
    formErrorMsg,
    isSubmitting,
    setFormErrorMsg,
    formAddType,
    formStep,
    courseDetailDataPayload,
    setIsSubmitting,
    handleSelectedAddType,
    onValidateStepCourseDetail: _onHandleValidate,
    handleBackBtn,
    onSetExistingData: _onSetExistingData,
  }
}

export default useCourseDetailFormController
