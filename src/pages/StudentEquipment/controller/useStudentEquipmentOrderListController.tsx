// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import { IListDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import { AxiosError, AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { STATUS_ENUM } from 'src/enums/enums'
import {
  IStudentEquipmentOrderListData,
  IStudentEquipmentOrderListPayload,
  IStudentEquipmentOrderMetaResponse,
  IStudentEquipmentOrderRequestResponse,
} from 'src/models/student-equipment.model'
import {
  fetchStudentEquipmentOrderList,
  requestUpdateStudentEquipmentOrderStatus,
} from 'src/services/student-equipment.service'

const useStudentEquipmentOrderListController = () => {
  const { notify } = useApp()

  const [list, setList] =
    useState<
      IListDataResponse<
        IStudentEquipmentOrderListData,
        IStudentEquipmentOrderMetaResponse
      >
    >(null)
  const [queryParams, setQueryParams] =
    useState<IStudentEquipmentOrderListPayload>({
      page: 1,
      limit: 20,
      totalPage: 1,
      status: STATUS_ENUM.all,
    })

  const [isLoading, setIsLoading] = useToggle(false)
  const [isFetchList, setIsFetchList] = useToggle(false)
  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const _onFetchList = useCallback(
    async (
      query?: IStudentEquipmentOrderListPayload,
      isFetchList?: boolean,
    ) => {
      setIsLoading()
      try {
        const res: AxiosResponse<
          IListDataResponse<
            IStudentEquipmentOrderListData,
            IStudentEquipmentOrderMetaResponse
          >
        > = await fetchStudentEquipmentOrderList(query)
        const resData = res?.data

        setList(resData)

        setQueryParams({
          page: resData?.pagination?.page,
          limit: resData?.pagination?.limit,
          totalPage: resData?.pagination?.totalPage,
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
      const res: AxiosResponse<IStudentEquipmentOrderRequestResponse> =
        await requestUpdateStudentEquipmentOrderStatus(id)

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
    list,
    isLoading,
    queryParams,
    isSubmitted,
    setQueryParams,
    onChangeStatus: _onChangeStatus,
    onRefetch: _onRefetch,
    onHandleUpdateStatus: _onHandleUpdateStatus,
  }
}

export default useStudentEquipmentOrderListController
