// @ts-nocheck
import { AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import {
  IBookStockIBODetailResponse,
  IBookStockIBOStockDetailListData,
  IBookStockStockDetailListData,
  IBookStockStockDetailListMetaResponse,
} from 'src/models/books.model'
import { IQueryParams } from 'src/models/general.model'
import { IDataResponse, IListDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import {
  fetchIBOBookStockDetail,
  fetchIBOBookStockStockDetailList,
} from 'src/services/books.service'

const useBookStockStockDetailController = () => {
  const { notify } = useApp()
  const params = useParams()

  const [detailData, setDetailData] = useState<IBookStockIBODetailResponse>()
  const [selectedData, setSelectedData] =
    useState<IBookStockIBOStockDetailListData>(null)
  const [stockListData, setStockListData] =
    useState<
      IListDataResponse<
        IBookStockStockDetailListData,
        IBookStockStockDetailListMetaResponse
      >
    >(null)

  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 1,
    limit: 20,
    totalData: 0,
  })

  const [formErrorMsg, setFormErrorMsg] = useState('')

  const [isFetch, setIsFetch] = useToggle(false)
  const [isLoading, setIsLoading] = useToggle(false)

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
        const res = await fetchIBOBookStockStockDetailList(id, queryParams)

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
    await _onFetch(parseInt(params?.id))
  }

  const _onRefetchList = async (id?: number) => {
    _onFetchStockList(id ? id : detailData?.id, queryParams)
  }

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
    queryParams,
    isFetch,
    selectedData,
    setIsFetch,
    setQueryParams,
    setSelectedData,
    setFormErrorMsg,
    onRefetchDetail: _onRefetch,
    onRefetchList: _onRefetchList,
  }
}

export default useBookStockStockDetailController
