// @ts-nocheck
import {
  fetchCourseDetail,
  fetchCourseLevelList,
  fetchIBOCourseDetail,
  fetchIBOCourseLevelList,
  requestIBOCreateCourseLevel,
  requestIBOUpdateCourseLevel,
} from 'src/services/course.service'
import { useCallback, useEffect, useState } from 'react'
import {
  ICourseRequestResponse,
  ICourseDetailPayload,
  ICourseDetailResponse,
  ICourseLevelData,
  ICourseMetaResponse,
  ICourseLevelIBORequestPayload,
} from 'src/models/course.model'

import { AxiosError, AxiosResponse } from 'axios'
import useToggle from 'src/hooks/useToggle'
import { errorHandler } from 'src/services/api.service'

import { useParams } from 'react-router-dom'
import { useApp } from 'src/context/app.context'
import { IDataResponse, IListDataResponse } from '@src/models/request.model'
import { currencyFloatConverter } from 'src/helpers/formatter.helper'
import { USER_ROLE_ENUM } from 'src/enums/enums'
import { IQueryParams } from 'src/models/general.model'
import { useAuth } from 'src/context/auth.context'

const useCourseDetailController = () => {
  const params = useParams()
  const { getUserRole } = useAuth()

  const { notify, onSetBreadcrumbs } = useApp()
  const [courseDetailData, setCourseDetailData] =
    useState<ICourseDetailResponse>()
  const [courseLevelData, setCourseLevelData] =
    useState<IListDataResponse<ICourseLevelData, ICourseMetaResponse>>()

  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 1,
    limit: 20,
    totalData: 0,
  })

  const [isModalCreateCourseLevelVisible, setIsModalCreateCourseLevelVisible] =
    useToggle(false)
  const [editCourseLevel, setEditCourseLevel] = useState<ICourseLevelData>(null)

  const [isFetch, setIsFetch] = useToggle(false)
  const [isLoading, setIsLoading] = useToggle(false)
  const [isCourseLevelLoading, setIsCourseLevelLoading] = useToggle(false)
  const [isSubmitting, setIsSubmitting] = useToggle(false)
  const [formErrorMsg, setFormErrorMsg] = useState('')

  const _onFetch = useCallback(
    async (id: string, isFetch?: boolean) => {
      setIsLoading()

      const payload: ICourseDetailPayload = { id }

      try {
        let res: AxiosResponse<IDataResponse<ICourseDetailResponse>> = null

        if (getUserRole === USER_ROLE_ENUM?.ibo)
          res = await fetchIBOCourseDetail(payload)
        else if (getUserRole === USER_ROLE_ENUM?.tc)
          res = await fetchCourseDetail(payload)

        const courseDetail: ICourseDetailResponse = res?.data?.data
        setCourseDetailData(courseDetail)

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
    [notify, setIsFetch],
  )

  const _onFetchCourseLevel = useCallback(
    async (id: string, query?: IQueryParams, isFetch?: boolean) => {
      setIsCourseLevelLoading()
      try {
        let res: AxiosResponse<
          IListDataResponse<ICourseLevelData, ICourseMetaResponse>
        > = null
        if (getUserRole === USER_ROLE_ENUM?.ibo)
          res = await fetchIBOCourseLevelList(id, query)
        else res = await fetchCourseLevelList(id, query)

        setCourseLevelData(res?.data)
        setQueryParams({
          page: res?.data?.pagination?.page,
          limit: res?.data?.pagination?.limit,
          totalData: res?.data?.meta?.currentTotalData,
        })
        setIsFetch()
        setIsCourseLevelLoading()
      } catch (err) {
        const { message } = errorHandler(err)
        notify.error({
          message: 'Error',
          description: message,
          duration: 5,
        })
        setIsFetch()
        setIsCourseLevelLoading()
      }
    },
    [notify, setIsFetch],
  )

  const _onUpdateIBOCourseLevel = useCallback(
    async (id: number, payload: ICourseLevelIBORequestPayload) => {
      setIsSubmitting()

      payload = {
        ...payload,
        courseLevelMonthlyFee: currencyFloatConverter(
          payload?.courseLevelMonthlyFee,
        ),
      }

      try {
        const res: AxiosResponse<ICourseRequestResponse> =
          await requestIBOUpdateCourseLevel(id, payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setEditCourseLevel(null)
        setIsModalCreateCourseLevelVisible()
        _onRefetchAll()

        setIsSubmitting()
      } catch (err) {
        const { status }: AxiosError = err?.response
        const { message }: AxiosError = err?.response?.data

        if (status === 422 || status === 400) {
          setFormErrorMsg(message)
        } else {
          notify.error({
            message: 'Error',
            description: message,
            duration: 5,
          })
        }
        setIsSubmitting()
      }
    },
    [],
  )

  const _onCreateIBOCourseLevel = useCallback(
    async (id: string, payload: ICourseLevelIBORequestPayload) => {
      setIsSubmitting()

      payload = {
        ...payload,
        courseLevelMonthlyFee: currencyFloatConverter(
          payload?.courseLevelMonthlyFee,
        ),
      }

      try {
        const res: AxiosResponse<ICourseRequestResponse> =
          await requestIBOCreateCourseLevel(id, payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        _onRefetchAll()
        setIsModalCreateCourseLevelVisible()
        setIsSubmitting()
      } catch (err) {
        const { status }: AxiosError = err?.response
        const { message }: AxiosError = err?.response?.data

        if (status === 422 || status === 400) {
          setFormErrorMsg(message)
        } else {
          notify.error({
            message: 'Error',
            description: message,
            duration: 5,
          })
        }
        setIsSubmitting()
      }
    },
    [],
  )

  const _onRefetchAll = async () => {
    await _onFetch(params?.id, isFetch)

    await _onFetchCourseLevel(params?.id, queryParams, isFetch)
  }

  const _handleClickAction = (type: string, id: string, record: any) => {
    if (type === 'edit') {
      setIsModalCreateCourseLevelVisible()
      setEditCourseLevel(record)
    }
  }

  const _handleSubmitCourseLevelForm = (
    e: ICourseLevelIBORequestPayload,
    isEdit: boolean,
  ) => {
    if (isEdit) {
      _onUpdateIBOCourseLevel(editCourseLevel?.id, e)
    } else {
      _onCreateIBOCourseLevel(params?.id, e)
    }
  }

  useEffect(() => {
    if (isFetch) _onRefetchAll()
  }, [isFetch])

  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'Course',
        path: '/course',
      },
      {
        title: 'Course Detail',
        path: `/course/${params?.id}`,
      },
    ])
  }, [])

  return {
    onRefetch: _onRefetchAll,
    courseDetailData,
    courseLevelData,
    setIsFetch,
    isLoading,
    queryParams,
    setQueryParams,
    handleClickAction: _handleClickAction,
    editCourseLevel,
    setEditCourseLevel,
    isModalCreateCourseLevelVisible,
    setIsModalCreateCourseLevelVisible,
    handleSubmitCourseLevelForm: _handleSubmitCourseLevelForm,
    isSubmitting,
    formErrorMsg,
    isCourseLevelLoading,
  }
}

export default useCourseDetailController
