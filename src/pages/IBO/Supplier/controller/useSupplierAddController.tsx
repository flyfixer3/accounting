// @ts-nocheck
import { useApp } from "src/context/app.context"
import useToggle from "src/hooks/useToggle"
import { ISupplierDataCreateRequestPayload, ISupplierDataCreateRequestResponse } from "@src/models/supplier.model"
import { AxiosError, AxiosResponse } from "axios"
import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { requestCreateSupplierDetail } from "src/services/supplier.service"

const useSupplierAddController = () => {
    const navigate = useNavigate()
    const { notify } = useApp()

    const [formErrorMsg, setFormErrorMsg] = useState<string>('')
    const [isSubmitted, setIsSubmitted] = useToggle(false)

    const _onSubmitSupplierAdd = useCallback(
        async (
            payload: ISupplierDataCreateRequestPayload
        ) => {
            setIsSubmitted()

            try {
                const res: AxiosResponse<ISupplierDataCreateRequestResponse> = await requestCreateSupplierDetail(payload)

                notify.success({
                    message: 'Success',
                    description: res.data.message
                })

                setIsSubmitted()
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
                
                setIsSubmitted()
            }
        }
    , [])

    return {
        formErrorMsg,
        setFormErrorMsg,
        isSubmitted,
        onSubmitSupplierAdd: _onSubmitSupplierAdd,
    }
}

export default useSupplierAddController