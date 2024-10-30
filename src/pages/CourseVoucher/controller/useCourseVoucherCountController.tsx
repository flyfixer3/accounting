// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import {
  ICourseVoucherByCourseData,
  ICourseVoucherCountResponse,
} from 'src/models/course-voucher.model'
import { errorHandler } from 'src/services/api.service'
import { fetchAvailableCourseVoucher } from 'src/services/course-voucer.service'
import { AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { IDataResponse } from 'src/models/request.model'

const useCourseVoucherCountController = () => {
  const { notify } = useApp()

  const [data, setData] = useState<ICourseVoucherByCourseData[]>()
  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetchData = useCallback(async () => {
    setIsLoading()
    try {
      const res: AxiosResponse<IDataResponse<ICourseVoucherCountResponse>> =
        await fetchAvailableCourseVoucher()

      const resData = res?.data.data
      const list: ICourseVoucherByCourseData[] = Array.isArray(resData)
        ? resData?.map((item: ICourseVoucherByCourseData) => ({
            ...item,
          }))
        : []
      setData(list)

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
  }, [notify])

  useEffect(() => {
    _onFetchData()
  }, [])

  return {
    isCourseVoucherCountLoading: isLoading,
    courseVoucherCountData: data,
  }
}

export default useCourseVoucherCountController
