// @ts-nocheck
import { IDataResponse, IListDataResponse } from 'src/models/request.model'
import {
  IUserTrainingCenterData,
  IUserTrainingCenterMetaResponse,
  IUserTrainingCenterUserListData,
} from 'src/models/user.model'
import { useCallback, useEffect, useState } from 'react'
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import { STATUS_ENUM } from 'src/enums/enums'
import { AxiosResponse } from 'axios'
import {
  fetchTrainingCenterUserDetail,
  fetchTrainingCenterUserList,
  fetchTrainingCenterUsersList,
} from 'src/services/user.service'
import { errorHandler } from 'src/services/api.service'
import { useNavigate } from 'react-router-dom'
import { IQueryParams } from 'src/models/general.model'

const useTrainingCenterUserController = () => {
  const navigate = useNavigate()

  const { notify } = useApp()

  const [data, setData] =
    useState<
      IListDataResponse<
        IUserTrainingCenterData,
        IUserTrainingCenterMetaResponse
      >
    >(null)

  const [detailData, setDetailData] = useState<IUserTrainingCenterData>(null)

  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 1,
    limit: 20,
    search: '',
    status: STATUS_ENUM?.all,
    totalData: 0,
  })

  const [isLoading, setIsLoading] = useToggle(false)
  const [isLoadingUserList, setIsLoadingUserList] = useToggle(false)
  const [isFetch, setIsFetch] = useToggle(false)

  const _onFetchList = useCallback(
    async (query?: IQueryParams, isFetch?: boolean) => {
      setIsLoading()
      try {
        const res: AxiosResponse<
          IListDataResponse<
            IUserTrainingCenterData,
            IUserTrainingCenterMetaResponse
          >
        > = await fetchTrainingCenterUserList(query)
        const resData = res?.data

        setData(resData)
        setQueryParams({
          page: res?.data?.pagination?.page,
          limit: res?.data?.pagination?.limit,
          totalData: res?.data?.meta?.currentTotalData,
        })

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
    },
    [notify],
  )

  const _onFetchDetail = useCallback(async (id: string) => {
    setIsLoading()
    try {
      const res: AxiosResponse<IDataResponse<IUserTrainingCenterData>> =
        await fetchTrainingCenterUserDetail(id)
      const resData = res?.data

      setDetailData(resData.data)

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

  const _onRefetch = () => {
    _onFetchList(queryParams)
  }

  const _onRefetchDetail = (id: string) => {
    _onFetchDetail(id)
  }

  const _handleClickAction = (type: string, e: string) => {
    if (type === 'detail') {
      navigate(`/user/training-center/${e}`)
    } else if (type === 'edit') {
      navigate(`/user/training-center/edit/${e}`)
    }
  }

  return {
    data,
    detailData,
    isLoading,
    queryParams,
    isFetch,
    isLoadingUserList,
    setIsLoadingUserList,
    setIsFetch,
    setQueryParams,
    onRefetch: _onRefetch,
    handleClickAction: _handleClickAction,
    onRefetchDetail: _onRefetchDetail,
  }
}

export default useTrainingCenterUserController
