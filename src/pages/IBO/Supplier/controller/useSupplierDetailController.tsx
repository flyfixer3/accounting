// @ts-nocheck
import { useCallback, useState } from 'react'
import useToggle from 'src/hooks/useToggle'
import {
  ISupplierDataResponse
} from 'src/models/supplier.model'

import { AxiosResponse } from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from 'src/context/app.context'
import { errorHandler } from 'src/services/api.service'
import {
  fetchSupplierDetail
} from 'src/services/supplier.service'

const useSupplierDetailController = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { notify } = useApp()

  const [detail, setDetail] = useState<ISupplierDataResponse>(null)
  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetchDetail = useCallback(
    async (orderId: number) => {
      setIsLoading()
      try {
        const res: AxiosResponse<ISupplierDataResponse> =
          await fetchSupplierDetail(orderId)
        const resData = res?.data
        setDetail(resData)

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
    [notify, setIsLoading],
  )

  const _onEditButtonClicked = () => {
    if (!params?.supplierId) { return }

    navigate(`/supplier/edit/${params.supplierId}`)
  }

  const _onRefetch = () => {
    _onFetchDetail(parseInt(params?.supplierId))
  }

  return {
    detail,
    isLoading,
    onRefetchDetail: _onRefetch,
    onEditButtonClicked: _onEditButtonClicked
  }
}

export default useSupplierDetailController
