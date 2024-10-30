// @ts-nocheck
import { useCallback, useEffect, useState } from 'react'
import useToggle from 'src/hooks/useToggle'
import {
  IFormSteps,
  useStudentRegistrationContext,
} from '../context/student-registration.context'
import {
  IRequestResponse,
  IStudentRegistrationParentFormPayload,
} from 'src/models/student-registration.model'
import { AxiosError, AxiosResponse } from 'axios'
import { requestValidateParentForm } from 'src/services/student-registration.service'
import { useApp } from 'src/context/app.context'
import {
  IParentDetailPayload,
  IParentDetailResponse,
  IParentSelect,
} from 'src/models/parent.model'
import { IDataResponse } from 'src/models/request.model'
import { fetchParentDetail } from 'src/services/parent.service'
import { errorHandler } from 'src/services/api.service'
import { FormInstance } from 'antd'

const useParentFormController = () => {
  const { notify } = useApp()
  const {
    formAddType,
    handleSelectedAddType,
    formStep,
    parentDataPayload,
    handleChangeFormStep,
    handleSetParentData,
    handleBackBtn,
  } = useStudentRegistrationContext()

  const [detailData, setDetailData] = useState<IParentDetailResponse>(null)

  const [formErrorMsg, setFormErrorMsg] = useState(null)
  const [isLoading, setIsLoading] = useToggle(false)
  const [isSubmitting, setIsSubmitting] = useToggle(false)

  const _onValidateStepParent = useCallback(
    async (
      payload: IStudentRegistrationParentFormPayload,
      formStep: IFormSteps,
      id?: number,
    ) => {
      setIsSubmitting()

      let newPayload: IStudentRegistrationParentFormPayload = {}

      if (id) {
        newPayload.parentId = id
      } else {
        newPayload = {
          ...payload,
        }
      }

      try {
        const res: AxiosResponse<IRequestResponse> =
          await requestValidateParentForm(newPayload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitting()
        handleSetParentData({ ...payload, parentId: id })

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

      const payload: IParentDetailPayload = { id }

      try {
        const res: AxiosResponse<IDataResponse<IParentDetailResponse>> =
          await fetchParentDetail(payload)

        const parentDetail: IParentDetailResponse = res?.data?.data
        setDetailData(parentDetail)

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
    data: IStudentRegistrationParentFormPayload | IParentDetailResponse,
  ) => {
    form.setFieldsValue({
      parentName: data?.parentName,
      parentEmail: data?.parentEmail,
      parentPhone:
        'parentPhone' in data
          ? (data as IStudentRegistrationParentFormPayload).parentPhone
          : (data as IParentDetailResponse).parentPhoneNumber,
      parentOccupation: data?.parentOccupation,
    })
  }

  const handleSelectedExistingParent = (e: IParentSelect) => {
    const parentId: number = parseInt(e?.value)
    _onFetchDetail(parentId)
  }

  const _onHandleValidate = (
    payload: IStudentRegistrationParentFormPayload,
    formStep: IFormSteps,
    id?: number,
  ) => {
    _onValidateStepParent(payload, formStep, id)
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
    setIsSubmitting,
    handleSelectedAddType,
    onValidateStepParent: _onHandleValidate,
    handleSelectedExistingParent,
    handleBackBtn,
    onSetExistingData: _onSetExistingData,
    parentDataPayload,
    detailData,
    isLoading,
  }
}

export default useParentFormController
