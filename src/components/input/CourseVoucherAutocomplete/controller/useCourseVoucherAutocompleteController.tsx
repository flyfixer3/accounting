// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import { errorHandler } from 'src/services/api.service'
import axios, { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import _ from 'lodash'
import { ISelectData } from 'src/models/general.model'
import { fetchIBOCourseVoucherSearchStock } from 'src/services/course-voucer.service'
import { ICourseVoucherIBOStockSearchData } from 'src/models/course-voucher.model'
import { IDataResponse } from '@src/models/request.model'

const useCourseVoucherAutocompleteController = () => {
  const { notify } = useApp()

  const [data, setData] = useState<ISelectData[]>([])

  const [selectedOption, setSelectedOption] = useState<ISelectData>(null)
  const [inputValue, setInputValue] = useState<string>(null)

  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetchList = async (abortFetch: AbortController, search?: string) => {
    setIsLoading()
    try {
      const res: AxiosResponse<
        IDataResponse<ICourseVoucherIBOStockSearchData>
      > = await fetchIBOCourseVoucherSearchStock(search, abortFetch)

      const resData = res?.data.data || []

      const options: ISelectData[] = Array.isArray(resData)
        ? (resData as ICourseVoucherIBOStockSearchData[]).map((item) => ({
            label: item.itemName,
            value: item.itemId,
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
    onSelect,
    selectedOption,
    onChange,
  }
}

export default useCourseVoucherAutocompleteController
