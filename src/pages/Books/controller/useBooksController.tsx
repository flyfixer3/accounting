// @ts-nocheck
import {
  IBookData,
  IBookMetaResponse,
  IBookRequestPayload,
  IBookRequestResponse,
} from 'src/models/books.model'
import { IListDataResponse } from 'src/models/request.model'
import { useCallback, useEffect, useState } from 'react'
import { useApp } from 'src/context/app.context'
import { STATUS_ENUM } from 'src/enums/enums'
import useToggle from 'src/hooks/useToggle'
import { AxiosError, AxiosResponse } from 'axios'
import { errorHandler } from 'src/services/api.service'
import {
  fetchBookList,
  requestUpdateBookStatus,
} from 'src/services/books.service'
import { useNavigate } from 'react-router-dom'
import { IQueryParams } from 'src/models/general.model'

const useBooksController = () => {
  const navigate = useNavigate()
  const { onSetBreadcrumbs, notify } = useApp()

  const [bookData, setBookData] =
    useState<IListDataResponse<IBookData, IBookMetaResponse>>()
  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 1,
    limit: 20,
    search: '',
    status: STATUS_ENUM?.all,
    totalData: 0,
  })
  const [selectedData, setSelectedData] = useState<IBookData>(null)

  const [isModalPurchaseVisible, setIsModalPurchaseVisibile] = useToggle(false)

  const [isLoading, setIsLoading] = useToggle(false)
  const [isFetch, setIsFetch] = useToggle(false)
  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const _onFetchList = useCallback(
    async (query?: IQueryParams, isFetch?: boolean) => {
      setIsLoading()
      try {
        const res: AxiosResponse<
          IListDataResponse<IBookData, IBookMetaResponse>
        > = await fetchBookList(query)

        setBookData(res?.data)
        setQueryParams({
          page: res?.data?.pagination?.page,
          limit: res?.data?.pagination?.limit,
          status: query?.status || STATUS_ENUM?.all,
          search: query?.search || '',
          totalData: res?.data?.meta?.currentTotalData,
        })

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
    [],
  )

  const _onUpdateStatus = useCallback(
    async (id: number, payload: IBookRequestPayload) => {
      setIsSubmitted()

      try {
        const res: AxiosResponse<IBookRequestResponse> =
          await requestUpdateBookStatus(id, payload)

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
    },
    [],
  )

  const _onRefetch = () => {
    _onFetchList(queryParams, isFetch)
  }

  const _handleChangeStatus = async (status: string) => {
    await setQueryParams({ ...queryParams, status })
    setIsFetch()
  }

  const _handleModalPurchaseVisibility = () => {
    setIsModalPurchaseVisibile()
  }

  const _handleClickAction = (
    type: string,
    id: string | number,
    record?: IBookData,
  ) => {
    if (type === 'detail') {
      navigate(`/books/${id}`)
    } else if (type === 'edit') {
      const payload: IBookRequestPayload = { book_status: STATUS_ENUM.damaged }
      _onUpdateStatus(id as number, payload)
    } else if (type === 'purchase') {
      setSelectedData(record)
      _handleModalPurchaseVisibility()
    }
  }

  useEffect(() => {
    if (isFetch) _onRefetch()
  }, [isFetch])

  return {
    onSetBreadcrumbs,
    isLoading,
    bookData,
    queryParams,
    setQueryParams,
    isFetch,
    setIsFetch,
    isSubmitted,
    isModalPurchaseVisible,
    selectedData,
    onRefetch: _onRefetch,
    handleChangeStatus: _handleChangeStatus,
    handleClickAction: _handleClickAction,
    onUpdateStatus: _onUpdateStatus,
    handleModalPurchaseVisibility: _handleModalPurchaseVisibility,
  }
}

export default useBooksController
