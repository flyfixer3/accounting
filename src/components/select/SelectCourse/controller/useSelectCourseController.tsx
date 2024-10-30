// @ts-nocheck
import {
  fetchActiveCourseList,
  fetchCourseLevelActive,
  fetchIBOCourseLevelActive,
} from 'src/services/course.service'
import { useCallback, useState } from 'react'
import {
  ICourseData,
  ICourseLevelData,
  ICourseMetaResponse,
} from 'src/models/course.model'
import { IListDataResponse } from 'src/models/request.model'
import { AxiosResponse } from 'axios'
import useToggle from 'src/hooks/useToggle'
import { errorHandler } from 'src/services/api.service'

import { useApp } from 'src/context/app.context'
import { ISelectData } from 'src/models/general.model'
import { useAuth } from 'src/context/auth.context'
import { USER_ROLE_ENUM } from 'src/enums/enums'

const useSelectCourseController = () => {
  const { notify } = useApp()

  const { getUserRole } = useAuth()

  const [data, setData] = useState<ISelectData[]>(null)
  const [courseLevelData, setCourseLevelData] = useState<ISelectData[]>()

  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetchCourseList = useCallback(async () => {
    setIsLoading()
    try {
      const res: AxiosResponse<
        IListDataResponse<ICourseData, ICourseMetaResponse>
      > = await fetchActiveCourseList()
      const resData = res?.data?.data
      const options = Array.isArray(resData)
        ? resData.map((item) => ({
            ...item,
            label: String(item?.courseName),
            value: item.id,
          }))
        : []

      setData(options)

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

  const _onFetchCourseLevelList = useCallback(
    async (id: number | string) => {
      setIsLoading()
      try {
        let res: AxiosResponse<
          IListDataResponse<ICourseLevelData, ICourseMetaResponse>
        > = null

        if (getUserRole === USER_ROLE_ENUM?.tc) {
          res = await fetchCourseLevelActive(id)
        } else {
          res = await fetchIBOCourseLevelActive(id)
        }

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
    onFetchCourseList: _onFetchCourseList,
    courseData: data,
    courseLevelData,
    isLoading,
    onFetchCourseLevelList: _onFetchCourseLevelList,
  }
}

export default useSelectCourseController
