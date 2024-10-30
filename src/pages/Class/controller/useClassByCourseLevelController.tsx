// @ts-nocheck
import { IListDataResponse } from 'src/models/request.model'
import { useCallback, useState } from 'react'
import { useApp } from 'src/context/app.context'
import { STATUS_ENUM } from 'src/enums/enums'
import useToggle from 'src/hooks/useToggle'
import { AxiosResponse } from 'axios'
import { errorHandler } from 'src/services/api.service'
import { IClassData, IClassMetaResponse } from 'src/models/class.model'
import { fetchClassListByCourseLevel } from 'src/services/class.service'
import { useNavigate } from 'react-router-dom'
import { IQueryParams } from 'src/models/general.model'

const useClassByCourseLevelController = () => {
  const navigate = useNavigate()
  const { onSetBreadcrumbs, notify } = useApp()

  const [classData, setClassData] =
    useState<IListDataResponse<IClassData, IClassMetaResponse>>()
  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 1,
    limit: 20,
    search: '',
    status: STATUS_ENUM?.active,
    filter_day: '',
    totalData: 0,
  })
  const [isLoading, setIsLoading] = useToggle(false)
  const [isFetch, setIsFetch] = useToggle(false)

  const _onFetchListByCourseLevel = useCallback(
    async (courseLevelId: number, query?: IQueryParams, isFetch?: boolean) => {
      setIsLoading()
      try {
        const res: AxiosResponse<
          IListDataResponse<IClassData, IClassMetaResponse>
        > = await fetchClassListByCourseLevel(courseLevelId, query)

        setClassData(res?.data)
        setQueryParams({
          page: res?.data?.pagination?.page,
          limit: res?.data?.pagination?.limit,
          status: query?.status || STATUS_ENUM?.all,
          search: query?.search || '',
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

  const _onRefetch = (id: number) => {
    _onFetchListByCourseLevel(id, queryParams, isFetch)
  }

  const _handleChangeStatus = async (status: string) => {
    await setQueryParams({ ...queryParams, status })
    setIsFetch()
  }

  const _handleChangeFilterDay = async (day: string) => {
    await setQueryParams({ ...queryParams, filter_day: day?.toUpperCase() })
    setIsFetch()
  }

  const _handleClickAction = (
    type: string,
    id: string,
    record?: IClassData,
  ) => {
    if (type === 'detail') {
      navigate(`/class/${id}`)
    } else if (type === 'edit') {
      navigate(`/class/edit/${id}`)
    }
  }

  //   useEffect(() => {
  //     if (isFetch) _onRefetch()
  //   }, [isFetch])

  return {
    onSetBreadcrumbs,
    isLoading,
    classData,
    queryParams,
    setQueryParams,
    isFetch,
    setIsFetch,
    onRefetch: _onRefetch,
    handleChangeStatus: _handleChangeStatus,
    handleClickAction: _handleClickAction,
    handleChangeFilterDay: _handleChangeFilterDay,
  }
}

export default useClassByCourseLevelController
