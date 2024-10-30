// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import { IDataResponse } from 'src/models/request.model'
import {
  IStudentDetailPayload,
  IStudentDetailResponse,
} from 'src/models/student.model'
import { errorHandler } from 'src/services/api.service'
import { fetchStudentDetail } from 'src/services/student.service'
import { AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const useStudentDetailController = () => {
  const params = useParams()

  const { notify } = useApp()
  const [detailData, setDetailData] = useState<IStudentDetailResponse>(null)

  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetchDetail = useCallback(
    async (id: number) => {
      setIsLoading()

      const payload: IStudentDetailPayload = { id }

      try {
        const res: AxiosResponse<IDataResponse<IStudentDetailResponse>> =
          await fetchStudentDetail(payload)

        const studentDetail: IStudentDetailResponse = res?.data?.data
        setDetailData(studentDetail)

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
    [notify],
  )

  useEffect(() => {
    if (params?.id) {
      const id = parseInt(params?.id)
      _onFetchDetail(id)
    }
  }, [params?.id])

  return {
    detailData,
    isLoading,
  }
}

export default useStudentDetailController
