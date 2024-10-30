// @ts-nocheck
import useToggle from 'src/hooks/useToggle'
import { ISelectData, ITeacherEduResponse } from 'src/models/general.model'
import { useCallback, useState } from 'react'
import { useApp } from 'src/context/app.context'
import { errorHandler, fetchTeacherEduList } from 'src/services/api.service'
import { AxiosResponse } from 'axios'
import { IDataResponse } from 'src/models/request.model'

const useFetchTeacherEduController = () => {
  const { notify } = useApp()

  const [teacherEduData, setTeacherEduData] = useState<ISelectData[]>([])
  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetchList = useCallback(async () => {
    setIsLoading()
    try {
      const res: AxiosResponse<IDataResponse<ITeacherEduResponse>> =
        await fetchTeacherEduList()

      const resData = res?.data?.data || []

      const options = Array.isArray(resData)
        ? (resData as ITeacherEduResponse[]).map((item) => ({
            label: String(item?.teacherEducation),
            value: item.id,
          }))
        : []

      setTeacherEduData(options)
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
    teacherEduData,
    isLoading,
  }
}

export default useFetchTeacherEduController
