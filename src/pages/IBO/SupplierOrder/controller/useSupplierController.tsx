// @ts-nocheck
import useToggle from 'src/hooks/useToggle'
import { IListDataResponse } from 'src/models/request.model'
import {
  ISupplierOrderListMetaResponse,
  ISupplierOrderListResponse,
} from 'src/models/supplier.model'
import { useCallback, useEffect, useState } from 'react'
import { IQueryParams } from 'src/models/general.model'
import { STATUS_ENUM } from 'src/enums/enums'
import { AxiosResponse } from 'axios'
import { fetchSupplierOrderList } from 'src/services/supplier.service'
import { errorHandler } from 'src/services/api.service'
import { useApp } from 'src/context/app.context'
import { useNavigate } from 'react-router-dom'

const useSupplierController = () => {
  const navigate = useNavigate()
  const { notify } = useApp()

  const [data, setData] =
    useState<
      IListDataResponse<
        ISupplierOrderListResponse,
        ISupplierOrderListMetaResponse
      >
    >(null)
  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 1,
    limit: 20,
    search: '',
    status: STATUS_ENUM?.all,
    totalData: 0,
  })

  const [isLoading, setIsLoading] = useToggle(false)
  const [isFetch, setIsFetch] = useToggle(false)

  const _onFetchList = useCallback(
    async (query?: IQueryParams, isFetch?: boolean) => {
      setIsLoading()
      try {
        const res: AxiosResponse<
          IListDataResponse<
            ISupplierOrderListResponse,
            ISupplierOrderListMetaResponse
          >
        > = await fetchSupplierOrderList(query)
        const resData = res?.data

        setData(resData)
        setQueryParams({
          page: res?.data?.pagination?.page,
          limit: res?.data?.pagination?.limit,
          search: query?.search || '',
          status: query?.status || '',
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

  const _onRefetch = () => {
    _onFetchList(queryParams, isFetch)
  }

  const _handleChangeStatus = async (status: string) => {
    await setQueryParams({ ...queryParams, status })
    setIsFetch()
  }

  const _handleClickAction = (
    type: string,
    id?: number,
    record?: ISupplierOrderListResponse,
  ) => {
    if (type === 'detail') {
      navigate(`/supplier-order/${id}`)
    } else if (type === 'edit') {
      navigate(`/supplier-order/edit/${id}`)
    } else if (type === 'add') {
      navigate('/supplier-order/add')
    }
  }

  useEffect(() => {
    if (isFetch) _onRefetch()
  }, [isFetch])

  return {
    data,
    isLoading,
    isFetch,
    queryParams,
    setQueryParams,
    setIsFetch,
    onRefetch: _onRefetch,
    handleChangeStatus: _handleChangeStatus,
    handleClickAction: _handleClickAction,
  }
}

export default useSupplierController
