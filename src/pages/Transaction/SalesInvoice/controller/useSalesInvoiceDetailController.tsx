// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import {
  IInvoiceBookDetail,
  IInvoiceEquipmentDetail,
  IInvoiceMonthlyFeeDetail,
  IInvoiceRegistrationDetail,
  ISalesInvoiceDetailPayload,
  ISalesInvoiceDetailResponse,
  ISalesInvoiceSelectedData,
  SalesInvoiceType,
} from 'src/models/invoice.model'
import { IDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import { fetchSalesInvoiceDetail } from 'src/services/invoice.service'
import { AxiosError, AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IStudentDetailResponse } from 'src/models/student.model'
import {
  IDiscountVoucherRequestPayload,
  IDiscountVoucherRequestResponse,
} from 'src/models/discount-voucher.model'
import { requestCreateDiscountVoucher } from 'src/services/discount-voucher.service'

const useSalesInvoiceDetailController = () => {
  const { notify } = useApp()
  const params = useParams()

  const [detailData, setDetailData] = useState<ISalesInvoiceDetailResponse>()
  const [selectedData, setSelectedData] =
    useState<ISalesInvoiceSelectedData>(null)
  const [formErrorMsg, setFormErrorMsg] = useState(null)

  const [isModalPaymentVisible, setIsModalPaymentVisible] = useToggle(false)
  const [
    isModalGenerateVoucherConfirmVisible,
    setIsModalGenerateVoucherConfirmVisible,
  ] = useToggle(false)

  const [isFetch, setIsFetch] = useToggle(false)
  const [isLoading, setIsLoading] = useToggle(false)
  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const _onFetch = useCallback(
    async (id: string, isFetch?: boolean) => {
      setIsLoading()

      const payload: ISalesInvoiceDetailPayload = { id }

      try {
        const res: AxiosResponse<IDataResponse<ISalesInvoiceDetailResponse>> =
          await fetchSalesInvoiceDetail(payload)

        const detail: ISalesInvoiceDetailResponse = res?.data?.data
        setDetailData(detail)

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

  const _onSubmitGenerateVoucher = useCallback(
    async (
      payload: IDiscountVoucherRequestPayload,
      handleModalClose: () => void,
    ) => {
      setIsSubmitted()
      try {
        const res: AxiosResponse<IDiscountVoucherRequestResponse> =
          await requestCreateDiscountVoucher(payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()
        handleModalClose()
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

  const _onHandleModalPaymentVisibility = () => {
    setIsModalPaymentVisible()
  }

  const _onHandleModalGenerateVoucherVisibility = () => {
    setIsModalGenerateVoucherConfirmVisible()
  }

  const _onHandleSelectedDataToPay = (
    type: SalesInvoiceType,
    data: ISalesInvoiceSelectedData,
  ) => {
    const newPayload = {
      invoiceDetailId: data?.id,

      name:
        (data as IInvoiceMonthlyFeeDetail).courseLevel?.courseLevelName ||
        (data as IInvoiceBookDetail)?.book?.bookName ||
        (data as IInvoiceEquipmentDetail)?.equipmentHistoryData
          ?.equipmentName ||
        (data as IInvoiceRegistrationDetail)?.course?.courseName,

      totalPrice:
        (data as IInvoiceMonthlyFeeDetail)?.monthlyFeePrice ||
        (data as IInvoiceBookDetail)?.bookPrice ||
        (data as IInvoiceEquipmentDetail)?.totalPrice ||
        (data as IInvoiceRegistrationDetail)?.registrationPrice,

      invoiceDetailType: type,

      ...data,
    }

    setSelectedData(newPayload)
  }

  const _onHandleSubmitGenerateVoucher = (
    studentData: IStudentDetailResponse,
    handleModalClose: () => void,
  ) => {
    const payload = { studentId: studentData?.id }
    _onSubmitGenerateVoucher(payload, handleModalClose)
  }

  useEffect(() => {
    _onRefetch()
  }, [])

  return {
    detailData,
    isLoading,
    params,
    isModalPaymentVisible,
    selectedData,
    isModalGenerateVoucherConfirmVisible,
    formErrorMsg,
    isSubmitted,
    onRefetchDetail: _onRefetch,
    onHandleModalPaymentVisibility: _onHandleModalPaymentVisibility,
    onHandleSelectedDataToPay: _onHandleSelectedDataToPay,
    onHandleModalGenerateVoucherVisibility:
      _onHandleModalGenerateVoucherVisibility,
    onHandleSubmitGenerateVoucher: _onHandleSubmitGenerateVoucher,
  }
}

export default useSalesInvoiceDetailController
