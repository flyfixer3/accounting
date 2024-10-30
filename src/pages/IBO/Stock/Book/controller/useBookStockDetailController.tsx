// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import {
  IBookStockDetailCreateRequestPayload,
  IBookStockDetailUpdateBookNumberRequestPayload,
  IBookStockDetailUpdateStatusRequestPayload,
  IBookStockIBODetailResponse,
  IBookStockIBOStockDetailListData,
  IBookStockIBOStockDetailListMetaResponse,
  IBookStockRequestResponse,
} from 'src/models/books.model'
import { IQueryParams, ISelectData } from 'src/models/general.model'
import { IDataResponse, IListDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import {
  fetchIBOBookStockDetail,
  fetchIBOBookStockDetailList,
  requestUpdateBookNumberIBOBookStockDetail,
  requestUpdateIBOBookStockDetail,
  requestUpdateStatusIBOBookStockDetail,
} from 'src/services/books.service'
import { AxiosError, AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { STATUS_ENUM } from 'src/enums/enums'

const useBookStockDetailController = () => {
  const { notify } = useApp()
  const params = useParams()

  const [detailData, setDetailData] = useState<IBookStockIBODetailResponse>()
  const [selectedData, setSelectedData] =
    useState<IBookStockIBOStockDetailListData>(null)
  const [stockListData, setStockListData] =
    useState<
      IListDataResponse<
        IBookStockIBOStockDetailListData,
        IBookStockIBOStockDetailListMetaResponse
      >
    >(null)

  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 1,
    limit: 20,
    search: '',
    status: STATUS_ENUM?.all,
    totalData: 0,
  })

  const [formErrorMsg, setFormErrorMsg] = useState('')

  const [isFetch, setIsFetch] = useToggle(false)
  const [isLoading, setIsLoading] = useToggle(false)
  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const [isModalAddStockVisible, setIsModalAddStockVisible] = useToggle(false)
  const [
    isModalUpdateStockStatuskVisible,
    setIsModalUpdateStockStatuskVisible,
  ] = useToggle(false)
  const [isModalUpdateBookNumberVisible, setIsModalUpdateBookNumberVisible] =
    useToggle(false)

  const statusListOptions: ISelectData[] = [
    { value: 'AVAILABLE', label: 'AVAILABLE' },
    { value: 'DAMAGED', label: 'DAMAGED' },
  ]

  const stockStatusListOptions: ISelectData[] = [
    { value: 'AVAILABLE', label: 'AVAILABLE' },
    { value: 'DAMAGED', label: 'DAMAGED' },
    { value: 'SOLD', label: 'SOLD' },
  ]

  const _onFetch = useCallback(
    async (id: number) => {
      setIsLoading()

      try {
        const res: AxiosResponse<IDataResponse<IBookStockIBODetailResponse>> =
          await fetchIBOBookStockDetail(id)

        const detail: IBookStockIBODetailResponse = res?.data?.data
        setDetailData(detail)

        setIsLoading()
        setIsFetch()
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
    [notify, setIsFetch],
  )

  const _onFetchStockList = useCallback(
    async (id: number, queryParams: IQueryParams) => {
      setIsLoading()

      try {
        const res: AxiosResponse<
          IListDataResponse<
            IBookStockIBOStockDetailListData,
            IBookStockIBOStockDetailListMetaResponse
          >
        > = await fetchIBOBookStockDetailList(id, queryParams)

        const data = res?.data
        setStockListData(data)

        setQueryParams({
          ...queryParams,
          page: data?.pagination?.page,
          limit: data?.pagination?.limit,
          totalData: data?.meta?.currentTotalData,
        })

        setIsFetch()
        setIsLoading()
      } catch (err) {
        const { message } = errorHandler(err)
        notify.error({
          message: 'Error',
          description: message,
          duration: 5,
        })
        setIsFetch()
        setIsLoading()
      }
    },
    [notify, setIsFetch],
  )

  const _onSubmitAddStock = useCallback(
    async (id: number, payload: IBookStockDetailCreateRequestPayload) => {
      setIsSubmitted()
      try {
        const res: AxiosResponse<IBookStockRequestResponse> =
          await requestUpdateIBOBookStockDetail(id, payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()
        _handleModalAddStockVisibility()
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

  const _onSubmitUpdateStockStatus = useCallback(
    async (id: number, payload: IBookStockDetailUpdateStatusRequestPayload) => {
      setIsSubmitted()
      try {
        const res: AxiosResponse<IBookStockRequestResponse> =
          await requestUpdateStatusIBOBookStockDetail(id, payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()
        setSelectedData(null)
        _handleModalUpdateStockStatusVisibility()
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

  const _onSubmitUpdateBookNumber = useCallback(
    async (
      bookStockDetailId: number,
      payload: IBookStockDetailUpdateBookNumberRequestPayload,
    ) => {
      setIsSubmitted()
      try {
        const res: AxiosResponse<IBookStockRequestResponse> =
          await requestUpdateBookNumberIBOBookStockDetail(
            bookStockDetailId,
            payload,
          )

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()
        setSelectedData(null)
        _handleModalUpdateBookNumberVisibility()
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
    await _onFetch(parseInt(params?.id))
  }

  const _onRefetchList = async (id?: number) => {
    _onFetchStockList(id ? id : detailData?.id, queryParams)
  }

  const _handleModalAddStockVisibility = () => setIsModalAddStockVisible()

  const _handleModalUpdateStockStatusVisibility = () =>
    setIsModalUpdateStockStatuskVisible()

  const _handleModalUpdateBookNumberVisibility = () =>
    setIsModalUpdateBookNumberVisible()

  const _handleSubmitAddStock = (
    payload: IBookStockDetailCreateRequestPayload,
  ) => {
    _onSubmitAddStock(detailData?.id, payload)
  }

  const _handleSubmitUpdateStockStatus = (e: any) => {
    const payload: IBookStockDetailUpdateStatusRequestPayload = {
      bookStatus: e?.status,
    }

    _onSubmitUpdateStockStatus(selectedData?.id, payload)
  }

  const _handleSubmitUpdateBookNumber = (
    e: IBookStockDetailUpdateBookNumberRequestPayload,
    bookStockDetailId: number,
  ) => {
    _onSubmitUpdateBookNumber(bookStockDetailId, e)
  }

  const _onSetFormErrorMsg = (val: string) => setFormErrorMsg(val)

  useEffect(() => {
    if (detailData?.id && isFetch) {
      _onRefetchList()
    }
  }, [detailData?.id, isFetch])

  useEffect(() => {
    _onRefetch()
  }, [])

  return {
    detailData,
    stockListData,
    isLoading,
    formErrorMsg,
    isSubmitted,
    statusListOptions,
    isModalAddStockVisible,
    isModalUpdateStockStatuskVisible,
    queryParams,
    isFetch,
    stockStatusListOptions,
    isModalUpdateBookNumberVisible,
    selectedData,
    setIsFetch,
    setQueryParams,
    setSelectedData,
    setFormErrorMsg,
    onRefetchDetail: _onRefetch,
    onRefetchList: _onRefetchList,
    handleModalAddStockVisibility: _handleModalAddStockVisibility,
    handleSubmitAddStock: _handleSubmitAddStock,
    handleModalUpdateStockStatusVisibility:
      _handleModalUpdateStockStatusVisibility,
    handleSubmitUpdateStockStatus: _handleSubmitUpdateStockStatus,
    handleModalUpdateBookNumberVisibility:
      _handleModalUpdateBookNumberVisibility,
    onSetFormErrorMsg: _onSetFormErrorMsg,
    handleSubmitUpdateBookNumber: _handleSubmitUpdateBookNumber,
  }
}

export default useBookStockDetailController
