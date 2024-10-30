// @ts-nocheck
import useToggle from 'src/hooks/useToggle'
import {
  IStudentCourseLevelUpRequestPayload,
  IStudentRegistrationDetailPayload,
  IStudentRegistrationDetailResponse,
} from 'src/models/student-registration.model'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AxiosError, AxiosResponse } from 'axios'
import { fetchStudentRegistDetail } from 'src/services/student-registration.service'
import { IDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import { useApp } from 'src/context/app.context'
import { IStudentClassDetailResponse } from 'src/models/student.model'
import { fetchStudentClassDetail } from 'src/services/student.service'
import _ from 'lodash'
import { requestCourseLevelUp } from 'src/services/course.service'
import { ICourseRequestResponse } from 'src/models/course.model'

const useStudentRegistrationDetail = () => {
  const { notify } = useApp()
  const params = useParams()

  const [detailData, setDetailData] =
    useState<IStudentRegistrationDetailResponse>(null)
  const [studentClassDetail, setStudentClassDetail] =
    useState<IStudentClassDetailResponse[]>(null)
  const [formErrorMsg, setFormErrorMsg] = useState('')

  const [isLoading, setIsLoading] = useToggle(false)
  const [isFetch, setIsFetch] = useToggle(false)
  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const [isModalCourseLevelUpVisible, setIsModalCourseLevelUpVisible] =
    useToggle(false)
  const [isModalCourseHistoryVisible, setIsModalCourseHistoryVisible] =
    useToggle(false)

  const _onFetch = useCallback(
    async (id: string, isFetch?: boolean) => {
      setIsLoading()

      const payload: IStudentRegistrationDetailPayload = { id }

      try {
        const res: AxiosResponse<
          IDataResponse<IStudentRegistrationDetailResponse>
        > = await fetchStudentRegistDetail(payload)

        const data: IStudentRegistrationDetailResponse = res?.data?.data
        setDetailData(data)

        isFetch && setIsFetch()
        setIsLoading()

        _onFetchClassDetailByStudentId(
          data?.student?.id,
          data?.studentCourseDetail?.course?.id,
        )
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

  const _onFetchClassDetailByStudentId = useCallback(
    async (id: number, courseId: number, isFetch?: boolean) => {
      setIsLoading()

      try {
        const res: AxiosResponse<IDataResponse<IStudentClassDetailResponse[]>> =
          await fetchStudentClassDetail(id, { courseId })

        const data: IStudentClassDetailResponse[] = res?.data?.data

        setStudentClassDetail(data)

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

  const _onSubmitCourseLevelUp = useCallback(
    async (
      studentId: number,
      courseId: number,
      payload: IStudentCourseLevelUpRequestPayload,
    ) => {
      setIsSubmitted()

      try {
        const res: AxiosResponse<ICourseRequestResponse> =
          await requestCourseLevelUp(studentId, courseId, payload)

        notify.success({
          message: 'Success',
          description: 'Success Create Supplier Order',
          duration: 5,
        })

        setIsSubmitted()
        setIsModalCourseLevelUpVisible()
        _onRefetch()
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
        setIsSubmitted()
      }
    },
    [],
  )

  const _onRefetch = async () => {
    await _onFetch(params?.id, isFetch)
  }

  const _handleModalCourseLevelUpVisibility = () =>
    setIsModalCourseLevelUpVisible()

  const _handleModalCourseHistoryVisibility = () =>
    setIsModalCourseHistoryVisible()

  const _onSetFormErrorMsg = (val: string) => setFormErrorMsg(val)

  const _handleSubmitCourseLevelUp = (
    e: IStudentCourseLevelUpRequestPayload,
  ) => {
    _onSubmitCourseLevelUp(
      detailData?.student?.id,
      detailData?.studentCourseDetail?.course?.id,
      e,
    )
  }

  useEffect(() => {
    _onRefetch()
  }, [])

  return {
    isLoading,
    detailData,
    studentClassDetail,
    isModalCourseLevelUpVisible,
    formErrorMsg,
    isSubmitted,
    isModalCourseHistoryVisible,
    handleModalCourseHistoryVisibility: _handleModalCourseHistoryVisibility,
    onSetFormErrorMsg: _onSetFormErrorMsg,
    handleModalCourseLevelUpVisibility: _handleModalCourseLevelUpVisibility,
    handleSubmitCourseLevelUp: _handleSubmitCourseLevelUp,
  }
}

export default useStudentRegistrationDetail
