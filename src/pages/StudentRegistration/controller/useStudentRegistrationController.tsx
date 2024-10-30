// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { STATUS_ENUM } from 'src/enums/enums'
import useToggle from 'src/hooks/useToggle'
import { IListDataResponse } from 'src/models/request.model'
import {
  IStudentRegistrationListData,
  IStudentRegistrationMetaResponse,
} from 'src/models/student-registration.model'
import { errorHandler } from 'src/services/api.service'
import { AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchStudentRegistList } from 'src/services/student-registration.service'
import { IQueryParams } from 'src/models/general.model'

const useStudentRegistrationController = () => {
  const navigate = useNavigate()
  const { onSetBreadcrumbs, notify } = useApp()

  const [studentRegistData, setStudentRegistData] =
    useState<
      IListDataResponse<
        IStudentRegistrationListData,
        IStudentRegistrationMetaResponse
      >
    >()
  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 1,
    limit: 20,
    search: '',
    status: STATUS_ENUM?.all,
    totalData: 0,
  })
  const [isLoading, setIsLoading] = useToggle(false)
  const [isFetch, setIsFetch] = useToggle(false)

  const _onFetchList = useCallback(
    async (query?: IQueryParams, isFetch?: boolean) => {
      setIsLoading()
      try {
        const res: AxiosResponse<
          IListDataResponse<
            IStudentRegistrationListData,
            IStudentRegistrationMetaResponse
          >
        > = await fetchStudentRegistList(query)

        setStudentRegistData(res?.data)
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
    record?: IStudentRegistrationListData,
  ) => {
    if (type === 'detail') {
      navigate(`/student-registration/${record?.studentRegistrationNumber}`)
    } else if (type === 'edit') {
    }
  }

  useEffect(() => {
    if (isFetch) _onRefetch()
  }, [isFetch])

  useEffect(() => {
    _onFetchList()
  }, [])

  return {
    onSetBreadcrumbs,
    isLoading,
    studentRegistData,
    queryParams,
    setQueryParams,
    isFetch,
    setIsFetch,
    onRefetch: _onRefetch,
    handleChangeStatus: _handleChangeStatus,
    handleClickAction: _handleClickAction,
  }
}

export default useStudentRegistrationController
