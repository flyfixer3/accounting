// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import useToggle from 'src/hooks/useToggle'

import { AxiosResponse } from 'axios'
import { IDataResponse, IDetailPayload } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import {
  IStudentEquipmentOrderDetailData,
  IStudentEquipmentOrderDetailResponse,
} from 'src/models/student-equipment.model'
import { fetchStudentEquipmentOrderDetail } from 'src/services/student-equipment.service'

const useStudentEquipmentOrderDetailController = () => {
  const { notify } = useApp()
  const params = useParams()

  const [detailData, setDetailData] =
    useState<IStudentEquipmentOrderDetailResponse>()

  const [isFetch, setIsFetch] = useToggle(false)
  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetch = useCallback(
    async (id: string, isFetch?: boolean) => {
      setIsLoading()

      const payload: IDetailPayload = { id }

      try {
        const res: AxiosResponse<
          IDataResponse<IStudentEquipmentOrderDetailResponse>
        > = await fetchStudentEquipmentOrderDetail(payload)

        const equipmentDetailData: IStudentEquipmentOrderDetailResponse =
          res?.data?.data
        setDetailData(equipmentDetailData)

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

  const _onRefetch = async () => {
    await _onFetch(params?.id, isFetch)
  }

  const _getTotalQtyAndPrice = useMemo(() => {
    let totalQty = 0
    let totalPrice = 0

    detailData?.orderEquipmentDetails?.forEach(
      (item: IStudentEquipmentOrderDetailData) => {
        const qty: number = parseInt(item?.qty)
        const price: number = parseFloat(
          item?.iboEquipmentStock?.equipmentPrice,
        )

        totalQty += qty

        totalPrice += qty * price
      },
    )

    return {
      totalQty,
      totalPrice,
    }
  }, [detailData])

  useEffect(() => {
    _onRefetch()
  }, [])

  return {
    detailData,
    params,
    isLoading,
    getTotalQtyAndPrice: _getTotalQtyAndPrice,
  }
}

export default useStudentEquipmentOrderDetailController
