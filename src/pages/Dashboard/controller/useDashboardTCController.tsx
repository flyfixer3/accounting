// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import { IDashboardMetaResponse } from 'src/models/dashboard.model'
import { IDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import { fetchDashboardMetaData } from 'src/services/dashboard.service'
import { AxiosResponse } from 'axios'
import { useCallback, useState } from 'react'

const useDashboardTCController = () => {
  const { notify } = useApp()

  const [metaData, setMetaData] = useState<IDashboardMetaResponse>()

  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetch = useCallback(async () => {
    setIsLoading()
    try {
      const res: AxiosResponse<IDataResponse<IDashboardMetaResponse>> =
        await fetchDashboardMetaData()
      const resData = res?.data?.data

      setMetaData(resData)

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
  }, [notify])

  const _onRefetch = () => {
    _onFetch()
  }

  return {
    metaData,
    isLoading,
    onRefetch: _onRefetch,
  }
}

export default useDashboardTCController
