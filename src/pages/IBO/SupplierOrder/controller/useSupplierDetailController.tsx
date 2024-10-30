// @ts-nocheck
import useToggle from 'src/hooks/useToggle'
import { IDataResponse } from 'src/models/request.model'
import {
  ISupplierOrderDetailResponse,
  ISupplierOrderDetailData,
  ISupplierOrderReceiveItemDetailResponse,
  ISupplierOrderReceiveOrderItemRequestResponse,
  ISupplierOrderUpdatePaymentRequestPayload,
  ISupplierOrderReceiveItemDetailData,
  ISupplierOrderReceiveItemDetailUpdateBookNumberRequestPayload,
} from 'src/models/supplier.model'
import { useCallback, useEffect, useState } from 'react'

import { AxiosError, AxiosResponse } from 'axios'
import {
  fetchSupplierOrderDetail,
  fetchSupplierReceiveItemDetail,
  requestUpdateSupplierOrderBookNumberList,
  requestUpdateSupplierPaymentStatus,
} from 'src/services/supplier.service'
import { errorHandler } from 'src/services/api.service'
import { useApp } from 'src/context/app.context'
import { useNavigate, useParams } from 'react-router-dom'

const useSupplierDetailController = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { notify } = useApp()

  const [detail, setDetail] = useState<ISupplierOrderDetailResponse>(null)
  const [orderDetail, setOrderDetail] =
    useState<ISupplierOrderReceiveItemDetailResponse>(null)
  const [selectedData, setSelectedData] =
    useState<ISupplierOrderReceiveItemDetailData>(null)
  const [formErrorMsg, setFormErrorMsg] = useState('')

  const [isLoading, setIsLoading] = useToggle(false)
  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const [isModalUpdatePaymentVisible, setIsModalUpdatePaymentVisible] =
    useToggle(false)

  const [
    isModalUpdateBookNumberListVisible,
    setIsModalUpdateBookNumberListVisible,
  ] = useToggle(false)

  const _onFetchDetail = useCallback(
    async (orderId: number) => {
      setIsLoading()
      try {
        const res: AxiosResponse<ISupplierOrderDetailResponse> =
          await fetchSupplierOrderDetail(orderId)
        const resData = res?.data

        setDetail(resData)

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

  const _onFetchOrderDetail = useCallback(
    async (orderDetailId: number) => {
      setIsLoading()
      try {
        const res: AxiosResponse<ISupplierOrderReceiveItemDetailResponse> =
          await fetchSupplierReceiveItemDetail(orderDetailId)
        const resData = res?.data

        setOrderDetail(resData)

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

  const _onSubmitUpdatePaymentStatus = useCallback(
    async (
      orderId: number,
      payload: ISupplierOrderUpdatePaymentRequestPayload,
    ) => {
      setIsSubmitted()

      try {
        const res: AxiosResponse<ISupplierOrderReceiveOrderItemRequestResponse> =
          await requestUpdateSupplierPaymentStatus(orderId, payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()
        setIsModalUpdatePaymentVisible()
        _onRefetch()
      } catch (err) {
        const { message }: AxiosError = err?.response?.data

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

  const _onSubmitUpdateBookNumberList = useCallback(
    async (
      orderItemReceivedDetailId: number,
      payload: ISupplierOrderReceiveItemDetailUpdateBookNumberRequestPayload,
    ) => {
      setIsSubmitted()

      try {
        const res: AxiosResponse<ISupplierOrderReceiveOrderItemRequestResponse> =
          await requestUpdateSupplierOrderBookNumberList(
            orderItemReceivedDetailId,
            payload,
          )

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()
        setIsModalUpdateBookNumberListVisible()
        _onRefetchOrderDetail(parseInt(params?.orderId))
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

  const _onRefetch = () => {
    _onFetchDetail(parseInt(params?.id))
  }

  const _onRefetchOrderDetail = (orderDetailId: number) => {
    _onFetchOrderDetail(orderDetailId)
  }

  const _onHandleReceivedBtn = (record: ISupplierOrderDetailData) => {
    navigate(`/supplier-order/${params?.id}/receive-order-item/${record?.id}`, {
      state: { orderData: record },
    })
  }

  const _onHandleModalUpdatePaymentVisibility = () => {
    setIsModalUpdatePaymentVisible()
  }

  const _onHandleModalUpdateBookNumberListVisibility = () => {
    setIsModalUpdateBookNumberListVisible()
  }

  const _onHandleUpdatePaymentStatus = (
    e: ISupplierOrderUpdatePaymentRequestPayload,
  ) => {
    _onSubmitUpdatePaymentStatus(parseInt(params?.id), e)
  }

  const _onSetFormErrorMsg = (val: string) => setFormErrorMsg(val)

  const _onHandleUpdateBookNumberList = (
    e: ISupplierOrderReceiveItemDetailUpdateBookNumberRequestPayload,
    orderItemReceivedDetailId: number,
  ) => {
    _onSubmitUpdateBookNumberList(orderItemReceivedDetailId, e)
  }

  return {
    detail,
    orderDetail,
    isLoading,
    isModalUpdatePaymentVisible,
    formErrorMsg,
    isSubmitted,
    isModalUpdateBookNumberListVisible,
    selectedData,
    setSelectedData,
    onHandleReceivedBtn: _onHandleReceivedBtn,
    onRefetchDetail: _onRefetch,
    onRefetchOrderDetail: _onRefetchOrderDetail,
    onHandleUpdatePaymentStatus: _onHandleUpdatePaymentStatus,
    onHandleModalUpdatePaymentVisibility: _onHandleModalUpdatePaymentVisibility,
    onSetFormErrorMsg: _onSetFormErrorMsg,
    onHandleModalUpdateBookNumberListVisibility:
      _onHandleModalUpdateBookNumberListVisibility,
    onHandleUpdateBookNumberList: _onHandleUpdateBookNumberList,
  }
}

export default useSupplierDetailController
