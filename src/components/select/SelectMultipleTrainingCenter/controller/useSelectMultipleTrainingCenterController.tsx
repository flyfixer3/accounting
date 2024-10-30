// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import { IListDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import axios, { AxiosResponse } from 'axios'
import { useState } from 'react'
import _ from 'lodash'
import { IQueryParams, ISelectData } from 'src/models/general.model'
import { fetchTrainingCenterUserList } from 'src/services/user.service'
import {
  IUserTrainingCenterData,
  IUserTrainingCenterMetaResponse,
} from 'src/models/user.model'

const useSelectMultipleTrainingCenterController = () => {
  const { notify } = useApp()

  const [data, setData] = useState<ISelectData[]>([])

  const [selectedOption, setSelectedOption] = useState<ISelectData[]>(null)
  const [inputValue, setInputValue] = useState<string>(null)

  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetchList = async () => {
    setIsLoading()
    try {
      const queryParams: IQueryParams = {
        page: 1,
        limit: 20,

        totalData: 0,
      }

      const res: AxiosResponse<
        IListDataResponse<
          IUserTrainingCenterData,
          IUserTrainingCenterMetaResponse
        >
      > = await fetchTrainingCenterUserList(queryParams)

      const resData = res?.data?.data || []

      const options: ISelectData[] = Array.isArray(resData)
        ? (resData as IUserTrainingCenterData[]).map((item) => ({
            label: item.trainingCenterName,
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

export default useSelectMultipleTrainingCenterController
