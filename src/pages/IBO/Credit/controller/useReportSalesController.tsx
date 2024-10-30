// @ts-nocheck
import { RangePickerProps } from 'antd/es/date-picker'
import { AxiosResponse } from 'axios'
import dayjs from 'dayjs'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { useApp } from 'src/context/app.context'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import { _onExportToExcel } from 'src/helpers/download-file'
import useToggle from 'src/hooks/useToggle'
import { ISelectData } from 'src/models/general.model'
import {
  IReportSalesListMetaResponse,
  IReportSalesListResponse,
  IReportSalesQueryParams,
} from 'src/models/report.model'
import { IListDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import { fetchIBOCreditReceivablesList } from 'src/services/credit.service'
import { fetchIBOReportSalesList } from 'src/services/report.service'
import { transformSalesDataToExcel } from '../helpers/transform-data'

const useReportSalesController = () => {
  const { notify } = useApp()

  const [data, setData] =
    useState<
      IListDataResponse<IReportSalesListResponse, IReportSalesListMetaResponse>
    >(null)

  const [queryParams, setQueryParams] = useState<IReportSalesQueryParams>({
    page: 1,
    limit: 20,
    startDate: dayjs()
      .startOf('month')
      .format(DATETIME_FORMATTER_ENUM?.payloadPrimary),
    endDate: dayjs().format(DATETIME_FORMATTER_ENUM?.payloadPrimary),
    trainingCenterIdList: null,
    totalData: 0,
    search: '',
  })

  const [isLoading, setIsLoading] = useToggle(false)
  const [isFetch, setIsFetch] = useToggle(false)

  const _onFetchList = useCallback(
    async (query?: IReportSalesQueryParams, isFetch?: boolean) => {
      setIsLoading()

      const newQuery = { ...query }
      delete newQuery.totalData

      try {
        const res: AxiosResponse<
          IListDataResponse<
            IReportSalesListResponse,
            IReportSalesListMetaResponse
          >
        > = await fetchIBOCreditReceivablesList(newQuery)

        const { data, pagination, meta } = res?.data ?? {}
        const newData = data?.map((item) => ({
          ...item,
          id:
            item?.orderId.toString() +
            moment(item?.orderDate).format(DATETIME_FORMATTER_ENUM?.primary) +
            item?.itemType +
            item?.itemName,
        }))

        const resData = { data: newData, pagination, meta }

        setData(resData)
        setQueryParams({
          page: res?.data?.pagination?.page,
          limit: res?.data?.pagination?.limit,
          startDate: query?.startDate,
          endDate: query?.endDate,
          trainingCenterIdList: query?.trainingCenterIdList,
          totalData: resData?.meta?.currentTotalData,
          search: query.search,
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

  const _onHandleOrderDateFilter: RangePickerProps['onChange'] = (
    dates,
    dateStrings,
  ) => {
    if (!dates) return
    const newQueryParams = { ...queryParams }

    newQueryParams.startDate = dayjs(dates[0]).format(
      DATETIME_FORMATTER_ENUM?.payloadPrimary,
    )
    newQueryParams.endDate = dayjs(dates[1]).format(
      DATETIME_FORMATTER_ENUM?.payloadPrimary,
    )
    setQueryParams(newQueryParams)
    setIsFetch()
  }

  const _onHandleTrainingCenterListFilter = (e: ISelectData[]) => {
    const newQueryParams = { ...queryParams }
    let trainingCenterIdList: number[] | null = []

    if (e?.length > 0) {
      trainingCenterIdList = e?.map((item) => item?.value) as number[]
    }

    newQueryParams.trainingCenterIdList = trainingCenterIdList

    setQueryParams(newQueryParams)
    setIsFetch()
  }

  const _onHandleDownloadReport = async () => {
    setIsLoading()

    const newQuery = { ...queryParams }
    newQuery.limit = 999

    try {
      const res: AxiosResponse<
        IListDataResponse<
          IReportSalesListResponse,
          IReportSalesListMetaResponse
        >
      > = await fetchIBOReportSalesList(newQuery)

      const { data } = res?.data ?? {}
      const newData = data?.map((item) => ({
        ...item,
        id:
          item?.orderId.toString() +
          moment(item?.orderDate).format(DATETIME_FORMATTER_ENUM?.primary) +
          item?.itemType +
          item?.itemName,
      }))

      const { customHeaders, transformedData } =
        transformSalesDataToExcel(newData)
      const filename = `REPORT_SALES_${queryParams?.startDate}-${queryParams?.endDate}.xlsx`
      _onExportToExcel(transformedData, filename, customHeaders)

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
  }

  useEffect(() => {
    if (isFetch) _onRefetch()
  }, [isFetch])

  return {
    data,
    queryParams,
    setQueryParams,
    isLoading,
    setIsFetch,
    onRefetch: _onRefetch,
    onHandleOrderDateFilter: _onHandleOrderDateFilter,
    onHandleTrainingCenterListFilter: _onHandleTrainingCenterListFilter,
    onHandleDownloadReport: _onHandleDownloadReport,
  }
}

export default useReportSalesController
