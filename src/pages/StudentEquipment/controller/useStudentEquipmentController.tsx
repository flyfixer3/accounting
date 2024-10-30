// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { STATUS_ENUM } from 'src/enums/enums'
import { IListDataResponse } from 'src/models/request.model'
import {
  IStudentEquipmentList,
  IStudentEquipmentListPayload,
  IStudentEquipmentMetaResponse,
} from 'src/models/student-equipment.model'
import { useCallback, useEffect, useState } from 'react'
import useToggle from 'src/hooks/useToggle'
import { AxiosResponse } from 'axios'
import { errorHandler } from 'src/services/api.service'
import { fetchStudentEquipmentList } from 'src/services/student-equipment.service'
import { useNavigate } from 'react-router-dom'

const useStudentEquipmentController = () => {
  const navigate = useNavigate()
  const { notify } = useApp()

  const [equipmentData, setEquipmentData] =
    useState<
      IListDataResponse<IStudentEquipmentList, IStudentEquipmentMetaResponse>
    >(null)
  const [queryParams, setQueryParams] = useState<IStudentEquipmentListPayload>({
    page: 1,
    limit: 20,
    search: '',
    status: STATUS_ENUM?.all,
  })
  const [selectedData, setSelectedData] = useState<IStudentEquipmentList>(null)
  const [isModalPurchaseVisible, setIsModalPurchaseVisible] = useToggle(false)

  const [isFetch, setIsFetch] = useToggle(false)
  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetchList = useCallback(
    async (query?: IStudentEquipmentListPayload, isFetch?: boolean) => {
      setIsLoading()
      try {
        const res: AxiosResponse<
          IListDataResponse<
            IStudentEquipmentList,
            IStudentEquipmentMetaResponse
          >
        > = await fetchStudentEquipmentList(query)

        setEquipmentData(res?.data)
        setQueryParams({
          page: res?.data?.pagination?.page,
          limit: res?.data?.pagination?.limit,
          status: query?.status || STATUS_ENUM?.all,
          search: query?.search || '',
        })

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
    [],
  )

  const _onRefetch = () => {
    _onFetchList(queryParams, isFetch)
  }

  const _handleChangeStatus = async (status: string) => {
    await setQueryParams({ ...queryParams, status })
    setIsFetch()
  }

  const _handleModalPurchaseVisibility = () => {
    setIsModalPurchaseVisible()
  }

  const _handleClickAction = (
    type: string,
    id: string,
    record?: IStudentEquipmentList,
  ) => {
    if (type === 'detail') {
      navigate(`/student-equipment/${id}`)
    } else if (type === 'edit') {
      navigate(`/student-equipment/edit/${id}`)
    } else if (type === 'purchase') {
      setSelectedData(record)
      _handleModalPurchaseVisibility()
    }
  }

  useEffect(() => {
    if (isFetch) _onRefetch()
  }, [isFetch])

  return {
    onRefetch: _onRefetch,
    onFetchList: _onFetchList,
    equipmentData,
    queryParams,
    setQueryParams,
    setIsFetch,
    isLoading,
    isModalPurchaseVisible,
    selectedData,
    handleChangeStatus: _handleChangeStatus,
    handleClickAction: _handleClickAction,
    handleModalPurchaseVisibility: _handleModalPurchaseVisibility,
  }
}

export default useStudentEquipmentController
