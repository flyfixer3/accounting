// @ts-nocheck
import { fetchCourseLevelUpList } from 'src/services/course.service'
import { useCallback, useState } from 'react'
import { ICourseLevelUpListResponse } from 'src/models/course.model'
import { IDataResponse } from 'src/models/request.model'
import { AxiosResponse } from 'axios'
import useToggle from 'src/hooks/useToggle'
import { errorHandler } from 'src/services/api.service'

import { useApp } from 'src/context/app.context'
import { ISelectData } from 'src/models/general.model'
const useSelectCourseLevelByStudentController = () => {
  const { notify } = useApp()

  const [courseLevelData, setCourseLevelData] = useState<ISelectData[]>()

  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetchCourseLevelList = useCallback(
    async (studentId: number, courseId: number) => {
      setIsLoading()
      try {
        let res: AxiosResponse<IDataResponse<ICourseLevelUpListResponse>> =
          await fetchCourseLevelUpList(studentId, courseId)

        const resData = res?.data?.data
        const options = Array.isArray(resData)
          ? resData.map((item) => ({
              ...item,
              label: String(item?.courseLevelName),
              value: item.id,
            }))
          : []

        setCourseLevelData(options)

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
    [notify],
  )

  return {
    courseLevelData,
    isLoading,
    onFetchCourseLevelList: _onFetchCourseLevelList,
  }
}

export default useSelectCourseLevelByStudentController
