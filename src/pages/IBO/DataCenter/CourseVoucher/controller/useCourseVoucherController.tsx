// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import {
  ICourseVoucherIBOPriceListData,
  ICourseVoucherIBOPriceListMetaResponse,
  ICourseVoucherIBOPriceRequestPayload,
  ICourseVoucherIBOPriceRequestResponse,
} from 'src/models/course-voucher.model'
import { IQueryParams } from 'src/models/general.model'
import { IListDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import {
  fetchIBOCourseVoucherPriceList,
  requestIBOUpdateCourseVoucherPrice,
} from 'src/services/course-voucer.service'
import { AxiosError, AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'

const useCourseVoucherController = () => {
  const { notify } = useApp()

  const [data, setData] =
    useState<
      IListDataResponse<
        ICourseVoucherIBOPriceListData,
        ICourseVoucherIBOPriceListMetaResponse
      >
    >(null)
  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 1,
    limit: 20,
    search: '',
    totalData: 0,
  })
  const [selectedData, setSelectedData] =
    useState<ICourseVoucherIBOPriceListData>(null)
  const [formErrorMsg, setFormErrorMsg] = useState('')

  const [isFetch, setIsFetch] = useToggle(false)
  const [isLoading, setIsLoading] = useToggle(false)
  const [isSubmitted, setIsSubmitted] = useToggle(false)
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useToggle(false)

  const _onFetchList = useCallback(
    async (query?: IQueryParams, isFetch?: boolean) => {
      setIsLoading()
      try {
        const res: AxiosResponse<
          IListDataResponse<
            ICourseVoucherIBOPriceListData,
            ICourseVoucherIBOPriceListMetaResponse
          >
        > = await fetchIBOCourseVoucherPriceList(query)
        const resData = res?.data

        setData(resData)
        setQueryParams({
          page: res?.data?.pagination?.page,
          limit: res?.data?.pagination?.limit,
          search: query?.search || '',
          totalData: resData?.meta?.currentTotalData,
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
    [notify],
  )

  const _onSubmitUpdateData = useCallback(
    async (id: number, payload: ICourseVoucherIBOPriceRequestPayload) => {
      setIsSubmitted()
      try {
        const res: AxiosResponse<ICourseVoucherIBOPriceRequestResponse> =
          await requestIBOUpdateCourseVoucherPrice(id, payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()
        _onRefetch()
        setIsModalUpdateVisible()
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

  const _handleModalUpdateVisibility = () => setIsModalUpdateVisible()

  const _handleSubmitUpdateData = (e: any) => {
    const payload: ICourseVoucherIBOPriceRequestPayload = {
      price: parseFloat(e?.price).toFixed(2),
    }

    const id = selectedData?.id
    _onSubmitUpdateData(id, payload)
  }

  const _onSetSelectedData = (e: ICourseVoucherIBOPriceListData) =>
    setSelectedData(e)

  const _onSetFormErrorMsg = (val: string) => {
    setFormErrorMsg(val)
  }

  useEffect(() => {
    if (isFetch) _onRefetch()
  }, [isFetch])

  return {
    data,
    isLoading,
    isFetch,
    queryParams,
    isModalUpdateVisible,
    selectedData,
    isSubmitted,
    formErrorMsg,
    setIsFetch,
    setQueryParams,
    setFormErrorMsg,
    onRefetch: _onRefetch,
    handleModalUpdateVisibility: _handleModalUpdateVisibility,
    handleSubmitUpdateData: _handleSubmitUpdateData,
    onSetSelectedData: _onSetSelectedData,
    onSetFormErrorMsg: _onSetFormErrorMsg,
  }
}

export default useCourseVoucherController
