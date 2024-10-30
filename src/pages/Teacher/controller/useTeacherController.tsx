// @ts-nocheck
import { AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from 'src/context/app.context'
import { STATUS_ENUM } from 'src/enums/enums'
import useToggle from 'src/hooks/useToggle'
import { IListDataResponse } from 'src/models/request.model'
import {
  ITeacherData,
  ITeacherListPayload,
  ITeacherMetaResponse,
} from 'src/models/teacher.model'
import { errorHandler } from 'src/services/api.service'
import { fetchTeacherList } from 'src/services/teacher.service'

const useTeacherController = () => {
  const navigate = useNavigate()

  const { onSetBreadcrumbs, notify } = useApp()

  const [teacherData, setTeacherData] =
    useState<IListDataResponse<ITeacherData, ITeacherMetaResponse>>()
  const [queryParams, setQueryParams] = useState<ITeacherListPayload>({
    page: 1,
    limit: 20,
    search: '',
    status: STATUS_ENUM?.all,
    courseId: null,
    totalData: 0,
  })

  const [isLoading, setIsLoading] = useToggle(false)
  const [isFetch, setIsFetch] = useToggle(false)

  const _onFetchList = useCallback(
    async (query?: ITeacherListPayload, isFetch?: boolean) => {
      setIsLoading()
      try {
        const res: AxiosResponse<
          IListDataResponse<ITeacherData, ITeacherMetaResponse>
        > = await fetchTeacherList(query)

        setTeacherData(res?.data)
        setQueryParams({
          page: res?.data?.pagination?.page,
          limit: res?.data?.pagination?.limit,
          status: query?.status || STATUS_ENUM?.all,
          search: query?.search || '',
          courseId: query?.courseId || null,
          totalData: res?.data?.meta?.currentTotalData,
        })

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
    [],
  )

  const _onRefetch = () => {
    _onFetchList(queryParams, isFetch)
  }

  const _handleChangeStatus = async (status: string) => {
    await setQueryParams({ ...queryParams, status })
    setIsFetch()
  }

  const _handleClickAction = (
    type: string,
    id: string,
    record?: ITeacherData,
  ) => {
    if (type === 'detail') {
      navigate(`/teacher/${id}`)
    } else if (type === 'edit') {
      navigate(`/teacher/edit/${id}`)
    }
  }

  useEffect(() => {
    if (isFetch) _onRefetch()
  }, [isFetch])

  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'Teacher',
        path: '/teacher',
      },
    ])
  }, [])

  return {
    onRefetch: _onRefetch,
    onFetchList: _onFetchList,
    teacherData,
    queryParams,
    setQueryParams,
    setIsFetch,
    isLoading,
    handleChangeStatus: _handleChangeStatus,
    handleClickAction: _handleClickAction,
  }
}

export default useTeacherController
