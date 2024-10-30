// @ts-nocheck
import useToggle from 'src/hooks/useToggle'
import { useCallback, useState } from 'react'
import { AxiosResponse } from 'axios'
import { IDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import { useApp } from 'src/context/app.context'
import _ from 'lodash'
import { fetchCourseLevelUpHistory } from 'src/services/course.service'
import { ICourseLevelUpHistoryResponse } from 'src/models/course.model'

const useStudentCourseHistoryController = () => {
  const { notify } = useApp()

  const [data, setData] = useState<ICourseLevelUpHistoryResponse[]>(null)

  const [isLoading, setIsLoading] = useToggle(false)
  const [isFetch, setIsFetch] = useToggle(false)

  const _onFetch = useCallback(
    async (studentId: number, courseId: number) => {
      setIsLoading()

      try {
        const res: AxiosResponse<
          IDataResponse<ICourseLevelUpHistoryResponse[]>
        > = await fetchCourseLevelUpHistory(studentId, courseId)

        const data = res?.data?.data

        setData(data)

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

  const _onRefetch = async (studentId: number, courseId: number) => {
    await _onFetch(studentId, courseId)
  }

  return {
    isLoading,
    data,
    onRefetch: _onRefetch,
  }
}

export default useStudentCourseHistoryController
