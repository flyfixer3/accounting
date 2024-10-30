// @ts-nocheck
import { AxiosError, AxiosResponse } from 'axios'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from 'src/context/app.context'
import { STATUS_ENUM } from 'src/enums/enums'
import useToggle from 'src/hooks/useToggle'
import { ISelectData } from 'src/models/general.model'
import {
  IIBOChangeStatusOrderRequestPaylaod,
  IIBOChangeStatusOrderRequestResponse,
  IIBOOrderDetailResponse,
  IIBOOrderDetails,
  IIBOSendOrderItemFormData,
  IIBOSendOrderItemRequestPayload,
} from 'src/models/order.model'
import { errorHandler } from 'src/services/api.service'
import {
  fetchIBOOrderDetail,
  requestIBOSendOrderItem,
  requestIBOUpdateOrderStatus,
} from 'src/services/order.service'

const useOrderDetailController = () => {
  const { notify } = useApp()
  const params = useParams()

  const [detailData, setDetailData] = useState<IIBOOrderDetailResponse>()
  const [selectedItem, setSelectedItem] = useState<IIBOOrderDetails>()
  const [formErrorMsg, setFormErrorMsg] = useState(null)

  const [isFetch, setIsFetch] = useToggle(false)
  const [isLoading, setIsLoading] = useToggle(false)
  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const [isModalUpdateStatusVisible, setIsModalUpdateStatusVisible] =
    useToggle(false)
  const [isModalSendItemVisible, setIsModalSendItemVisible] = useToggle(false)

  const statusListOptions: ISelectData[] = [
    { value: STATUS_ENUM?.paid, label: STATUS_ENUM?.paid },
    { value: STATUS_ENUM?.unpaid, label: STATUS_ENUM?.unpaid },
    { value: STATUS_ENUM?.rejected, label: STATUS_ENUM?.rejected },
  ]

  const _onFetch = useCallback(
    async (orderId: number, isFetch?: boolean) => {
      setIsLoading()

      try {
        const res: AxiosResponse<IIBOOrderDetailResponse> =
          await fetchIBOOrderDetail(orderId)

        const detail: IIBOOrderDetailResponse = res?.data
        setDetailData(detail)

        isFetch && setIsFetch()
        setIsLoading()
      } catch (err) {
        const { message } = errorHandler(err)
        notify.error({
          message: 'Error',
          description: message,
          duration: 5,
        })
        isFetch && setIsFetch()
        setIsLoading()
      }
    },
    [notify, setIsFetch],
  )

  const _onSubmitUpdateStatus = useCallback(
    async (orderId: number, payload: IIBOChangeStatusOrderRequestPaylaod) => {
      setIsSubmitted()
      try {
        const res: AxiosResponse<IIBOChangeStatusOrderRequestResponse> =
          await requestIBOUpdateOrderStatus(orderId, payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()
        _handleModalUpdateStatusVisibility()
        _onRefetch()
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

  const _onSubmitSendOrderItem = useCallback(
    async (orderDetailId: number, payload: IIBOSendOrderItemRequestPayload) => {
      setIsSubmitted()
      try {
        const res: AxiosResponse<IIBOChangeStatusOrderRequestResponse> =
          await requestIBOSendOrderItem(orderDetailId, payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()
        _handleModalSendItemVisibility()
        setSelectedItem(null)
        _onRefetch()
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

  const _onRefetch = async () => {
    await _onFetch(parseInt(params?.id), isFetch)
  }

  const _onSetFormErrorMsg = (val: string) => {
    setFormErrorMsg(val)
  }

  const _handleModalUpdateStatusVisibility = () =>
    setIsModalUpdateStatusVisible()

  const _handleModalSendItemVisibility = () => setIsModalSendItemVisible()

  const _handleSubmitUpdateStatus = (e: any) => {
    const payload: IIBOChangeStatusOrderRequestPaylaod = {
      orderStatus: e?.status,
      subaccount_id: e.subaccountId,
    }

    if (e?.paymentMethodId && e?.status === STATUS_ENUM?.paid) {
      payload.paymentMethodId = e?.paymentMethodId
      if (e?.bankId) {
        payload.bankId = e?.bankId
      }
    }

    if (e?.status === STATUS_ENUM?.rejected) {
      payload.rejectReason = e?.rejectReason
    }

    _onSubmitUpdateStatus(detailData?.id, payload)
  }

  const _onHandleSendItemBtn = (record: IIBOOrderDetails) => {
    setSelectedItem(record)
    _handleModalSendItemVisibility()
  }

  const _onHandleSubmitSendItem = (e: IIBOSendOrderItemFormData) => {
    const payload: IIBOSendOrderItemRequestPayload = e
    _onSubmitSendOrderItem(selectedItem?.id, payload)
  }

  const _getTotalQtyAndPrice = useMemo(() => {
    let totalQty = 0
    let totalPrice = 0

    detailData?.orderDetails?.forEach((item: IIBOOrderDetails) => {
      const qty: number = parseInt(item?.qty)
      const price: number = parseFloat(item?.price)

      totalQty += qty

      totalPrice += qty * price
    })

    return {
      totalQty,
      totalPrice,
    }
  }, [detailData])

  const _getStatusListOptions = useMemo(() => {
    const status = detailData?.orderStatus
    if (status === STATUS_ENUM?.pending) {
      return statusListOptions.filter(
        (item) => item.value !== STATUS_ENUM?.paid,
      )
    } else if (status === STATUS_ENUM?.unpaid) {
      return statusListOptions.filter(
        (item) => item.value !== STATUS_ENUM?.unpaid,
      )
    } else if (status === STATUS_ENUM.waitingConfirmation) {
      return statusListOptions.filter(
        (item) =>
          item.value !== STATUS_ENUM?.unpaid &&
          item.value !== STATUS_ENUM.rejected,
      )
    } else return statusListOptions
  }, [detailData?.orderStatus])

  useEffect(() => {
    _onRefetch()
  }, [])

  return {
    detailData,
    isLoading,
    formErrorMsg,
    isSubmitted,
    statusListOptions: _getStatusListOptions,
    isModalUpdateStatusVisible,
    getTotalQtyAndPrice: _getTotalQtyAndPrice,
    isModalSendItemVisible,
    selectedItem,
    setFormErrorMsg,
    onSetFormErrorMsg: _onSetFormErrorMsg,
    onRefetchDetail: _onRefetch,
    handleModalUpdateStatusVisibility: _handleModalUpdateStatusVisibility,
    handleSubmitUpdateStatus: _handleSubmitUpdateStatus,
    handleModalSendItemVisibility: _handleModalSendItemVisibility,
    onHandleSendItemBtn: _onHandleSendItemBtn,
    onHandleSubmitSendItem: _onHandleSubmitSendItem,
  }
}

export default useOrderDetailController
