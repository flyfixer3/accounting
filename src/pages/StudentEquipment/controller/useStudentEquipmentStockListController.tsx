// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import { IDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import { AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import {
  IStudentEquipmentStockListData,
  IStudentEquipmentStockListPayload,
} from 'src/models/student-equipment.model'
import { fetchStudentEquipmentStockList } from 'src/services/student-equipment.service'

const useStudentEquipmentStockListController = () => {
  const { notify } = useApp()

  const [list, setList] = useState<IStudentEquipmentStockListData[]>(null)
  const [queryParams, setQueryParams] =
    useState<IStudentEquipmentStockListPayload>({
      page: 1,
      limit: 20,
      search: '',
    })
  const [selectedItem, setSelectedItem] =
    useState<IStudentEquipmentStockListData>(null)

  const [isModalAddVisible, setIsModalAddVisible] = useToggle(false)

  const [isLoading, setIsLoading] = useToggle(false)
  const [isFetchList, setIsFetchList] = useToggle(false)

  const _onFetchList = useCallback(
    async (
      query?: IStudentEquipmentStockListPayload,
      isFetchList?: boolean,
    ) => {
      setIsLoading()
      try {
        const res: AxiosResponse<
          IDataResponse<IStudentEquipmentStockListData>
        > = await fetchStudentEquipmentStockList(query)
        const resData = res?.data?.data
        const list: IStudentEquipmentStockListData[] = Array.isArray(resData)
          ? resData?.map((item: IStudentEquipmentStockListData) => ({
              ...item,
              currentStock: parseInt(item?.qty),
            }))
          : []

        setList(list)

        setQueryParams({
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

  const _onHandleModalAddBookVisibility = () => {
    setIsModalAddVisible()
  }

  const _onHandleSelectedData = (e: IStudentEquipmentStockListData) => {
    setSelectedItem(e)
    _onHandleModalAddBookVisibility()
  }

  const _onCheckStock = (equipmentId: number, qtyAddedToCart: number) => {
    const updatedList = list.map((item) => {
      if (item.id === equipmentId) {
        return {
          ...item,
          currentStock: item.currentStock - qtyAddedToCart,
        }
      }
      return item
    })

    setList(updatedList)

    return updatedList
  }

  useEffect(() => {
    if (isFetchList) _onRefetch()
  }, [isFetchList])

  return {
    list,
    isLoading,
    selectedItem,
    isModalAddVisible,
    onChangeSearch: _onChangeSearch,
    onRefetch: _onRefetch,
    onHandleSelectedData: _onHandleSelectedData,
    onHandleModalAddBookVisibility: _onHandleModalAddBookVisibility,
    onCheckStock: _onCheckStock,
  }
}

export default useStudentEquipmentStockListController
