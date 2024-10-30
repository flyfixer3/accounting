// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import { ISelectData } from 'src/models/general.model'
import { IDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'

import { AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { IParentSelect, IParentSelectResponse } from 'src/models/parent.model'
import { fetchParentSelectList } from 'src/services/parent.service'
import _ from 'lodash'

const useParentAutocompleteController = () => {
  const { notify } = useApp()

  const [parentData, setParentData] = useState<IParentSelect[]>([])

  const [selectedOption, setSelectedOption] = useState<IParentSelect>(null)
  const [inputValue, setInputValue] = useState<string>(null)

  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetchList = useCallback(
    async (abortFetch: AbortController, search?: string) => {
      setIsLoading()
      try {
        const res: AxiosResponse<IDataResponse<IParentSelectResponse>> =
          await fetchParentSelectList(search, abortFetch)

        const resData = res?.data?.data || []

        const options: IParentSelect[] = Array.isArray(resData)
          ? (resData as IParentSelectResponse[]).map((item) => ({
              label: item.name,
              value: item.id.toString(),
            }))
          : []

        setParentData(options)
        setIsLoading()
      } catch (err) {
        const { message } = errorHandler(err)
        notify.error({
          message: 'Error',
          description: message,
          duration: 5,
        })

        setIsLoading()
      }
    },
    [],
  )

  const onSelect = (val: string, data: IParentSelect) => {
    setSelectedOption(data)
    setInputValue(val)
  }

  const onChange = (value: string, data: IParentSelect) => {
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
      setParentData([])
    }
    return function cancel() {
      abortController.abort()
    }
  }, [inputValue])

  return {
    onFetchList: _onFetchList,
    parentData,
    isLoading,
    onSelect,
    selectedOption,
    onChange,
  }
}

export default useParentAutocompleteController
