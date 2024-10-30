// @ts-nocheck
import { AxiosError, AxiosResponse } from 'axios'
import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import {
  ISupplierOrderDetailData,
  ISupplierOrderReceiveOrderItemRequestPayload,
  ISupplierOrderReceiveOrderItemRequestResponse
} from 'src/models/supplier.model'
import { requestSupplierReceiveOrder } from 'src/services/supplier.service'

const useSupplierReceiveOrderItemController = () => {
  const navigate = useNavigate()
  const params = useParams()

  const { notify } = useApp()

  const [selectedData, setSelectedData] =
    useState<ISupplierOrderDetailData>(null)
  const [formErrorMsg, setFormErrorMsg] = useState<string>('')

  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const _onSubmitReceiveOrderItem = useCallback(
    async (
      orderDetailId: number,
      payload: ISupplierOrderReceiveOrderItemRequestPayload,
    ) => {
      setIsSubmitted()

      try {
        const res: AxiosResponse<ISupplierOrderReceiveOrderItemRequestResponse> =
          await requestSupplierReceiveOrder(orderDetailId, payload)

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

  const _onHandleSubmitReceiveOrderItem = (
    e: ISupplierOrderReceiveOrderItemRequestPayload,
    selectedData: ISupplierOrderDetailData,
  ) => {
    const orderDetailId = parseInt(params?.orderId)

    _onSubmitReceiveOrderItem(orderDetailId, e)
  }

  return {
    selectedData,
    isSubmitted,
    formErrorMsg,
    setFormErrorMsg,
    setSelectedData,
    onHandleSubmitReceiveOrderItem: _onHandleSubmitReceiveOrderItem,
  }
}

export default useSupplierReceiveOrderItemController
