// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { STATUS_ENUM } from 'src/enums/enums'
import useToggle from 'src/hooks/useToggle'
import {
  ICourseVoucherData,
  ICourseVoucherMetaResponse,
} from 'src/models/course-voucher.model'
import { IListDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import { fetchCourseVoucherList } from 'src/services/course-voucer.service'
import { AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { IQueryParams } from 'src/models/general.model'

const useCourseVoucherController = () => {
  const { notify } = useApp()

  const [data, setData] =
    useState<IListDataResponse<ICourseVoucherData, ICourseVoucherMetaResponse>>(
      null,
    )
  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 1,
    limit: 20,
    search: '',
    status: STATUS_ENUM?.all,
    totalData: 0,
  })

  const [isModalOrderVisible, setIsModalOrderVisible] = useToggle(false)

  const [isFetch, setIsFetch] = useToggle(false)
  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetchList = useCallback(
    async (query?: IQueryParams, isFetch?: boolean) => {
      setIsLoading()
      try {
        const res: AxiosResponse<
          IListDataResponse<ICourseVoucherData, ICourseVoucherMetaResponse>
        > = await fetchCourseVoucherList(query)
        const resData = res?.data

        setData(resData)
        setQueryParams({
          page: res?.data?.pagination?.page,
          limit: res?.data?.pagination?.limit,
          status: query?.status || STATUS_ENUM?.all,
          search: query?.search || '',
          totalData: res?.data?.meta?.currentTotalData,
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

  const _handleOrderModalVisibility = () => {
    setIsModalOrderVisible()
  }

  useEffect(() => {
    if (isFetch) _onRefetch()
  }, [isFetch])

  return {
    data,
    isLoading,
    isFetch,
    queryParams,
    isModalOrderVisible,
    setIsFetch,
    setQueryParams,
    onRefetch: _onRefetch,
    handleChangeStatus: _handleChangeStatus,
    handleOrderModalVisibility: _handleOrderModalVisibility,
  }
}

export default useCourseVoucherController
