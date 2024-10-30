// @ts-nocheck
import useToggle from 'src/hooks/useToggle'
import { ISelectData, IReligionResponse } from 'src/models/general.model'
import { useCallback, useState } from 'react'
import { useApp } from 'src/context/app.context'
import { errorHandler, fetchReligionList } from 'src/services/api.service'
import { AxiosResponse } from 'axios'
import { IDataResponse } from '@src/models/request.model'

const useFetchReligionController = () => {
  const { notify } = useApp()

  const [religionData, setReligionData] = useState<ISelectData[]>([])
  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetchList = useCallback(async () => {
    setIsLoading()
    try {
      const res: AxiosResponse<IDataResponse<IReligionResponse>> =
        await fetchReligionList()

      const resData = res?.data?.data || []

      const options = Array.isArray(resData)
        ? (resData as IReligionResponse[]).map((item) => ({
            label: item.name,
            value: item.id,
          }))
        : []

      setReligionData(options)
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
  }, [])

  return {
    onFetchList: _onFetchList,
    religionData,
    isLoading,
  }
}

export default useFetchReligionController
