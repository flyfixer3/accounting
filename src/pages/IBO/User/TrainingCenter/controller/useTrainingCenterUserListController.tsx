// @ts-nocheck
import { IListDataResponse } from 'src/models/request.model'
import {
  IUserTrainingCenterChangePasswordRequestPayload,
  IUserTrainingCenterChangePasswordRequestResponse,
  IUserTrainingCenterMetaResponse,
  IUserTrainingCenterUserListData,
} from 'src/models/user.model'
import { useCallback, useState } from 'react'
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import { STATUS_ENUM } from 'src/enums/enums'
import { AxiosError, AxiosResponse } from 'axios'
import {
  fetchTrainingCenterUsersList,
  requestUpdateTrainingCenterUserPassword,
} from 'src/services/user.service'
import { errorHandler } from 'src/services/api.service'
import { IQueryParams } from 'src/models/general.model'

const useTrainingCenterUserListController = () => {
  const { notify } = useApp()

  const [usersData, setUsersData] =
    useState<
      IListDataResponse<
        IUserTrainingCenterUserListData,
        IUserTrainingCenterMetaResponse
      >
    >(null)
  const [selectedData, setSelectedData] =
    useState<IUserTrainingCenterUserListData>(null)

  const [userListQueryParams, setUserListQueryParams] = useState<IQueryParams>({
    page: 1,
    limit: 20,
    search: '',
    status: STATUS_ENUM?.all,
    totalData: 0,
  })
  const [formErrorMsg, setFormErrorMsg] = useState(null)

  const [isLoadingUserList, setIsLoadingUserList] = useToggle(false)
  const [isFetch, setIsFetch] = useToggle(false)
  const [isSubmitted, setIsSubmitted] = useToggle(false)
  const [isModalUpdatePasswordVisible, setIsModalUpdatePasswordVisible] =
    useToggle(false)

  const _onFetchUserList = useCallback(
    async (
      trainingCenterNumber: string,
      query?: IQueryParams,
      isFetch?: boolean,
    ) => {
      setIsLoadingUserList()
      try {
        const res: AxiosResponse<
          IListDataResponse<
            IUserTrainingCenterUserListData,
            IUserTrainingCenterMetaResponse
          >
        > = await fetchTrainingCenterUsersList(trainingCenterNumber, query)
        const resData = res?.data

        setUsersData(resData)
        setUserListQueryParams({
          page: res?.data?.pagination?.page,
          limit: res?.data?.pagination?.limit,
          totalData: res?.data?.meta?.currentTotalData,
        })

        setIsLoadingUserList()
        isFetch && setIsFetch()
      } catch (err) {
        const { message } = errorHandler(err)
        notify.error({
          message: 'Error',
          description: message,
          duration: 5,
        })

        setIsLoadingUserList()
        isFetch && setIsFetch()
      }
    },
    [notify],
  )

  const _onSubmitChangeUserPassword = useCallback(
    async (
      userId: number,
      payload: IUserTrainingCenterChangePasswordRequestPayload,
    ) => {
      setIsSubmitted()

      try {
        const res: AxiosResponse<IUserTrainingCenterChangePasswordRequestResponse> =
          await requestUpdateTrainingCenterUserPassword(userId, payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()
        setSelectedData(null)
        setIsModalUpdatePasswordVisible()
      } catch (err) {
        const { status }: AxiosError = err?.response
        const { message }: AxiosError = err?.response?.data

        if (status === 422 || status === 400) {
          setFormErrorMsg(err?.response?.data)
        } else {
          notify.error({
            message: 'Error',
            description: message,
            duration: 5,
          })
        }
        setIsSubmitted()
      }
    },
    [],
  )

  const _onRefetchUserList = (id: string) => {
    _onFetchUserList(id, userListQueryParams)
  }

  const _onSetFormErrorMsg = (val: string) => setFormErrorMsg(val)

  const _onSetSelectedData = (record: IUserTrainingCenterUserListData) =>
    setSelectedData(record)

  const _handleModalUpdatePasswordVisibility = () =>
    setIsModalUpdatePasswordVisible()

  const _onHandleSubmitChangePassword = (
    e: IUserTrainingCenterChangePasswordRequestPayload,
  ) => {
    _onSubmitChangeUserPassword(selectedData?.id, e)
  }

  return {
    usersData,
    isFetch,
    isModalUpdatePasswordVisible,
    formErrorMsg,
    isSubmitted,
    isLoadingUserList,
    userListQueryParams,
    selectedData,

    setUserListQueryParams,
    setIsLoadingUserList,
    setIsFetch,
    handleModalUpdatePasswordVisibility: _handleModalUpdatePasswordVisibility,
    onSetFormErrorMsg: _onSetFormErrorMsg,
    onRefetchUserList: _onRefetchUserList,
    onSetSelectedData: _onSetSelectedData,
    onHandleSubmitChangePassword: _onHandleSubmitChangePassword,
  }
}

export default useTrainingCenterUserListController
