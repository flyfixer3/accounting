// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { STATUS_ENUM, USER_ROLE_ENUM } from 'src/enums/enums'
import useToggle from 'src/hooks/useToggle'
import {
  ISalesInvoiceIBOList,
  ISalesInvoiceList,
  ISalesInvoiceMetaResponse,
} from 'src/models/invoice.model'
import { IListDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import {
  fetchIBOSalesInvoiceList,
  fetchSalesInvoiceList,
} from 'src/services/invoice.service'
import { AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'src/context/auth.context'
import { IQueryParams } from 'src/models/general.model'

const useSalesInvoiceController = () => {
  const navigate = useNavigate()

  const { getUserRole } = useAuth()
  const { notify } = useApp()

  const [salesInvoiceData, setSalesInvoiceData] =
    useState<
      IListDataResponse<
        ISalesInvoiceList | ISalesInvoiceIBOList,
        ISalesInvoiceMetaResponse
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
        let res: AxiosResponse<
          IListDataResponse<
            ISalesInvoiceList | ISalesInvoiceIBOList,
            ISalesInvoiceMetaResponse
          >
        > = null
        if (getUserRole === USER_ROLE_ENUM?.tc) {
          res = await fetchSalesInvoiceList(query)
        } else {
          res = await fetchIBOSalesInvoiceList(query)
        }

        setSalesInvoiceData(res?.data)
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
    [],
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
    id: string,
    record?: ISalesInvoiceList | ISalesInvoiceIBOList,
  ) => {
    if (type === 'detail' && getUserRole === USER_ROLE_ENUM?.tc) {
      navigate(`/sales-invoice/${record?.invoiceNumber}`)
    } else if (type === 'detail' && getUserRole === USER_ROLE_ENUM?.ibo) {
      navigate(`/sales-invoice/ibo/${record?.invoiceNumber}`)
    }
  }

  useEffect(() => {
    if (isFetch) _onRefetch()
  }, [isFetch])

  return {
    onRefetch: _onRefetch,
    onFetchList: _onFetchList,
    salesInvoiceData,
    queryParams,
    setQueryParams,
    setIsFetch,
    isLoading,
    handleChangeStatus: _handleChangeStatus,
    handleClickAction: _handleClickAction,
  }
}

export default useSalesInvoiceController
