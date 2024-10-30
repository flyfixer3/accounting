// @ts-nocheck
import { AxiosError, AxiosResponse } from 'axios'
import dayjs from 'dayjs'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from 'src/context/app.context'
import { DATETIME_FORMATTER_ENUM, STATUS_ENUM } from 'src/enums/enums'
import useToggle from 'src/hooks/useToggle'
import { ISelectData } from 'src/models/general.model'
import {
  ISupplierOrderCreateFormData,
  ISupplierOrderCreateOrderDetailFormData,
  ISupplierOrderCreateOrderDetailPayload,
  ISupplierOrderCreateRequestPayload,
  ISupplierOrderDetailResponse,
} from 'src/models/supplier.model'
import { requestCreateSupplierOrder } from 'src/services/supplier.service'

const useSupplierOrderAddController = () => {
  const navigate = useNavigate()
  const { notify } = useApp()

  const [orderDetailList, setOrderDetailList] = useState<
    ISupplierOrderCreateOrderDetailFormData[]
  >([])
  const [formErrorMsg, setFormErrorMsg] = useState<string>('')

  const [isLoading, setIsLoading] = useToggle(false)
  const [isSubmitted, setIsSubmitted] = useToggle(false)
  const [isModalAddOrderDetailVisibile, setIsModalAddOrderDetailVisible] =
    useToggle(false)

  const statusListOptions: ISelectData[] = [
    { value: STATUS_ENUM?.paid, label: STATUS_ENUM?.paid },
    { value: STATUS_ENUM?.unpaid, label: STATUS_ENUM?.unpaid },
  ]

  const _onSubmitAddSupplierOrder = useCallback(
    async (payload: ISupplierOrderCreateRequestPayload) => {
      setIsSubmitted()

      try {
        const res: AxiosResponse<ISupplierOrderDetailResponse> =
          await requestCreateSupplierOrder(payload)

        notify.success({
          message: 'Success',
          description: 'Success Create Supplier Order',
          duration: 5,
        })

        setIsSubmitted()

        navigate(`/supplier-order/${res?.data?.id}`)
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

  const _handleModalAddOrderDetailVisibility = () =>
    setIsModalAddOrderDetailVisible()

  const _onSetOrderDetailList = (
    e: ISupplierOrderCreateOrderDetailFormData,
  ) => {
    const newOrderDetailList = [...orderDetailList]
    const newFormData = { ...e }
    newFormData.id = orderDetailList.length + 1

    newOrderDetailList.push(newFormData)
    setOrderDetailList(newOrderDetailList)

    _handleModalAddOrderDetailVisibility()
  }

  const _onRemoveOrderDetail = (orderDetailId: number) => {
    const newOrderDetailList = [...orderDetailList]
    const findIdx = newOrderDetailList?.findIndex((item) => {
      return item?.id === orderDetailId
    })

    if (findIdx > -1) {
      newOrderDetailList.splice(findIdx, 1)
    }

    setOrderDetailList(newOrderDetailList)
  }

  const _handleSubmitOrderAdd = (e: ISupplierOrderCreateFormData) => {
    const orderDetailListPayload: ISupplierOrderCreateOrderDetailPayload[] =
      e.orderDetailList.map((item) => {
        return {
          itemId: item.itemIdNamePair.itemId,
          itemName: item.itemIdNamePair.itemName,
          itemType: item.itemType,
          price: parseFloat(item.price).toFixed(2),
          qty: item.qty,
        }
      })

    const newPayload: ISupplierOrderCreateRequestPayload = {
      supplierId: e?.supplierId,
      paymentStatus: e?.paymentStatus,
      orderDate: dayjs(e?.orderDate).format(
        DATETIME_FORMATTER_ENUM?.payloadPrimary,
      ),
      orderDetailList: orderDetailListPayload,
    }

    if (e?.paymentStatus === STATUS_ENUM.paid) {
      newPayload.subaccountId = e?.subaccountId
    }

    _onSubmitAddSupplierOrder(newPayload)
  }

  return {
    isLoading,
    isSubmitted,
    orderDetailList,
    statusListOptions,
    isModalAddOrderDetailVisibile,
    formErrorMsg,
    setFormErrorMsg,
    handleModalAddOrderDetailVisibility: _handleModalAddOrderDetailVisibility,
    onSetOrderDetailList: _onSetOrderDetailList,
    onRemoveOrderDetail: _onRemoveOrderDetail,
    handleSubmitOrderAdd: _handleSubmitOrderAdd,
  }
}

export default useSupplierOrderAddController
