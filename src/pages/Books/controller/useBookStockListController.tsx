// @ts-nocheck
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import {
  IBookStockListData,
  IBookStockListPayload,
} from 'src/models/books.model'
import { IDataResponse } from 'src/models/request.model'
import { errorHandler } from 'src/services/api.service'
import { fetchBookStockList } from 'src/services/books.service'
import { AxiosResponse } from 'axios'
import { useCallback, useEffect, useState } from 'react'

const useBookStockListController = () => {
  const { notify } = useApp()

  const [bookList, setBookList] = useState<IBookStockListData[]>(null)
  const [queryParams, setQueryParams] = useState<IBookStockListPayload>({
    page: 1,
    limit: 20,
    search: '',
  })
  const [selectedBook, setSelectedBook] = useState<IBookStockListData>(null)

  const [isModalAddBookVisible, setIsModalAddBookVisible] = useToggle(false)

  const [isLoading, setIsLoading] = useToggle(false)
  const [isFetchList, setIsFetchList] = useToggle(false)

  const _onFetchList = useCallback(
    async (query?: IBookStockListPayload, isFetchList?: boolean) => {
      setIsLoading()
      try {
        const res: AxiosResponse<IDataResponse<IBookStockListData>> =
          await fetchBookStockList(query)
        const resData = res?.data?.data
        const list: IBookStockListData[] = Array.isArray(resData)
          ? resData?.map((item: IBookStockListData) => ({
              ...item,
              currentStock: parseInt(item?.qty),
            }))
          : []

        setBookList(list)

        setQueryParams({
          search: query?.search || '',
        })

        isFetchList && setIsFetchList()
        setIsLoading()
      } catch (err) {
        const { message } = errorHandler(err)
        notify.error({
          message: 'Error',
          description: message,
          duration: 5,
        })
        isFetchList && setIsFetchList()
        setIsLoading()
      }
    },
    [],
  )

  const _onRefetch = () => {
    _onFetchList(queryParams, isFetchList)
  }

  const _onChangeSearch = (search: string) => {
    setQueryParams({ ...queryParams, search })
    setIsFetchList()
  }

  const _onHandleModalAddBookVisibility = () => {
    setIsModalAddBookVisible()
  }

  const _onHandleSelectedData = (e: IBookStockListData) => {
    setSelectedBook(e)
    _onHandleModalAddBookVisibility()
  }

  const _onCheckStock = (bookId: number, qtyAddedToCart: number) => {
    const updatedList = bookList.map((book) => {
      if (book.id === bookId) {
        return {
          ...book,
          currentStock: book.currentStock - qtyAddedToCart,
        }
      }
      return book
    })

    setBookList(updatedList)

    return updatedList
  }

  useEffect(() => {
    if (isFetchList) _onRefetch()
  }, [isFetchList])

  return {
    bookList,
    isLoading,
    selectedBook,
    isModalAddBookVisible,
    onChangeSearch: _onChangeSearch,
    onRefetch: _onRefetch,
    onHandleSelectedData: _onHandleSelectedData,
    onHandleModalAddBookVisibility: _onHandleModalAddBookVisibility,
    onCheckStock: _onCheckStock,
  }
}

export default useBookStockListController
