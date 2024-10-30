// @ts-nocheck
import { useCallback, useState } from 'react'
import useToggle from 'src/hooks/useToggle'
import { useApp } from 'src/context/app.context'
import { IClassData } from 'src/models/class.model'
import {
  IRequestResponse,
  IStudentRegistrationCourseClassFormData,
  IStudentRegistrationCourseClassPayload,
} from 'src/models/student-registration.model'
import { AxiosError, AxiosResponse } from 'axios'
import { requestSubmitUpdateStudentRegistClass } from 'src/services/student-registration.service'
import { IStudentClassDetailResponse } from 'src/models/student.model'
import { IDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import { fetchStudentClassDetail } from 'src/services/student.service'
import { ICourseData, ICourseLevelData } from '@src/models/course.model'
import { useNavigate } from 'react-router-dom'

const useStudentRegistrationUpdateClassController = () => {
  const { notify } = useApp()
  const navigate = useNavigate()

  const [selectedClassIds, setSelectedClassIds] = useState<number[]>([])
  const [selectedClassObj, setSelectedClassObj] = useState<IClassData[]>([])
  const [studentClassDetail, setStudentClassDetail] =
    useState<IStudentClassDetailResponse[]>(null)

  const [formErrorMsg, setFormErrorMsg] = useState(null)

  const [isSubmitting, setIsSubmitting] = useToggle(false)

  const _onFetchClassDetailByStudentId = useCallback(
    async (id: number, courseId: number) => {
      try {
        const res: AxiosResponse<IDataResponse<IStudentClassDetailResponse[]>> =
          await fetchStudentClassDetail(id, { courseId })

        const data: IStudentClassDetailResponse[] = res?.data?.data

        setStudentClassDetail(data)
      } catch (err) {
        const { message } = errorHandler(err)
        notify.error({
          message: 'Error',
          description: message,
          duration: 5,
        })
      }
    },
    [notify],
  )

  const _onSubmitUpdateClass = useCallback(
    async (
      studentId: number,
      payload: IStudentRegistrationCourseClassFormData,
    ) => {
      setIsSubmitting()

      try {
        const res: AxiosResponse<IRequestResponse> =
          await requestSubmitUpdateStudentRegistClass(studentId, payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitting()
        navigate(-1)
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

  const _onHandleSubmitUpdateClass = (
    studentId: number,
    course: ICourseData,
    courseLevel: ICourseLevelData,
  ) => {
    const payload: IStudentRegistrationCourseClassPayload = {
      courseId: course?.id,
      courseLevelId: courseLevel?.id,
      courseClassIdList: selectedClassIds,
    }
    _onSubmitUpdateClass(studentId, payload)
  }

  const _onSelectAll = (e: boolean, selectedRows: IClassData[]) => {
    const isSelected = e
    if (isSelected) {
      setSelectedClassObj(selectedRows)
    } else {
      setSelectedClassObj([])
    }
  }

  const _onChange = (e: number[], selectedRows: IClassData[]) => {
    setSelectedClassIds(e)
    setSelectedClassObj(selectedRows)
    formErrorMsg && setFormErrorMsg(null)
  }

  const _onRefetchClassDetailByStudentId = (
    studentId: number,
    courseId: number,
  ) => {
    _onFetchClassDetailByStudentId(studentId, courseId)
  }

  const _onSelectExistingData = () => {
    const courseClasses: IClassData[] = studentClassDetail?.map(
      (item) => item?.courseClass,
    )
    const courseClassId: number[] = studentClassDetail?.map(
      (item) => item?.courseClass?.id,
    )

    _onChange(courseClassId, courseClasses)
  }

  return {
    formErrorMsg,
    isSubmitting,
    setFormErrorMsg,
    selectedClassIds,
    selectedClassObj,
    setIsSubmitting,
    onSelectAll: _onSelectAll,
    onChange: _onChange,
    onHandleSubmitUpdateClass: _onHandleSubmitUpdateClass,
    onRefetchClassDetailByStudentId: _onRefetchClassDetailByStudentId,
    onSelectExistingData: _onSelectExistingData,
  }
}

export default useStudentRegistrationUpdateClassController
