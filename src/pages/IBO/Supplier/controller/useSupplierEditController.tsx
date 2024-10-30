// @ts-nocheck
import { AxiosError, AxiosResponse } from "axios"
import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "src/context/app.context"
import useToggle from "src/hooks/useToggle"
import { ISupplierDataCreateRequestPayload, ISupplierDataCreateRequestResponse, ISupplierDataResponse } from "src/models/supplier.model"
import { errorHandler } from "src/services/api.service"
import { fetchSupplierDetail, requestUpdateSupplierDetail } from "src/services/supplier.service"

const useSupplierEditController = () => {
    const navigate = useNavigate()
    const { notify } = useApp()

    const [detail, setDetail] = useState<ISupplierDataResponse>(null)
    const [formErrorMsg, setFormErrorMsg] = useState<string>('')
    const [isLoading, setIsLoading] = useToggle(false)

    const _onFetchDetail = useCallback(
        async (supplierId: number) => {
            setIsLoading()
            try {
                const res: AxiosResponse<ISupplierDataResponse> =
                await fetchSupplierDetail(supplierId)
                const resData = res?.data
                setDetail(resData)

                setIsLoading()
            } 
            catch (err) {
                const { message } = errorHandler(err)
                notify.error({
                    message: 'Error',
                    description: message,
                    duration: 5,
                })

                setIsLoading()
            }
        },
        [notify, setIsLoading],
    )

    const _onSubmitUpdateDetail = useCallback(
        async (supplierId: number, payload: ISupplierDataCreateRequestPayload) => {
            setIsLoading()

            try {
                const res: AxiosResponse<ISupplierDataCreateRequestResponse> = await requestUpdateSupplierDetail(supplierId, payload)

                notify.success({
                    message: 'Success',
                    description: res.data.message
                })

                setIsLoading()
                navigate(-1)
            }
            catch (err) {
                const { status }: AxiosError = err?.response
                const { message }: AxiosError = err?.response?.data
        
                if (status === 422 || status === 400) {
                  setFormErrorMsg(message)
                } 
                else {
                  notify.error({
                    message: 'Error',
                    description: message,
                    duration: 5,
                  })
                }

                setIsLoading()
            }
        }
    , [])

    return {
        detail,
        formErrorMsg,
        setFormErrorMsg,
        isLoading,
        onFetchDetail: _onFetchDetail,
        onSubmitUpdateDetail: _onSubmitUpdateDetail
    }
}

export default useSupplierEditController