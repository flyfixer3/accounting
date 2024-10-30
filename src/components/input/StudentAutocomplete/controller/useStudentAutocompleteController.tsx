// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import { IDataResponse } from 'src/models/request.model'
import {
  IStudentSelect,
  IStudentSelectResponse,
} from 'src/models/student.model'
import { errorHandler } from 'src/services/api.service'
import { fetchStudentSelectList } from 'src/services/student.service'
import axios, { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import _ from 'lodash'

const useStudentAutocompleteController = () => {
  const { notify } = useApp()

  const [studentData, setStudentData] = useState<IStudentSelect[]>([])

  const [selectedOption, setSelectedOption] = useState<IStudentSelect>(null)
  const [inputValue, setInputValue] = useState<string>(null)

  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetchList = async (abortFetch: AbortController, search?: string) => {
    setIsLoading()
    try {
      const res: AxiosResponse<IDataResponse<IStudentSelectResponse>> =
        await fetchStudentSelectList(search, abortFetch)

      const resData = res?.data?.data || []

      const options: IStudentSelect[] = Array.isArray(resData)
        ? (resData as IStudentSelectResponse[]).map((item) => ({
            label: item.name,
            value: item.id.toString(),
          }))
        : []

      setStudentData(options)

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

  const onSelect = (val: string, data: IStudentSelect) => {
    setSelectedOption(data)
    setInputValue(val)
  }

  const onChange = (value: string, data: IStudentSelect) => {
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
      setStudentData([])
    }
    return function cancel() {
      abortController.abort()
    }
  }, [inputValue])

  return {
    onFetchList: _onFetchList,
    studentData,
    isLoading,
    onSelect,
    selectedOption,
    onChange,
  }
}

export default useStudentAutocompleteController
