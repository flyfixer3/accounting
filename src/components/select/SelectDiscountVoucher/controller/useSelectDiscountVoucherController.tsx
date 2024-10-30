// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { useCallback, useState } from 'react'
import useToggle from 'src/hooks/useToggle'
import { AxiosResponse } from 'axios'
import { IDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import { IDiscountVoucherData } from 'src/models/discount-voucher.model'
import { fetchDiscountVoucherByStudentId } from 'src/services/discount-voucher.service'
import { moneyFormatter } from 'src/helpers/formatter.helper'

const useSelectDiscountVoucherController = () => {
  const { notify } = useApp()
  const [data, setData] = useState<IDiscountVoucherData[]>(null)
  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetchList = useCallback(
    async (id: number) => {
      setIsLoading()
      try {
        const res: AxiosResponse<IDataResponse<IDiscountVoucherData>> =
          await fetchDiscountVoucherByStudentId(id)
        const resData = res?.data?.data
        const options = Array.isArray(resData)
          ? resData.map((item) => {
              const discountValue: string = item?.voucherDiscountPercentage
                ? `${item?.voucherDiscountPercentage}%`
                : `${moneyFormatter(parseFloat(item?.voucherDiscountValue))}`

              return {
                ...item,
                label: `${item?.voucherCode} - ${discountValue}`,
                value: item.id,
              }
            })
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
    },
    [notify],
  )

  const _onRefetch = useCallback((id: number) => _onFetchList(id), [])

  return { data, isLoading, onRefetch: _onRefetch }
}

export default useSelectDiscountVoucherController
