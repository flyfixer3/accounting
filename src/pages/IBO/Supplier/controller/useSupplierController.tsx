// @ts-nocheck
import useToggle from 'src/hooks/useToggle'
import { IListDataResponse } from 'src/models/request.model'
import {
  ISupplierDataListMetaResponse,
  ISupplierDataResponse,
} from 'src/models/supplier.model'
import { useCallback, useEffect, useState } from 'react'
import { IQueryParams } from 'src/models/general.model'
import { STATUS_ENUM } from 'src/enums/enums'
import { AxiosResponse } from 'axios'
import { fetchSupplierDataList } from 'src/services/supplier.service'
import { errorHandler } from 'src/services/api.service'
import { useApp } from 'src/context/app.context'
import { useNavigate } from 'react-router-dom'

const useSupplierController = () => {
  const navigate = useNavigate()
  const { notify } = useApp()

  const [data, setData] =
    useState<
      IListDataResponse<ISupplierDataResponse, ISupplierDataListMetaResponse>
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
          IListDataResponse<ISupplierDataResponse, ISupplierDataListMetaResponse>
        > = await fetchSupplierDataList(query)
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
    [notify, setIsFetch, setIsLoading],
  )

  const _handleClickAction = (
    type: string,
    id?: number,
    record?: ISupplierDataResponse,
  ) => {
    if (type === 'detail') {
      navigate(`/supplier/detail/${id}`)
    }
    else if (type === 'add') {
      navigate('/supplier/add')
    }
    else if (type === 'edit') {
      navigate(`/supplier/edit/${id}`)
    }
  }

  useEffect(() => {
    if (isFetch) _onFetchList(queryParams)
  }, [isFetch])

  return {
    data,
    isLoading,
    isFetch,
    queryParams,
    setQueryParams,
    setIsFetch,
    handleClickAction: _handleClickAction,
  }
}

export default useSupplierController
