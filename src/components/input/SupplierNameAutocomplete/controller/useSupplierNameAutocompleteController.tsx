// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import { IListDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import axios, { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import _ from 'lodash'
import { IQueryParams, ISelectData } from 'src/models/general.model'
import { fetchSupplierDataList } from 'src/services/supplier.service'
import {
  ISupplierDataListMetaResponse,
  ISupplierDataResponse,
} from 'src/models/supplier.model'
import { useNavigate } from 'react-router-dom'

const useSupplierNameAutocompleteController = () => {
  const { notify } = useApp()
  const navigate = useNavigate()

  const [data, setData] = useState<ISelectData[]>([])

  const [selectedOption, setSelectedOption] = useState<ISelectData>(null)
  const [inputValue, setInputValue] = useState<string>(null)

  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetchList = async (abortFetch: AbortController, search?: string) => {
    setIsLoading()
    try {
      const queryParams: IQueryParams = {
        page: 1,
        limit: 20,
        search,
        totalData: 0,
      }

      const res: AxiosResponse<
        IListDataResponse<ISupplierDataResponse, ISupplierDataListMetaResponse>
      > = await fetchSupplierDataList(queryParams, abortFetch)

      const resData = res?.data?.data || []

      const options: ISelectData[] = Array.isArray(resData)
        ? (resData as ISupplierDataResponse[]).map((item) => ({
            label: item.supplierName,
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

  const _onAddButtonClick = () => {
    navigate('/supplier/add')
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
    onAddButtonClick: _onAddButtonClick,
  }
}

export default useSupplierNameAutocompleteController
