// @ts-nocheck
import { useApp } from 'src/context/app.context'
import {
  IPaymentMethod,
  IPaymentMethodListResponse,
} from 'src/models/payment-method.model'
import { useCallback, useEffect, useState } from 'react'
import useToggle from 'src/hooks/useToggle'
import { AxiosResponse } from 'axios'
import { IDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import {
  fetchIBOPaymentMethodList,
  fetchPaymentMethodList,
} from 'src/services/payment-method.service'
import { useAuth } from 'src/context/auth.context'
import { USER_ROLE_ENUM } from 'src/enums/enums'

const useSelectPaymentMethodController = () => {
  const { notify } = useApp()
  const { getUserRole } = useAuth()
  const [data, setData] = useState<IPaymentMethod[]>(null)
  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetchList = useCallback(async () => {
    setIsLoading()
    try {
      let res: AxiosResponse<IDataResponse<IPaymentMethodListResponse>> = null
      if (getUserRole === USER_ROLE_ENUM?.ibo) {
        res = await fetchIBOPaymentMethodList()
      } else {
        res = await fetchPaymentMethodList()
      }

      const resData = res?.data?.data
      const options = Array.isArray(resData)
        ? resData.map((item) => ({
            ...item,
            label: item?.paymentMethodName,
            value: item.id,
          }))
        : []

      setData(options)

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
    _onFetchList()
  }, [])

  return { data, isLoading }
}

export default useSelectPaymentMethodController
