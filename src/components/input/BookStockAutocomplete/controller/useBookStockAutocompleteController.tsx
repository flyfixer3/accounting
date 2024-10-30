// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import { IListDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import axios, { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import _ from 'lodash'
import {
  IBookStockIBOListData,
  IBookStockIBOMetaResponse,
} from 'src/models/books.model'
import { fetchIBOBookStockList } from 'src/services/books.service'
import { IQueryParams, ISelectData } from 'src/models/general.model'

const useBookStockAutocompleteController = () => {
  const { notify } = useApp()

  const [data, setData] = useState<ISelectData[]>([])

  const [selectedOption, setSelectedOption] = useState<ISelectData>(null)
  const [inputValue, setInputValue] = useState<string>(null)

  const [isLoading, setIsLoading] = useToggle(false)
  const [isModalAddBookStockVisible, setIsModalAddBookStockVisible] =
    useToggle(false)

  const _onFetchList = async (abortFetch: AbortController, search?: string) => {
    setIsLoading()
    try {
      const queryParams: IQueryParams = {
        page: 1,
        limit: 999,
        search,
        totalData: 0,
      }

      const res: AxiosResponse<
        IListDataResponse<IBookStockIBOListData, IBookStockIBOMetaResponse>
      > = await fetchIBOBookStockList(queryParams, abortFetch)

      const resData = res?.data?.data || []

      const options: ISelectData[] = Array.isArray(resData)
        ? (resData as IBookStockIBOListData[]).map((item) => ({
            label: item.bookName,
            value: item.id,
          }))
        : []

      setData(options)

      setIsLoading()
    } catch (err) {
      if (axios.isCancel(err)) {
        return
      }
      const { message } = errorHandler(err)
      notify.error({
        message: 'Error',
        description: message,
        duration: 5,
      })

      setIsLoading()
    }
  }

  const onSelect = (val: string, data: ISelectData) => {
    setSelectedOption(data)
    setInputValue(val)
  }

  const onChange = (value: string, data: ISelectData) => {
    setInputValue(value)
    setSelectedOption(data)
  }

  const _debounceFetchList = _.debounce(
    async (abortController: AbortController, inputValue: string) => {
      await _onFetchList(abortController, inputValue)
    },
    700,
  )

  const _handleModalAddBookStockVisibility = () =>
    setIsModalAddBookStockVisible()

  useEffect(() => {
    let abortController: AbortController = new AbortController()

    if (inputValue && inputValue?.length >= 3) {
      _debounceFetchList(abortController, inputValue)
    } else {
      setData([])
    }
    return function cancel() {
      abortController.abort()
    }
  }, [inputValue])

  return {
    onFetchList: _onFetchList,
    data,
    isLoading,
    isModalAddBookStockVisible,
    onSelect,
    selectedOption,
    onChange,
    handleModalAddBookStockVisibility: _handleModalAddBookStockVisibility,
  }
}

export default useBookStockAutocompleteController
