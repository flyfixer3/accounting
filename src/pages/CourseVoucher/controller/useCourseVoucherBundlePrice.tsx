// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import {
  ICourseVoucherBundlePriceRequestPayload,
  ICourseVoucherBundlePriceRequestResponse,
} from 'src/models/course-voucher.model'
import { errorHandler } from 'src/services/api.service'
import { fetchCourseVoucherBundlePriceByCourseId } from 'src/services/course-voucer.service'
import { AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { IDataResponse } from 'src/models/request.model'

const useCourseVoucherBundlePriceController = () => {
  const { notify } = useApp()

  const [data, setData] = useState<string>()
  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetchData = useCallback(
    async (payload: ICourseVoucherBundlePriceRequestPayload) => {
      setIsLoading()
      try {
        const res: AxiosResponse<
          IDataResponse<ICourseVoucherBundlePriceRequestResponse>
        > = await fetchCourseVoucherBundlePriceByCourseId(payload)

        const resData = res?.data.data

        const voucherBundlePrice: string = resData.courseVoucherBundlePrice

        setData(voucherBundlePrice)

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

  const _onFetchBundlePrice = (courseId: number) => {
    const payload: ICourseVoucherBundlePriceRequestPayload = { courseId }
    _onFetchData(payload)
  }

  return {
    isLoading,
    courseVoucherBundlePrice: data,
    onFetchBundlePrice: _onFetchBundlePrice,
  }
}

export default useCourseVoucherBundlePriceController
