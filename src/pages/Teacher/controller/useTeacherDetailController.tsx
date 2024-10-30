// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useToggle from 'src/hooks/useToggle'
import {
  ITeacherDetailPayload,
  ITeacherDetailResponse,
} from '@src/models/teacher.model'
import { AxiosResponse } from 'axios'
import { IDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import { fetchTeacherDetail } from 'src/services/teacher.service'

const useTeacherDetailController = () => {
  const { onSetBreadcrumbs, notify } = useApp()
  const params = useParams()

  const [teacherDetailData, setTeacherDetailData] =
    useState<ITeacherDetailResponse>()

  const [isFetch, setIsFetch] = useToggle(false)
  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetch = useCallback(
    async (id: string, isFetch?: boolean) => {
      setIsLoading()

      const payload: ITeacherDetailPayload = { id }

      try {
        const res: AxiosResponse<IDataResponse<ITeacherDetailResponse>> =
          await fetchTeacherDetail(payload)

        const teacherDetail: ITeacherDetailResponse = res?.data?.data
        setTeacherDetailData(teacherDetail)

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
    teacherDetailData,
    onSetBreadcrumbs,
    params,
  }
}

export default useTeacherDetailController
