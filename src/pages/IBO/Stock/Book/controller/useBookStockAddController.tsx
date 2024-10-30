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

const useBookStockAddController = () => {
  const navigate = useNavigate()
  const params = useParams()

  const { notify } = useApp()

  const [formErrorMsg, setFormErrorMsg] = useState('')

  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const _onSubmitCreateBookStock = useCallback(
    async (payload: IBookStockCreateRequestPayload) => {
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

        navigate(`/stock/books/${res?.data?.data?.id}`)
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
    async (id: number, payload: IBookStockUpdateRequestPayload) => {
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

        navigate(`/stock/books/${res?.data?.data?.id}`)
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
  ) => {
    const newPayload = {
      ...payload,
    }
    delete newPayload.bookImageFile
    newPayload.bookImageUrl = null
    newPayload.bookPrice = parseFloat(newPayload.bookPrice).toFixed(2)

    if (isEdit) {
      _onSubmitUpdateBookStock(parseInt(params?.id), newPayload)
    } else {
      _onSubmitCreateBookStock(newPayload)
    }
  }

  return {
    isSubmitted,
    formErrorMsg,
    setFormErrorMsg,
    handleSubmitBookStock: _handleSubmitBookStock,
  }
}

export default useBookStockAddController
