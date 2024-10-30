// @ts-nocheck
import useToggle from 'src/hooks/useToggle'
import { useCallback, useState } from 'react'
import { AxiosError, AxiosResponse } from 'axios'
import { useApp } from 'src/context/app.context'
import { Modal } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  IStudentEquipmentPurchaseFormData,
  IStudentEquipmentPurchasePayload,
  IStudentEquipmentPurchaseRequestResponse,
} from 'src/models/student-equipment.model'
import { requestPurchaseEquipment } from 'src/services/student-equipment.service'

const useStudentEquipmentPurchaseController = () => {
  const { notify } = useApp()
  const navigate = useNavigate()
  const [formErrorMsg, setFormErrorMsg] = useState(null)

  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const _onSubmitPurchaseEquipment = useCallback(
    async (
      payload: IStudentEquipmentPurchasePayload,
      handleClose: () => void,
    ) => {
      setIsSubmitted()

      try {
        const res: AxiosResponse<IStudentEquipmentPurchaseRequestResponse> =
          await requestPurchaseEquipment(payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()
        handleClose()

        const resData = res?.data?.data

        Modal.success({
          closeIcon: true,
          title: 'Success',

          content: (
            <>
              <div>Success Purchase Equipment</div>
              <div>
                Invoice ID:{' '}
                <span
                  className="link-title"
                  onClick={() => {
                    navigate(`/sales-invoice/${resData?.invoiceNumber}`)
                    Modal.destroyAll()
                  }}>
                  {resData?.invoiceNumber}
                </span>
              </div>
            </>
          ),
        })
      } catch (err) {
        const { message }: AxiosError = err?.response?.data

        setFormErrorMsg(message)

        notify.error({
          message: 'Error',
          description: message,
          duration: 5,
        })

        setIsSubmitted()
      }
    },
    [],
  )

  const _onHandlePurchaseEquipment = (
    e: IStudentEquipmentPurchaseFormData,
    handleClose: () => void,
  ) => {
    const payload: IStudentEquipmentPurchasePayload = {
      studentId: e?.studentId,
      qty: e?.qty,
      equipmentId: e?.equipmentId,
    }
    _onSubmitPurchaseEquipment(payload, handleClose)
  }

  return {
    formErrorMsg,
    isSubmitted,
    onHandlePurchaseEquipment: _onHandlePurchaseEquipment,
  }
}

export default useStudentEquipmentPurchaseController
