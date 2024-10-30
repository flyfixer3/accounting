// @ts-nocheck
import useToggle from 'src/hooks/useToggle'
import { ISupplierOrderReceiveOrderItemRequestResponse } from 'src/models/supplier.model'
import { useCallback, useState } from 'react'
import { AxiosError, AxiosResponse } from 'axios'
import { errorHandler } from 'src/services/api.service'
import { useApp } from 'src/context/app.context'
import { useNavigate, useParams } from 'react-router-dom'
import { Modal } from 'antd'
import {
  IStockOrderDetailResponse,
  IStockOrderDetailsData,
  IStockOrderReceiveItemDetailResponse,
  IStockOrderSentItemDetailData,
} from 'src/models/stock-order.model'
import {
  fetchStockOrderDetail,
  fetchStockReceiveOrderDetail,
  requestConfirmReceiveOrder,
} from 'src/services/stock-order.service'

const useStockOrderDetailController = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { notify } = useApp()

  const [detail, setDetail] = useState<IStockOrderDetailResponse>(null)
  const [orderDetail, setOrderDetail] =
    useState<IStockOrderReceiveItemDetailResponse>(null)

  const [isLoading, setIsLoading] = useToggle(false)
  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const _onFetchDetail = useCallback(
    async (orderId: number) => {
      setIsLoading()
      try {
        const res: AxiosResponse<IStockOrderDetailResponse> =
          await fetchStockOrderDetail(orderId)
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
        const res: AxiosResponse<IStockOrderReceiveItemDetailResponse> =
          await fetchStockReceiveOrderDetail(orderDetailId)
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

  const _onSubmitConfirmReceiveOrder = useCallback(
    async (orderDetailId: number, sentOrderId: number) => {
      setIsSubmitted()

      try {
        const res: AxiosResponse<ISupplierOrderReceiveOrderItemRequestResponse> =
          await requestConfirmReceiveOrder(orderDetailId, sentOrderId)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()
        _onRefetchOrderDetail(parseInt(params?.orderId))
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

  const _onRefetch = () => {
    _onFetchDetail(parseInt(params?.id))
  }

  const _onRefetchOrderDetail = (orderDetailId: number) => {
    _onFetchOrderDetail(orderDetailId)
  }

  const _onHandleReceivedBtn = (record: IStockOrderDetailsData) => {
    navigate(
      `/stock-order/orders/${params?.id}/receive-order-item/${record?.id}`,
      {
        state: { orderData: record },
      },
    )
  }

  const _onHandleConfirmReceive = (data: IStockOrderSentItemDetailData) => {
    Modal.confirm({
      title: `Are you sure you have received this item?`,
      content:
        'Once you received the item, you can view the received item data in the table below',
      onOk: () =>
        _onSubmitConfirmReceiveOrder(parseInt(params?.orderId), data?.id),
    })
  }

  return {
    detail,
    orderDetail,
    isLoading,
    onHandleReceivedBtn: _onHandleReceivedBtn,
    onRefetchDetail: _onRefetch,
    onRefetchOrderDetail: _onRefetchOrderDetail,
    onHandleConfirmReceive: _onHandleConfirmReceive,
  }
}

export default useStockOrderDetailController
