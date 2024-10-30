// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import { ISelectData } from 'src/models/general.model'
import { IDataResponse } from 'src/models/request.model'
import { errorHandler, fetchSchoolSelectList } from 'src/services/api.service'
import { AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import {
  ISchoolRequestResponse,
  ISchoolResponse,
} from 'src/models/school.model'

const useSelectSchoolController = () => {
  const { notify } = useApp()

  const [schoolData, setSchoolData] = useState<ISelectData[]>([])
  const [isLoading, setIsLoading] = useToggle(false)
  const [isAddSchoolModalVisible, setIsAddSchoolModalVisible] = useToggle(false)
  const [isFetch, setIsFetch] = useToggle(true)

  const _onFetchList = useCallback(async () => {
    setIsLoading()
    try {
      const res: AxiosResponse<IDataResponse<ISchoolRequestResponse>> =
        await fetchSchoolSelectList()

      const resData = res?.data?.data || []

      const options = Array.isArray(resData)
        ? (resData as ISchoolResponse[]).map((item) => ({
            label: item.name,
            value: item.id,
          }))
        : []

      setSchoolData(options)
      setIsLoading()
      isFetch && setIsFetch()
    } catch (err) {
      const { message } = errorHandler(err)
      notify.error({
        message: 'Error',
        description: message,
        duration: 5,
      })

      setIsLoading()
      isFetch && setIsFetch()
    }
  }, [])

  const _onHandleAddSchoolModalVisibility = (isCreate?: boolean) => {
    setIsAddSchoolModalVisible()
    if (isCreate) setIsFetch()
  }

  useEffect(() => {
    if (isFetch) _onFetchList()
  }, [isFetch])

  return {
    isLoading,
    schoolData,
    isAddSchoolModalVisible,
    onHandleAddSchoolModalVisibility: _onHandleAddSchoolModalVisibility,
  }
}

export default useSelectSchoolController
