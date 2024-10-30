// @ts-nocheck
import {
  fetchCourseList,
  fetchIBOCourseList,
  requestIBOCreateCourse,
  requestIBOUpdateCourse,
} from 'src/services/course.service'
import { useCallback, useEffect, useState } from 'react'
import {
  ICourseData,
  ICourseIBORequestPayload,
  ICourseMetaResponse,
  ICourseRequestResponse,
} from 'src/models/course.model'
import { IListDataResponse } from 'src/models/request.model'
import { AxiosResponse } from 'axios'
import useToggle from 'src/hooks/useToggle'
import { errorHandler } from 'src/services/api.service'
import { STATUS_ENUM, USER_ROLE_ENUM } from 'src/enums/enums'
import { useNavigate } from 'react-router-dom'
import { useApp } from 'src/context/app.context'
import { IQueryParams } from 'src/models/general.model'
import { useAuth } from 'src/context/auth.context'

const useCourseController = () => {
  const navigate = useNavigate()
  const { notify, onSetBreadcrumbs } = useApp()
  const { getUserRole } = useAuth()

  const [data, setData] =
    useState<IListDataResponse<ICourseData, ICourseMetaResponse>>(null)

  const [queryParams, setQueryParams] = useState<IQueryParams>({
    page: 1,
    limit: 20,
    search: '',
    status: STATUS_ENUM?.all,
    totalData: 0,
  })

  const [editCourse, setEditCourse] = useState<ICourseIBORequestPayload>(null)

  const [isModalCreateCourseVisible, setIsModalCreateCourseVisible] =
    useToggle(false)
  const [isFetch, setIsFetch] = useToggle(false)
  const [isLoading, setIsLoading] = useToggle(false)
  const [isSubmitting, setIsSubmitting] = useToggle(false)
  const [formErrorMsg, setFormErrorMsg] = useState('')

  const _onFetch = useCallback(
    async (query?: IQueryParams, isFetch?: boolean) => {
      setIsLoading()
      try {
        let res: AxiosResponse<
          IListDataResponse<ICourseData, ICourseMetaResponse>
        > = null

        if (getUserRole === USER_ROLE_ENUM?.ibo)
          res = await fetchIBOCourseList(query)
        else if (getUserRole === USER_ROLE_ENUM?.tc)
          res = await fetchCourseList(query)

        setData(res?.data)
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

        setIsLoading()
      }
    },
    [notify, setIsFetch],
  )

  const _onUpdateIBOCourse = useCallback(
    async (prevCourseNumber: string, payload: ICourseIBORequestPayload) => {
      setIsSubmitting()

      try {
        const res: AxiosResponse<ICourseRequestResponse> =
          await requestIBOUpdateCourse(prevCourseNumber, payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setEditCourse(null)
        setIsModalCreateCourseVisible()

        _onRefetch()

        setIsSubmitting()
      } catch (err) {
        const { message } = errorHandler(err)
        notify.error({
          message: 'Error',
          description: message,
          duration: 5,
        })

        setIsSubmitting()
      }
    },
    [],
  )

  const _onCreateIBOCourse = useCallback(
    async (payload: ICourseIBORequestPayload) => {
      setIsSubmitting()

      try {
        const res: AxiosResponse<ICourseRequestResponse> =
          await requestIBOCreateCourse(payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setEditCourse(null)
        setIsModalCreateCourseVisible()

        _onRefetch()

        setIsSubmitting()
      } catch (err) {
        const { message } = errorHandler(err)
        notify.error({
          message: 'Error',
          description: message,
          duration: 5,
        })

        setIsSubmitting()
      }
    },
    [],
  )

  const _onRefetch = () => {
    _onFetch(queryParams, isFetch)
  }

  const _handleChangeStatus = async (status: string) => {
    await setQueryParams({ ...queryParams, status })
    setIsFetch()
  }

  const _handleClickAction = (
    type: string,
    id: string,
    record?: ICourseIBORequestPayload,
  ) => {
    if (type === 'detail') {
      if (getUserRole === USER_ROLE_ENUM?.ibo)
        navigate(`/data-center/course/${id}`)
      else navigate(`/course/${id}`)
    } else if (type === 'edit') {
      setIsModalCreateCourseVisible()
      setEditCourse(record)
    }
  }

  const _handleSubmitCourseForm = (payload: ICourseIBORequestPayload) => {
    const newPayload: ICourseIBORequestPayload = { ...payload }
    newPayload.courseRegistrationFee = parseFloat(
      newPayload.courseRegistrationFee,
    ).toFixed(2)

    if (editCourse) {
      _onUpdateIBOCourse(editCourse?.courseNumber, newPayload)
    } else {
      newPayload.courseVoucherPricePerBundle = parseFloat(
        newPayload.courseVoucherPricePerBundle,
      ).toFixed(2)
      _onCreateIBOCourse(newPayload)
    }
  }

  useEffect(() => {
    if (isFetch) _onRefetch()
  }, [isFetch])

  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'Course',
        path: '/course',
      },
    ])
  }, [])

  return {
    onRefetch: _onRefetch,
    onFetch: _onFetch,
    courseData: data,
    queryParams: queryParams,
    setQueryParams: setQueryParams,
    setIsFetch: setIsFetch,
    handleChangeStatus: _handleChangeStatus,
    handleClickAction: _handleClickAction,
    isLoading,
    isModalCreateCourseVisible,
    setIsModalCreateCourseVisible,
    editCourse,
    isSubmitting,
    formErrorMsg,
    handleSubmitCourseForm: _handleSubmitCourseForm,
  }
}

export default useCourseController
