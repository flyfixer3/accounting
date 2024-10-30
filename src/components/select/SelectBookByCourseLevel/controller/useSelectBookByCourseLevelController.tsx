// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import { IBookByCourseLevelListResponse } from 'src/models/books.model'
import { ISelectData } from 'src/models/general.model'
import { IDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import { fetchBookByCourseLevel } from 'src/services/books.service'
import { AxiosResponse } from 'axios'
import { useCallback, useState } from 'react'

const useSelectBookByCourseLevelController = () => {
  const { notify } = useApp()
  const [data, setData] = useState<ISelectData[]>(null)

  const [isLoading, setIsLoading] = useToggle(false)

  const _onFetchList = useCallback(
    async (id: number) => {
      setIsLoading()
      try {
        const res: AxiosResponse<
          IDataResponse<IBookByCourseLevelListResponse>
        > = await fetchBookByCourseLevel(id)
        const resData = res?.data?.data
        const options = Array.isArray(resData)
          ? resData.map((item) => ({
              ...item,
              label: `${String(item?.bookName)} - ${item?.bookNumber} `,
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
    },
    [notify],
  )

  const _onRefetch = useCallback((id: number) => _onFetchList(id), [])

  return { onRefetch: _onRefetch, isLoading, data }
}

export default useSelectBookByCourseLevelController
