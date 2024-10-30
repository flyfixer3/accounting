// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { useCallback, useEffect, useState } from 'react'
import useToggle from 'src/hooks/useToggle'
import { AxiosResponse } from 'axios'
import { IListDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import {
  IDiscountVoucherData,
  IDiscountVoucherMetaResponse,
} from 'src/models/discount-voucher.model'
import { fetchDiscountVoucherList } from 'src/services/discount-voucher.service'
import { STATUS_ENUM } from 'src/enums/enums'
import { IQueryParams } from '@src/models/general.model'

const useDiscountVoucherController = () => {
  const { notify } = useApp()

  const [data, setData] =
    useState<
      IListDataResponse<IDiscountVoucherData, IDiscountVoucherMetaResponse>
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
          IListDataResponse<IDiscountVoucherData, IDiscountVoucherMetaResponse>
        > = await fetchDiscountVoucherList(query)
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
  }
}

export default useDiscountVoucherController
