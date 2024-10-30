// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import {
  IBookStockCreateRequestPayload,
  IBookStockFormData,
  IBookStockRequestResponse,
  IBookStockUpdateRequestPayload,
} from 'src/models/books.model'
import {
  requestCreateIBOBookStock,
  requestUpdateIBOBookStock,
} from 'src/services/books.service'
import { AxiosError, AxiosResponse } from 'axios'
import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const useModalAddBookStockController = () => {
  const navigate = useNavigate()
  const params = useParams()

  const { notify } = useApp()

  const [formErrorMsg, setFormErrorMsg] = useState('')

  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const _onSubmitCreateBookStock = useCallback(
    async (
      payload: IBookStockCreateRequestPayload,
      handleCloseModal?: () => void,
    ) => {
      setIsSubmitted()

      try {
        const res: AxiosResponse<IBookStockRequestResponse> =
          await requestCreateIBOBookStock(payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()

        handleCloseModal && handleCloseModal()
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

  const _onSubmitUpdateBookStock = useCallback(
    async (
      id: number,
      payload: IBookStockUpdateRequestPayload,
      handleCloseModal?: () => void,
    ) => {
      setIsSubmitted()

      try {
        const res: AxiosResponse<IBookStockRequestResponse> =
          await requestUpdateIBOBookStock(id, payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()

        handleCloseModal && handleCloseModal()
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

  const _handleSubmitBookStock = (
    payload: IBookStockFormData,
    isEdit: boolean,
    handleCloseModal?: () => void,
  ) => {
    const newPayload = {
      ...payload,
    }
    delete newPayload.bookImageFile
    newPayload.bookImageUrl = null
    newPayload.bookPrice = parseFloat(newPayload.bookPrice).toFixed(2)

    if (isEdit) {
      _onSubmitUpdateBookStock(
        parseInt(params?.id),
        newPayload,
        handleCloseModal,
      )
    } else {
      _onSubmitCreateBookStock(newPayload, handleCloseModal)
    }
  }

  return {
    isSubmitted,
    formErrorMsg,
    setFormErrorMsg,
    handleSubmitBookStock: _handleSubmitBookStock,
  }
}

export default useModalAddBookStockController
