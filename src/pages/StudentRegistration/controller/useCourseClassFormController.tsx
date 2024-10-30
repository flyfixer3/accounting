// @ts-nocheck
import { useCallback, useEffect, useState } from 'react'
import useToggle from 'src/hooks/useToggle'
import {
  IFormSteps,
  useStudentRegistrationContext,
} from '../context/student-registration.context'
import { useApp } from 'src/context/app.context'
import { IClassData } from 'src/models/class.model'
import {
  IRequestResponse,
  IStudentRegistrationCourseClassFormData,
  IStudentRegistrationCourseClassPayload,
} from 'src/models/student-registration.model'
import { AxiosError, AxiosResponse } from 'axios'
import { requestValidateCourseClassForm } from 'src/services/student-registration.service'

const useCourseClassFormController = () => {
  const { notify } = useApp()
  const {
    formAddType,
    handleSelectedAddType,
    formStep,
    courseDetailDataPayload,
    handleBackBtn,
    handleSetCourseClassData,
    handleChangeFormStep,
  } = useStudentRegistrationContext()

  const [selectedClassIds, setSelectedClassIds] = useState<number[]>(null)
  const [selectedClassObj, setSelectedClassObj] = useState<IClassData[]>([])

  const [formErrorMsg, setFormErrorMsg] = useState(null)

  const [isSubmitting, setIsSubmitting] = useToggle(false)

  const _onValidateStepCourseClass = useCallback(
    async (
      payload: IStudentRegistrationCourseClassFormData,
      formStep: IFormSteps,
    ) => {
      setIsSubmitting()

      const newPayload: IStudentRegistrationCourseClassPayload = {
        courseId: payload?.courseId,
        courseLevelId: payload?.courseLevelId,
        courseClassIdList: payload?.courseClassIdList,
      }

      try {
        const res: AxiosResponse<IRequestResponse> =
          await requestValidateCourseClassForm(newPayload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitting()
        handleSetCourseClassData(payload)
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

  const _onHandleValidate = () => {
    const payload: IStudentRegistrationCourseClassFormData = {
      courseId: courseDetailDataPayload.courseId,
      courseLevelId: courseDetailDataPayload?.courseLevelId,
      courseClassIdList: selectedClassIds,
      courseClassIdObj: selectedClassObj,
    }
    _onValidateStepCourseClass(payload, formStep)
  }

  const _onSelectAll = (e: boolean, selectedRows: IClassData[]) => {
    const isSelected = e
    if (isSelected) {
      setSelectedClassObj(selectedRows)
    } else {
      setSelectedClassObj([])
    }
  }

  const _onChange = (e: number[], selectedRows: IClassData[]) => {
    setSelectedClassIds(e)
    setSelectedClassObj(selectedRows)
    formErrorMsg && setFormErrorMsg(null)
  }

  useEffect(() => {
    handleSelectedAddType('search_existing')
  }, [formStep])

  return {
    formErrorMsg,
    isSubmitting,
    handleBackBtn,
    setFormErrorMsg,
    formAddType,
    formStep,
    courseDetailDataPayload,
    selectedClassIds,
    setIsSubmitting,
    handleSelectedAddType,
    onSelectAll: _onSelectAll,

    onChange: _onChange,
    onHandleValidate: _onHandleValidate,
  }
}

export default useCourseClassFormController
