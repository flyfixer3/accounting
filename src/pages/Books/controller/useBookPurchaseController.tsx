// @ts-nocheck
import useToggle from 'src/hooks/useToggle'
import { useCallback, useState } from 'react'
import {
  IBookPurchaseFormData,
  IBookPurchasePayload,
  IBookPurchaseRequestResponse,
} from 'src/models/books.model'
import { AxiosError, AxiosResponse } from 'axios'
import { requestPurchaseBook } from 'src/services/books.service'
import { useApp } from 'src/context/app.context'
import { Modal } from 'antd'
import { useNavigate } from 'react-router-dom'

const useBookPurchaseController = () => {
  const { notify } = useApp()
  const navigate = useNavigate()
  const [formErrorMsg, setFormErrorMsg] = useState(null)

  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const _onSubmitPurchaseBook = useCallback(
    async (payload: IBookPurchasePayload, handleClose: () => void) => {
      setIsSubmitted()

      try {
        const res: AxiosResponse<IBookPurchaseRequestResponse> =
          await requestPurchaseBook(payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()
        handleClose()

        const resData = res?.data?.data

        Modal.success({
          closeIcon: true,
          title: 'Success',

          content: (
            <>
              <div>Success Purchase Book</div>
              <div>
                Invoice ID:{' '}
                <span
                  className="link-title"
                  onClick={() => {
                    navigate(`/sales-invoice/${resData?.invoiceNumber}`)
                    Modal.destroyAll()
                  }}>
                  {resData?.invoiceNumber}
                </span>
              </div>
            </>
          ),
        })
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

  const _onHandlePurchaseBook = (
    e: IBookPurchaseFormData,
    handleClose: () => void,
  ) => {
    const payload: IBookPurchasePayload = {
      studentId: e?.studentId,
      bookId: e?.bookId,
    }
    _onSubmitPurchaseBook(payload, handleClose)
  }

  return {
    formErrorMsg,
    isSubmitted,
    setFormErrorMsg,
    onHandlePurchaseBook: _onHandlePurchaseBook,
  }
}

export default useBookPurchaseController
