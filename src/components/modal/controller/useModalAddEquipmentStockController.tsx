// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'

import { AxiosError, AxiosResponse } from 'axios'
import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  IStudentEquipmentStockCreateRequestPayload,
  IStudentEquipmentStockFormData,
  IStudentEquipmentStockRequestResponse,
  IStudentEquipmentStockUpdateRequestPayload,
} from 'src/models/student-equipment.model'
import {
  requestCreateIBOStudentEquipmentStock,
  requestUpdateIBOStudentEquipmentStock,
} from 'src/services/student-equipment.service'

const useModalAddEquipmentStockController = () => {
  const navigate = useNavigate()
  const params = useParams()

  const { notify } = useApp()

  const [formErrorMsg, setFormErrorMsg] = useState('')

  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const _onSubmitCreateStudentEquipmentStock = useCallback(
    async (
      payload: IStudentEquipmentStockCreateRequestPayload,
      handleModalClose: () => void,
    ) => {
      setIsSubmitted()

      try {
        const res: AxiosResponse<IStudentEquipmentStockRequestResponse> =
          await requestCreateIBOStudentEquipmentStock(payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()

        handleModalClose && handleModalClose()
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

  const _onSubmitUpdateStudentEquipmentStock = useCallback(
    async (
      id: number,
      payload: IStudentEquipmentStockUpdateRequestPayload,
      handleModalClose: () => void,
    ) => {
      setIsSubmitted()

      try {
        const res: AxiosResponse<IStudentEquipmentStockRequestResponse> =
          await requestUpdateIBOStudentEquipmentStock(id, payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()

        handleModalClose && handleModalClose()
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

  const _handleSubmitStudentEquipmentStock = (
    payload: IStudentEquipmentStockFormData,
    isEdit: boolean,
    handleModalClose: () => void,
  ) => {
    const newPayload = {
      ...payload,
    }
    delete newPayload.equipmentImageFile
    newPayload.equipmentImageUrl = null
    newPayload.equipmentPrice = parseFloat(newPayload.equipmentPrice).toFixed(2)

    if (isEdit) {
      _onSubmitUpdateStudentEquipmentStock(
        parseInt(params?.id),
        newPayload,
        handleModalClose,
      )
    } else {
      _onSubmitCreateStudentEquipmentStock(newPayload, handleModalClose)
    }
  }

  return {
    isSubmitted,
    formErrorMsg,
    setFormErrorMsg,
    handleSubmitStudentEquipmentStock: _handleSubmitStudentEquipmentStock,
  }
}

export default useModalAddEquipmentStockController
