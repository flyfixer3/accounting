// @ts-nocheck
import { useCallback, useState } from 'react'

import { IListDataResponse } from 'src/models/request.model'
import { AxiosResponse } from 'axios'
import useToggle from 'src/hooks/useToggle'
import { errorHandler } from 'src/services/api.service'

import { useApp } from 'src/context/app.context'
import { ISelectData } from 'src/models/general.model'
import {
  ITeacherData,
  ITeacherListPayload,
  ITeacherMetaResponse,
} from 'src/models/teacher.model'
import { fetchTeacherList } from 'src/services/teacher.service'

const useSelectTeacherController = () => {
  const { notify } = useApp()
  const [data, setData] = useState<ISelectData[]>(null)

  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetchTeacherList = useCallback(
    async (queryParams?: ITeacherListPayload) => {
      setIsLoading()
      try {
        const res: AxiosResponse<
          IListDataResponse<ITeacherData, ITeacherMetaResponse>
        > = await fetchTeacherList(queryParams)
        const resData = res?.data?.data
        const options = Array.isArray(resData)
          ? resData.map((item) => ({
              label: String(item?.teacherName),
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
    },
    [notify],
  )

  const _onRefetch = (courseId: number) => {
    const queryParams: ITeacherListPayload = {
      page: 1,
      limit: 999,
      status: 'ACTIVE',
      courseId,
    }
    _onFetchTeacherList(queryParams)
  }

  return {
    teacherData: data,
    isLoading,
    onRefetch: _onRefetch,
  }
}

export default useSelectTeacherController
