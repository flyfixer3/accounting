// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import useToggle from 'src/hooks/useToggle'

import { AxiosResponse } from 'axios'
import { IDataResponse, IDetailPayload } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import {
  IBookOrderDetailData,
  IBookOrderDetailResponse,
} from 'src/models/books.model'
import { fetchBookOrderDetail } from 'src/services/books.service'

const useBookOrderDetailController = () => {
  const { notify } = useApp()
  const params = useParams()

  const [bookOrderDetailData, setBookOrderDetailData] =
    useState<IBookOrderDetailResponse>()

  const [isFetch, setIsFetch] = useToggle(false)
  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetch = useCallback(
    async (id: string, isFetch?: boolean) => {
      setIsLoading()

      const payload: IDetailPayload = { id }

      try {
        const res: AxiosResponse<IDataResponse<IBookOrderDetailResponse>> =
          await fetchBookOrderDetail(payload)

        const bookDetail: IBookOrderDetailResponse = res?.data?.data
        setBookOrderDetailData(bookDetail)

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

  const _onRefetch = async () => {
    await _onFetch(params?.id, isFetch)
  }

  const _getTotalQtyAndPrice = useMemo(() => {
    let totalQty = 0
    let totalPrice = 0

    bookOrderDetailData?.orderBookDetails?.forEach(
      (item: IBookOrderDetailData) => {
        const qty: number = parseInt(item?.qty)
        const price: number = parseFloat(item?.book?.bookPrice)

        totalQty += qty

        totalPrice += qty * price
      },
    )

    return {
      totalQty,
      totalPrice,
    }
  }, [bookOrderDetailData])

  useEffect(() => {
    _onRefetch()
  }, [])

  return {
    bookOrderDetailData,

    params,
    isLoading,
    getTotalQtyAndPrice: _getTotalQtyAndPrice,
  }
}

export default useBookOrderDetailController
