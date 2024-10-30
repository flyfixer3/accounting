// @ts-nocheck
import { RangePickerProps } from 'antd/es/date-picker'
import { AxiosResponse } from 'axios'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { useApp } from 'src/context/app.context'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import { _onExportToExcel } from 'src/helpers/download-file'
import useToggle from 'src/hooks/useToggle'
import { ISelectData } from 'src/models/general.model'
import {
  IReportStocksListMetaResponse,
  IReportStocksListResponse,
  IReportStocksQueryParams,
} from 'src/models/report.model'
import { IListDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import { fetchIBOReportStocksList } from 'src/services/report.service'
import { transformStockDataToExcel } from '../helpers/transform-data'

const useReportStocksController = () => {
  const { notify } = useApp()

  const [data, setData] =
    useState<
      IListDataResponse<
        IReportStocksListResponse,
        IReportStocksListMetaResponse
      >
    >(null)

  const [queryParams, setQueryParams] = useState<IReportStocksQueryParams>({
    page: 1,
    limit: 20,
    startDate: dayjs()
      .startOf('month')
      .format(DATETIME_FORMATTER_ENUM?.payloadPrimary),
    endDate: dayjs().format(DATETIME_FORMATTER_ENUM?.payloadPrimary),
    itemTypeList: null,
    totalData: 0,
  })

  const [isLoading, setIsLoading] = useToggle(false)
  const [isFetch, setIsFetch] = useToggle(false)

  const _onFetchList = useCallback(
    async (query?: IReportStocksQueryParams, isFetch?: boolean) => {
      setIsLoading()

      const newQuery = { ...query }
      delete newQuery.totalData

      try {
        const res: AxiosResponse<
          IListDataResponse<
            IReportStocksListResponse,
            IReportStocksListMetaResponse
          >
        > = await fetchIBOReportStocksList(newQuery)

        const { data, pagination, meta } = res?.data ?? {}
        const newData = data?.map((item) => ({
          ...item,
          id: item?.itemId.toString() + item?.itemType + item.itemName,
        }))

        const resData = { data: newData, pagination, meta }

        setData(resData)
        setQueryParams({
          page: res?.data?.pagination?.page,
          limit: res?.data?.pagination?.limit,
          startDate: query?.startDate,
          endDate: query?.endDate,
          itemTypeList: query?.itemTypeList,
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

  const _onHandleListFilter = (e: ISelectData[]) => {
    const newQueryParams = { ...queryParams }
    let itemTypeList: number[] | null = []

    if (e?.length > 0) {
      itemTypeList = e?.map((item) => item?.value) as number[]
    }
    console.log(itemTypeList)

    newQueryParams.itemTypeList = itemTypeList

    setQueryParams(newQueryParams)
    setIsFetch()
  }

  const _onHandleDownloadReport = () => {
    const { customHeaders, transformedData } = transformStockDataToExcel(
      data?.data,
    )
    const filename = `REPORT_STOCK_${queryParams?.startDate}-${queryParams?.endDate}.xlsx`
    _onExportToExcel(transformedData, filename, customHeaders)
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
    onHandleListFilter: _onHandleListFilter,
    onHandleDownloadReport: _onHandleDownloadReport,
  }
}

export default useReportStocksController
