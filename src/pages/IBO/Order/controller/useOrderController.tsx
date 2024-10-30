// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { STATUS_ENUM } from 'src/enums/enums'
import useToggle from 'src/hooks/useToggle'
import { IListDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import { AxiosError, AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { IQueryParams, ISelectData } from 'src/models/general.model'
import {
  IBookOrderIBORequestPaylaod,
  IBookOrderIBORequestResponse,
} from 'src/models/books.model'
import { requestUpdateBookOrderIBOStatus } from 'src/services/books.service'
import { useNavigate } from 'react-router-dom'
import {
  IIBOOrderListResponse,
  IIBOOrderMetaResponse,
} from 'src/models/order.model'
import { fetchIBOOrderList } from 'src/services/order.service'

const useOrderController = () => {
  const navigate = useNavigate()

  const { notify } = useApp()

  const [data, setData] =
    useState<IListDataResponse<IIBOOrderListResponse, IIBOOrderMetaResponse>>(
      null,
    )
  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 1,
    limit: 20,
    search: '',
    status: STATUS_ENUM?.all,
    totalData: 0,
  })
  const [selectedData, setSelectedData] = useState<IIBOOrderListResponse>(null)
  const [formErrorMsg, setFormErrorMsg] = useState('')

  const [isFetch, setIsFetch] = useToggle(false)
  const [isLoading, setIsLoading] = useToggle(false)
  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const [isModalUpdateStatusVisible, setIsModalUpdateStatusVisible] =
    useToggle(false)

  const statusListOptions: ISelectData[] = [
    { value: 'ACCEPTED', label: 'ACCEPTED' },
    { value: 'REJECTED', label: 'REJECTED' },
  ]

  const _onFetchList = useCallback(
    async (query?: IQueryParams, isFetch?: boolean) => {
      setIsLoading()
      try {
        const res: AxiosResponse<
          IListDataResponse<IIBOOrderListResponse, IIBOOrderMetaResponse>
        > = await fetchIBOOrderList(query)
        const resData = res?.data

        setData(resData)
        setQueryParams({
          page: res?.data?.pagination?.page,
          limit: res?.data?.pagination?.limit,
          status: query?.status || STATUS_ENUM?.all,
          search: query?.search || '',
          totalData: resData?.meta?.currentTotalData,
        })

        setIsLoading()
        isFetch && setIsFetch()
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

  const _onSubmitUpdateStatus = useCallback(
    async (id: number, payload: IBookOrderIBORequestPaylaod) => {
      setIsSubmitted()
      try {
        const res: AxiosResponse<IBookOrderIBORequestResponse> =
          await requestUpdateBookOrderIBOStatus(id, payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()
        isModalUpdateStatusVisible && setIsModalUpdateStatusVisible()
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
    _onFetchList(queryParams, isFetch)
  }

  const _handleChangeStatus = async (status: string) => {
    await setQueryParams({ ...queryParams, status })
    setIsFetch()
  }

  const _handleModalUpdateStatusVisibility = () =>
    setIsModalUpdateStatusVisible()

  const _handleSubmitUpdateStatus = (e: any) => {
    const payload: IBookOrderIBORequestPaylaod = {
      orderBookStatus: e?.status,
    }
    if (e?.rejectReason) {
      payload.rejectReason = e?.rejectReason
    }

    const id = selectedData?.id
    _onSubmitUpdateStatus(id, payload)
  }

  const _onSetSelectedData = (e: IIBOOrderListResponse) => setSelectedData(e)

  const _handleClickAction = (type: string, id: number) => {
    if (type === 'detail') navigate(`/order/${id}`)
  }

  useEffect(() => {
    if (isFetch) _onRefetch()
  }, [isFetch])

  return {
    data,
    isLoading,
    isFetch,
    queryParams,
    isModalUpdateStatusVisible,
    statusListOptions,
    selectedData,
    isSubmitted,
    formErrorMsg,
    setIsFetch,
    setQueryParams,
    onRefetch: _onRefetch,
    handleChangeStatus: _handleChangeStatus,
    handleModalUpdateStatusVisibility: _handleModalUpdateStatusVisibility,
    handleSubmitUpdateStatus: _handleSubmitUpdateStatus,
    onSetSelectedData: _onSetSelectedData,
    handleClickAction: _handleClickAction,
  }
}

export default useOrderController
