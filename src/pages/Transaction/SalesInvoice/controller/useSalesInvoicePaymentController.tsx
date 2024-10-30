// @ts-nocheck
import useToggle from 'src/hooks/useToggle'
import { useCallback, useState } from 'react'
import {
  ISalesInvoiceCalculateDiscountResponse,
  ISalesInvoicePaymentRequestPayload,
  ISalesInvoiceRequestResponse,
  ISalesInvoiceSelectedData,
} from 'src/models/invoice.model'
import { SALES_INVOICE_DETAIL_TYPE, STATUS_ENUM } from 'src/enums/enums'
import { AxiosError, AxiosResponse } from 'axios'
import { useApp } from 'src/context/app.context'
import {
  requestSalesInvoiceDiscountVoucherCalculation,
  requestSalesInvoicePayment,
} from 'src/services/invoice.service'
import { IDataResponse } from 'src/models/request.model'

const useSalesInvoicePaymentController = () => {
  const { notify } = useApp()

  const [discountValue, setDiscountValue] = useState(null)
  const [totalDiscountedPrice, setTotalDiscountedPrice] = useState<string>(null)

  const [formErrorMsg, setFormErrorMsg] = useState(null)
  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const _onSubmitPayment = useCallback(
    async (
      invoiceNumber: string,
      invoiceDetailType: string,
      invoiceDetailId: number,
      payload: ISalesInvoicePaymentRequestPayload,
      handleClose: () => void,
      onRefetchDetail: () => void,
      onHandleModalGenerateVoucherVisibility: () => void,
    ) => {
      setIsSubmitted()
      try {
        const res: AxiosResponse<ISalesInvoiceRequestResponse> =
          await requestSalesInvoicePayment(
            invoiceNumber,
            invoiceDetailType,
            invoiceDetailId,
            payload,
          )

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })
        onRefetchDetail()
        if (res?.data?.isShowGenerateVoucherPopup) {
          onHandleModalGenerateVoucherVisibility()
          handleClose()
        } else {
          handleClose()
        }

        setIsSubmitted()
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

  const _onFetchCalculcatedDiscountVoucher = useCallback(
    async (selectedDiscountVoucher: string, invoiceDetailId: number) => {
      setIsSubmitted()
      try {
        const payload = {
          voucherCode: selectedDiscountVoucher,
          invoiceDetailId,
        }
        const res: AxiosResponse<
          IDataResponse<ISalesInvoiceCalculateDiscountResponse>
        > = await requestSalesInvoiceDiscountVoucherCalculation(payload)
        const data = res?.data?.data

        setTotalDiscountedPrice(data?.discountedPrice)
        setDiscountValue(data?.discountValue)

        setIsSubmitted()
      } catch (err) {
        const { status }: AxiosError = err?.response
        const { message }: AxiosError = err?.response?.data

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

  const _onHandleSubmitPayment = (
    paymentMethodId: number,
    selectedData: ISalesInvoiceSelectedData,
    handleClose: () => void,
    onRefetchDetail: () => void,
    onHandleModalGenerateVoucherVisibility: () => void,
    voucherCode: string,
    bankId?: number,
  ) => {
    const payload: ISalesInvoicePaymentRequestPayload = {
      paymentMethodId,
      invoiceDetailStatus: STATUS_ENUM?.paid,
      voucherCode:
        selectedData?.invoiceDetailType === SALES_INVOICE_DETAIL_TYPE.monthlyFee
          ? voucherCode
          : null,
    }

    if (bankId) {
      payload.bankId = bankId
    }

    _onSubmitPayment(
      selectedData?.invoiceNumber,
      selectedData?.invoiceDetailType,
      selectedData?.invoiceDetailId,
      payload,
      handleClose,
      onRefetchDetail,
      onHandleModalGenerateVoucherVisibility,
    )
  }

  const _onHandleCalculateDiscountVoucher = (
    selectedDiscountVoucher: string,
    invoiceDetailId: number,
  ) => {
    _onFetchCalculcatedDiscountVoucher(selectedDiscountVoucher, invoiceDetailId)
  }

  const _onClearDiscountCalculationData = () => {
    setDiscountValue(null)
    setTotalDiscountedPrice(null)
  }

  return {
    isSubmitted,
    formErrorMsg,
    totalDiscountedPrice,
    discountValue,
    onHandleSubmitPayment: _onHandleSubmitPayment,
    onHandleCalculateDiscountVoucher: _onHandleCalculateDiscountVoucher,
    onClearDiscountCalculationData: _onClearDiscountCalculationData,
  }
}

export default useSalesInvoicePaymentController
