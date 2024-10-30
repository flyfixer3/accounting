// @ts-nocheck
import { AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useApp } from 'src/context/app.context'
import { STATUS_ENUM } from 'src/enums/enums'
import useToggle from 'src/hooks/useToggle'
import { IListDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'

import { useNavigate } from 'react-router-dom'
import { IQueryParams } from 'src/models/general.model'
import {
  IStudentEquipmentStockIBOListData,
  IStudentEquipmentStockIBOMetaResponse,
} from 'src/models/student-equipment.model'
import { fetchIBOStudentEquipmentStockList } from 'src/services/student-equipment.service'

const useStudentEquipmentStockListController = () => {
  const navigate = useNavigate()

  const { notify } = useApp()

  const [data, setData] =
    useState<
      IListDataResponse<
        IStudentEquipmentStockIBOListData,
        IStudentEquipmentStockIBOMetaResponse
      >
    >(null)
  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 1,
    limit: 20,
    search: '',
    status: STATUS_ENUM?.all,
    totalData: 0,
  })

  const [isFetch, setIsFetch] = useToggle(false)
  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetchList = useCallback(
    async (query?: IQueryParams, isFetch?: boolean) => {
      setIsLoading()
      try {
        const res: AxiosResponse<
          IListDataResponse<
            IStudentEquipmentStockIBOListData,
            IStudentEquipmentStockIBOMetaResponse
          >
        > = await fetchIBOStudentEquipmentStockList(query)
        const resData = res?.data

        setData(resData)
        setQueryParams({
          page: res?.data?.pagination?.page,
          limit: res?.data?.pagination?.limit,
          status: query?.status || STATUS_ENUM?.all,
          search: query?.search || '',
          totalData: res?.data?.meta?.currentTotalData,
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

  const _handleClickAction = (type: string, id: number) => {
    if (type === 'detail') navigate(`/stock/student-equipment/${id}`)
    else if (type === 'edit') navigate(`/stock/student-equipment/edit/${id}`)
  }

  useEffect(() => {
    if (isFetch) _onRefetch()
  }, [isFetch])

  return {
    data,
    isLoading,
    isFetch,
    queryParams,
    setIsFetch,
    setQueryParams,
    onRefetch: _onRefetch,
    handleChangeStatus: _handleChangeStatus,
    handleClickAction: _handleClickAction,
  }
}

export default useStudentEquipmentStockListController
