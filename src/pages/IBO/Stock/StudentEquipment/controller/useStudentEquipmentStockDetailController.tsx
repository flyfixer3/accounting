// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'

import { IQueryParams } from '@src/models/general.model'
import { AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IDataResponse, IListDataResponse } from 'src/models/request.model'
import {
  IEquipmentStockStockDetailListData,
  IEquipmentStockStockDetailListMetaResponse,
  IStudentEquipmentStockIBODetailResponse,
} from 'src/models/student-equipment.model'
import { errorHandler } from 'src/services/api.service'
import {
  fetchIBOEquipmentStockStockDetailList,
  fetchIBOStudentEquipmentStockDetail,
} from 'src/services/student-equipment.service'

const useStudentEquipmentStockDetailController = () => {
  const { notify } = useApp()
  const params = useParams()

  const [detailData, setDetailData] =
    useState<IStudentEquipmentStockIBODetailResponse>()
  const [stockListData, setStockListData] =
    useState<
      IListDataResponse<
        IEquipmentStockStockDetailListData,
        IEquipmentStockStockDetailListMetaResponse
      >
    >(null)

  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 1,
    limit: 20,
    totalData: 0,
  })

  const [isFetch, setIsFetch] = useToggle(false)
  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetch = useCallback(
    async (id: number, isFetch?: boolean) => {
      setIsLoading()

      try {
        const res: AxiosResponse<
          IDataResponse<IStudentEquipmentStockIBODetailResponse>
        > = await fetchIBOStudentEquipmentStockDetail(id)

        const detail: IStudentEquipmentStockIBODetailResponse = res?.data?.data
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

  const _onFetchStockList = useCallback(
    async (id: number, queryParams: IQueryParams) => {
      setIsLoading()

      try {
        const res = await fetchIBOEquipmentStockStockDetailList(id, queryParams)

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

  const _onRefetch = async () => {
    await _onFetch(parseInt(params?.id), isFetch)
  }

  useEffect(() => {
    _onRefetch()
    _onFetchStockList(parseInt(params?.id), queryParams)
  }, [])

  return {
    detailData,
    isLoading,
    stockListData,
    onRefetchDetail: _onRefetch,
    queryParams,
    setQueryParams,
  }
}

export default useStudentEquipmentStockDetailController
