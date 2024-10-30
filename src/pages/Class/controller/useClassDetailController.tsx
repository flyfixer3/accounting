// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useToggle from 'src/hooks/useToggle'

import { AxiosResponse } from 'axios'
import { IDataResponse, IDetailPayload } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import { IClassDetailResponse } from 'src/models/class.model'
import { fetchClassDetail } from 'src/services/class.service'

const useClassDetailController = () => {
  const { onSetBreadcrumbs, notify } = useApp()
  const params = useParams()

  const [classDetailData, setClassDetailData] = useState<IClassDetailResponse>()

  const [isFetch, setIsFetch] = useToggle(false)
  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetch = useCallback(
    async (id: string, isFetch?: boolean) => {
      setIsLoading()

      const payload: IDetailPayload = { id }

      try {
        const res: AxiosResponse<IDataResponse<IClassDetailResponse>> =
          await fetchClassDetail(payload)

        const classDetail: IClassDetailResponse = res?.data?.data
        setClassDetailData(classDetail)

        isFetch && setIsFetch()
        setIsLoading()
      } catch (err) {
        const { message } = errorHandler(err)
        notify.error({
          message: 'Error',
          description: message,
          duration: 5,
        })
        isFetch && setIsFetch()
        setIsLoading()
      }
    },
    [notify, setIsFetch],
  )

  const _onRefetch = async () => {
    await _onFetch(params?.id, isFetch)
  }

  useEffect(() => {
    _onRefetch()
  }, [])

  return {
    classDetailData,
    onSetBreadcrumbs,
    params,
    isLoading,
  }
}

export default useClassDetailController
