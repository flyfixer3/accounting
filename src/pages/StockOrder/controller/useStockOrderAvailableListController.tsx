// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import { IDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import { AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { fetchStockOrderAvailableList } from 'src/services/stock-order.service'
import {
  IStockOrderAvailableListData,
  IStockOrderAvailableListQueryParams,
} from 'src/models/stock-order.model'
import { STATUS_ENUM } from 'src/enums/enums'
import { ISelectData } from '@src/models/general.model'

const useStockOrderAvailableListController = () => {
  const { notify } = useApp()

  const [list, setList] = useState<IStockOrderAvailableListData[]>(null)
  const [queryParams, setQueryParams] =
    useState<IStockOrderAvailableListQueryParams>({
      itemType: STATUS_ENUM?.all,
      search: '',
    })
  const [selectedItem, setSelectedItem] =
    useState<IStockOrderAvailableListData>(null)

  const [isModalAddItemVisible, setIsModalAddItemVisible] = useToggle(false)

  const [isLoading, setIsLoading] = useToggle(false)
  const [isFetchList, setIsFetchList] = useToggle(false)

  const itemTypeList: ISelectData[] = [
    { value: 'BOOK', label: 'Book' },
    { value: 'COURSE_VOUCHER', label: 'Course Voucher' },
    { value: 'EQUIPMENT', label: 'Equipment' },
  ]

  const _onFetchList = useCallback(
    async (
      query?: IStockOrderAvailableListQueryParams,
      isFetchList?: boolean,
    ) => {
      setIsLoading()
      try {
        const res: AxiosResponse<IDataResponse<IStockOrderAvailableListData>> =
          await fetchStockOrderAvailableList(query)
        const resData = res?.data?.data
        const list: IStockOrderAvailableListData[] = Array.isArray(resData)
          ? resData?.map((item: IStockOrderAvailableListData) => ({
              ...item,
              localId: `${item?.itemType}-${item?.itemId}`,
            }))
          : []

        setList(list)

        setQueryParams({
          itemType: query?.itemType || '',
          search: query?.search || '',
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

  const _onChangeSearch = (search: string) => {
    setQueryParams({ ...queryParams, search })
    setIsFetchList()
  }

  const _onHandleModalAddItemVisibility = () => {
    setIsModalAddItemVisible()
  }

  const _onHandleSelectedData = (e: IStockOrderAvailableListData) => {
    setSelectedItem(e)
    _onHandleModalAddItemVisibility()
  }

  const _onChangeType = (e: string) => {
    setQueryParams({ ...queryParams, itemType: e })
    setIsFetchList()
  }

  useEffect(() => {
    if (isFetchList) _onRefetch()
  }, [isFetchList])

  return {
    itemTypeList,
    list,
    isLoading,
    selectedItem,
    isModalAddItemVisible,
    queryParams,
    onChangeSearch: _onChangeSearch,
    onRefetch: _onRefetch,
    onHandleSelectedData: _onHandleSelectedData,
    onHandleModalAddItemVisibility: _onHandleModalAddItemVisibility,
    onChangeType: _onChangeType,
  }
}

export default useStockOrderAvailableListController
