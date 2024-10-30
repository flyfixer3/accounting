// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import {
  ICourseVoucherRequestPayload,
  ICourseVoucherRequestResponse,
} from 'src/models/course-voucher.model'
import { requestOrderCourseVoucher } from 'src/services/course-voucer.service'
import { AxiosError, AxiosResponse } from 'axios'
import { useCallback, useState } from 'react'

const useCourseVoucherOrderController = () => {
  const { notify } = useApp()

  const [formErrorMsg, setFormErrorMsg] = useState(null)

  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const _onSubmitOrderCourseVoucher = useCallback(
    async (
      payload: ICourseVoucherRequestPayload,
      handleClose: () => void,
      onRefetch: () => void,
    ) => {
      setIsSubmitted()

      try {
        const res: AxiosResponse<ICourseVoucherRequestResponse> =
          await requestOrderCourseVoucher(payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()
        onRefetch()
        handleClose()
      } catch (err) {
        const { message }: AxiosError = err?.response?.data

        setFormErrorMsg(message)

        notify.error({
          message: 'Error',
          description: message,
          duration: 5,
        })

        setIsSubmitted()
      }
    },
    [],
  )

  const _onHandleOrderCourseVoucher = (
    payload: ICourseVoucherRequestPayload,
    handleClose: () => void,
    onRefetch: () => void,
  ) => {
    _onSubmitOrderCourseVoucher(payload, handleClose, onRefetch)
  }

  return {
    formErrorMsg,
    isSubmitted,
    onHandleOrderCourseVoucher: _onHandleOrderCourseVoucher,
  }
}

export default useCourseVoucherOrderController
