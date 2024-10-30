// @ts-nocheck
import { AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from 'src/context/app.context'
import { STATUS_ENUM } from 'src/enums/enums'
import useToggle from 'src/hooks/useToggle'
import {
  IBookStockIBOListData,
  IBookStockIBOMetaResponse,
} from 'src/models/books.model'
import { IQueryParams } from 'src/models/general.model'
import { IListDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import { fetchIBOBookStockList } from 'src/services/books.service'

const useBookStockListController = () => {
  const navigate = useNavigate()

  const { notify } = useApp()

  const [data, setData] =
    useState<
      IListDataResponse<IBookStockIBOListData, IBookStockIBOMetaResponse>
    >(null)
  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 1,
    limit: 20,
    search: '',
    status: STATUS_ENUM?.all,
    totalData: 0,
  })
  const [selectedData, setSelectedData] = useState<IBookStockIBOListData>(null)

  const [isFetch, setIsFetch] = useToggle(false)
  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetchList = useCallback(
    async (query?: IQueryParams, isFetch?: boolean) => {
      setIsLoading()
      try {
        const res: AxiosResponse<
          IListDataResponse<IBookStockIBOListData, IBookStockIBOMetaResponse>
        > = await fetchIBOBookStockList(query)
        const resData = res?.data

        setData(resData)
        setQueryParams({
          page: res?.data?.pagination?.page,
          limit: res?.data?.pagination?.limit,
          status: query?.status || STATUS_ENUM?.all,
          search: query?.search || '',
          totalData: resData?.meta?.currentTotalData,
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
    [notify],
  )

  const _onRefetch = () => {
    _onFetchList(queryParams, isFetch)
  }

  const _handleChangeStatus = async (status: string) => {
    await setQueryParams({ ...queryParams, status })
    setIsFetch()
  }

  const _onSetSelectedData = (e: IBookStockIBOListData) => setSelectedData(e)

  const _handleClickAction = (type: string, id: number) => {
    if (type === 'detail') navigate(`/stock/books/${id}`)
    else if (type === 'edit') navigate(`/stock/books/edit/${id}`)
    else if (type === 'stockDetail') navigate(`/stock/books/${id}/stock`)
  }

  useEffect(() => {
    if (isFetch) _onRefetch()
  }, [isFetch])

  return {
    data,
    isLoading,
    isFetch,
    queryParams,
    selectedData,
    setIsFetch,
    setQueryParams,
    onRefetch: _onRefetch,
    handleChangeStatus: _handleChangeStatus,
    onSetSelectedData: _onSetSelectedData,
    handleClickAction: _handleClickAction,
  }
}

export default useBookStockListController
