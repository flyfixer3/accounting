// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import { errorHandler } from 'src/services/api.service'
import { AxiosResponse } from 'axios'
import { useCallback, useState } from 'react'
import { IIBOSendOrderItemDetailResponse } from 'src/models/order.model'
import { fetchIBOOrderSendDetail } from 'src/services/order.service'

const useOrderSendDetailController = () => {
  const { notify } = useApp()

  const [detailData, setDetailData] =
    useState<IIBOSendOrderItemDetailResponse>()

  const [isFetch, setIsFetch] = useToggle(false)
  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetch = useCallback(
    async (orderDetailId: number, isFetch?: boolean) => {
      setIsLoading()

      try {
        const res: AxiosResponse<IIBOSendOrderItemDetailResponse> =
          await fetchIBOOrderSendDetail(orderDetailId)

        const detail: IIBOSendOrderItemDetailResponse = res?.data
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

  const _onRefetch = async (id: number) => {
    await _onFetch(id, isFetch)
  }

  return {
    detailData,
    isLoading,
    onRefetchDetail: _onRefetch,
  }
}

export default useOrderSendDetailController
