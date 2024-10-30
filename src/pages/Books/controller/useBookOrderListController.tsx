// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import {
  IBookOrderListData,
  IBookOrderMetaResponse,
  IBookOrderRequestResponse,
} from 'src/models/books.model'
import { IListDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import {
  fetchBookOrderList,
  requestUpdateBookOrderStatus,
} from 'src/services/books.service'
import { AxiosError, AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { STATUS_ENUM } from 'src/enums/enums'
import { IQueryParams } from 'src/models/general.model'

const useBookOrderListController = () => {
  const { notify } = useApp()

  const [bookList, setBookList] =
    useState<IListDataResponse<IBookOrderListData, IBookOrderMetaResponse>>(
      null,
    )
  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 1,
    limit: 20,
    status: STATUS_ENUM.all,
    totalData: 0,
  })

  const [isLoading, setIsLoading] = useToggle(false)
  const [isFetchList, setIsFetchList] = useToggle(false)
  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const _onFetchList = useCallback(
    async (query?: IQueryParams, isFetchList?: boolean) => {
      setIsLoading()
      try {
        const res: AxiosResponse<
          IListDataResponse<IBookOrderListData, IBookOrderMetaResponse>
        > = await fetchBookOrderList(query)
        const resData = res?.data

        setBookList(resData)

        setQueryParams({
          page: resData?.pagination?.page,
          limit: resData?.pagination?.limit,
          totalData: resData?.meta?.currentTotalData,
        })

        isFetchList && setIsFetchList()
        setIsLoading()
      } catch (err) {
        const { message } = errorHandler(err)
        notify.error({
          message: 'Error',
          description: message,
          duration: 5,
        })
        isFetchList && setIsFetchList()
        setIsLoading()
      }
    },
    [],
  )

  const _onSubmitUpdateStatus = useCallback(async (id: number) => {
    try {
      const res: AxiosResponse<IBookOrderRequestResponse> =
        await requestUpdateBookOrderStatus(id)

      notify.success({
        message: 'Success',
        description: res?.data?.message,
        duration: 5,
      })

      setIsSubmitted()
    } catch (err) {
      const { message }: AxiosError = err?.response?.data

      notify.error({
        message: 'Error',
        description: message,
        duration: 5,
      })
      setIsSubmitted()
    }
  }, [])

  const _onRefetch = () => {
    _onFetchList(queryParams, isFetchList)
  }

  const _onChangeStatus = (status: string) => {
    setQueryParams({ ...queryParams, status })
    setIsFetchList()
  }

  const _onHandleUpdateStatus = (id: number) => {
    _onSubmitUpdateStatus(id)
  }

  useEffect(() => {
    if (isFetchList) _onRefetch()
  }, [isFetchList])

  return {
    bookList,
    isLoading,
    queryParams,
    isSubmitted,
    setIsFetchList,
    setQueryParams,
    onChangeStatus: _onChangeStatus,
    onRefetch: _onRefetch,
    onHandleUpdateStatus: _onHandleUpdateStatus,
  }
}

export default useBookOrderListController
