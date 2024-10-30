// @ts-nocheck
import useToggle from 'src/hooks/useToggle'
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  IBookOrderCartData,
  IBookOrderRequestPayload,
  IBookOrderRequestResponse,
} from 'src/models/books.model'
import { useApp } from 'src/context/app.context'
import { AxiosError, AxiosResponse } from 'axios'
import { requestBookOrderCheckout } from 'src/services/books.service'
import { useNavigate } from 'react-router-dom'
interface IBookOrderContextData {
  cartItems: IBookOrderCartData[]
  getTotalCartItem: number
  isCartDrawerVisible?: boolean
  onCalculateSubtotal?: number
  formErrorMsg?: string
  isModalCheckoutConfirmVisible?: boolean
  isSubmitted: boolean
  onHandleAddToCart: (newItem: IBookOrderCartData) => void
  onHandleRemoveFromCart: (bookId: number) => void
  onHandleUpdateCartItemQuantity: (
    bookId: number,
    newQty: number,
    handleModalClose?: () => void,
    stepType?: string,
  ) => void
  onHandleCartDrawerVisibility?: () => void
  isItemInCart: (bookId: number) => boolean
  onHandleSetFormErrorMsg: (value: string) => void
  onHandleModalCheckoutConfirmVisibility: () => void
  onHandleSubmitCheckout: () => void
}

export interface IProviderProps {
  children?: any
}

const BookOrderContext = createContext<IBookOrderContextData | undefined>(
  undefined,
)

export const useBookOrderContext = () => {
  const context = useContext(BookOrderContext)
  if (!context) {
    throw new Error('useApp must be used within an AuthProvider')
  }
  return context
}

export const BookOrderProvider: React.FC<IProviderProps> = ({ children }) => {
  const navigate = useNavigate()

  const { notify } = useApp()
  const [cartItems, setCartItems] = useState<IBookOrderCartData[]>([])

  const [formErrorMsg, setFormErrorMsg] = useState<string>('')

  const [isCartDrawerVisible, setIsCartDrawerVisible] = useToggle(false)
  const [isModalCheckoutConfirmVisible, setIsModalCheckoutConfirmVisible] =
    useToggle(false)
  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const _onSubmitCheckout = useCallback(
    async (payload: IBookOrderRequestPayload) => {
      setIsSubmitted()

      try {
        const res: AxiosResponse<IBookOrderRequestResponse> =
          await requestBookOrderCheckout(payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()
        setIsModalCheckoutConfirmVisible()

        navigate('/books/order')
      } catch (err) {
        const { message }: AxiosError = err?.response?.data

        setFormErrorMsg(message)

        notify.error({
          message: 'Error',
          description: message,
          duration: 5,
        })

        setIsSubmitted()
      }
    },
    [],
  )

  const _addItemToCart = (item: IBookOrderCartData) => {
    const newItem = { ...item }
    newItem.bookObj.currentStock = parseInt(newItem.bookObj.qty) - item.qty
    setCartItems([...cartItems, newItem])
  }

  const _removeItemFromCart = (bookId: number) => {
    const updatedCart = cartItems.filter((item) => item.bookObj.id !== bookId)
    setCartItems(updatedCart)
  }

  const _updateCartItemQuantity = (
    bookId: number,
    newQuantity: number,
    handleModalClose: () => void,
    stepType: 'up' | 'down',
  ) => {
    let isUpdateFailed = false

    const updatedCart = cartItems.map((item) => {
      const newObjItem = { ...item.bookObj }

      newObjItem.currentStock = parseInt(item.bookObj.qty) - newQuantity

      let updatedQty = 0
      if (stepType) {
        if (stepType === 'down') updatedQty = item.qty -= 1
        else if (stepType === 'up') updatedQty = item.qty += 1
      } else {
        updatedQty = item?.qty + newQuantity
      }

      if (updatedQty >= parseInt(newObjItem.qty)) {
        // reach max avail qty
        setFormErrorMsg('You have reached maximum available quantity')
        isUpdateFailed = true
      } else if (updatedQty < 0) {
        setFormErrorMsg('Order quantity must be more than 1')
        isUpdateFailed = true
      }

      return item.bookObj.id === bookId ? { ...item, qty: updatedQty } : item
    })

    if (!isUpdateFailed) {
      setCartItems(updatedCart)
      handleModalClose && handleModalClose()
    }
  }

  const _onHandleAddToCart = (newItem: IBookOrderCartData) => {
    _addItemToCart(newItem)
  }

  const _onHandleRemoveFromCart = (bookIdToRemove: number) => {
    _removeItemFromCart(bookIdToRemove)
  }

  const _onHandleUpdateCartItemQuantity = (
    bookIdToUpdate: number,
    newQuantity: number,
    handleModalClose: () => void,
    stepType?: 'up' | 'down',
  ) => {
    _updateCartItemQuantity(
      bookIdToUpdate,
      newQuantity,
      handleModalClose,
      stepType,
    )
  }

  const _onHandleCartDrawerVisibility = () => setIsCartDrawerVisible()

  const _onHandleModalCheckoutConfirmVisibility = () =>
    setIsModalCheckoutConfirmVisible()

  const _onHandleSetFormErrorMsg = (val: string) => setFormErrorMsg(val)

  const _onHandleSubmitCheckout = () => {
    const orderBookList = cartItems?.map((item) => {
      return {
        bookStockId: item?.bookObj?.id,
        qty: item?.qty,
      }
    })

    const payload = { orderBookList }
    _onSubmitCheckout(payload)
  }

  const _calculateItemTotal = (item: IBookOrderCartData) => {
    const bookPrice = parseFloat(item?.bookObj?.bookPrice)

    const quantity = item.qty
    return bookPrice * quantity
  }

  const _isItemInCart = (bookId: number) => {
    return cartItems?.some((item) => item?.bookObj?.id === bookId)
  }

  const _onCalculateSubtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + _calculateItemTotal(item),
      0,
    )
  }, [cartItems])

  const getTotalCartItem = useMemo(() => {
    if (cartItems?.length > 0) return cartItems?.length
    else return 0
  }, [cartItems])

  const data: IBookOrderContextData = {
    cartItems,
    getTotalCartItem,
    isCartDrawerVisible,
    onCalculateSubtotal: _onCalculateSubtotal,
    formErrorMsg,
    isModalCheckoutConfirmVisible,
    isSubmitted,
    onHandleAddToCart: _onHandleAddToCart,
    onHandleRemoveFromCart: _onHandleRemoveFromCart,
    onHandleUpdateCartItemQuantity: _onHandleUpdateCartItemQuantity,
    onHandleCartDrawerVisibility: _onHandleCartDrawerVisibility,
    isItemInCart: _isItemInCart,
    onHandleSetFormErrorMsg: _onHandleSetFormErrorMsg,
    onHandleModalCheckoutConfirmVisibility:
      _onHandleModalCheckoutConfirmVisibility,
    onHandleSubmitCheckout: _onHandleSubmitCheckout,
  }

  return (
    <BookOrderContext.Provider value={data}>
      {children}
    </BookOrderContext.Provider>
  )
}
