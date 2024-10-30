// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import { IDataResponse, IListDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import axios, { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import _ from 'lodash'
import { fetchIBOBookNumberListById } from 'src/services/books.service'
import { ISelectData } from 'src/models/general.model'

const useBookNumberListSearchController = () => {
  const { notify } = useApp()

  const [data, setData] = useState<ISelectData[]>([])

  const [selectedOption, setSelectedOption] = useState<ISelectData[]>(null)
  const [inputValue, setInputValue] = useState<string>(null)

  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetchList = async (bookStockId: number) => {
    setIsLoading()
    try {
      const res: AxiosResponse<IDataResponse<ISelectData[]>> =
        await fetchIBOBookNumberListById(bookStockId)

      const resData = res?.data?.data || []

      setData(resData)

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

  const onChange = (value: string, data: ISelectData[]) => {
    setInputValue(value)
    setSelectedOption(data)
  }

  return {
    onFetchList: _onFetchList,
    data,
    isLoading,
    selectedOption,
    onChange,
  }
}

export default useBookNumberListSearchController
