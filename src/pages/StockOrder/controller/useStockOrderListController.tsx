// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import { IListDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import { AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { STATUS_ENUM } from 'src/enums/enums'
import { IQueryParams } from 'src/models/general.model'
import {
  IStockOrderListMetaResponse,
  IStockOrderListResponse,
} from 'src/models/stock-order.model'
import { fetchStockOrderList } from 'src/services/stock-order.service'
import { useNavigate } from 'react-router-dom'

const useStockOrderListController = () => {
  const navigate = useNavigate()
  const { notify } = useApp()

  const [data, setData] =
    useState<
      IListDataResponse<IStockOrderListResponse, IStockOrderListMetaResponse>
    >(null)
  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 1,
    limit: 20,
    status: STATUS_ENUM.all,
    totalData: 0,
  })

  const [isLoading, setIsLoading] = useToggle(false)
  const [isFetchList, setIsFetchList] = useToggle(false)

  const _onFetchList = useCallback(
    async (query?: IQueryParams, isFetchList?: boolean) => {
      setIsLoading()
      try {
        const res: AxiosResponse<
          IListDataResponse<
            IStockOrderListResponse,
            IStockOrderListMetaResponse
          >
        > = await fetchStockOrderList(query)
        const resData = res?.data

        setData(resData)

        setQueryParams({
          page: resData?.pagination?.page,
          limit: resData?.pagination?.limit,
          status: query?.status,
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

  const _onRefetch = () => {
    _onFetchList(queryParams, isFetchList)
  }

  const _onChangeStatus = (status: string) => {
    setQueryParams({ ...queryParams, status })
    setIsFetchList()
  }

  const _handleClickAction = (
    type: string,
    id: number,
    record?: IStockOrderListResponse,
  ) => {
    if (type === 'detail') {
      navigate(`/stock-order/orders/${id}`)
    }
  }

  useEffect(() => {
    if (isFetchList) _onRefetch()
  }, [isFetchList])

  return {
    data,
    isLoading,
    queryParams,
    setIsFetchList,
    setQueryParams,
    onChangeStatus: _onChangeStatus,
    onRefetch: _onRefetch,
    handleClickAction: _handleClickAction,
  }
}

export default useStockOrderListController
