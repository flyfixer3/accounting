// @ts-nocheck
import useToggle from 'src/hooks/useToggle'
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useApp } from 'src/context/app.context'
import { AxiosError, AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  IStockOrderCartData,
  IStockOrderCreateRequestPayload,
  IStockOrderRequestResponse,
} from 'src/models/stock-order.model'
import { requestCreateOrderCheckout } from 'src/services/stock-order.service'
interface IStockOrderContextData {
  cartItems: IStockOrderCartData[]
  getTotalCartItem: number
  isCartDrawerVisible?: boolean
  onCalculateSubtotal?: number
  formErrorMsg?: string
  isModalCheckoutConfirmVisible?: boolean
  isSubmitted: boolean
  onHandleAddToCart: (newItem: IStockOrderCartData) => void
  onHandleRemoveFromCart: (localId: string) => void
  onHandleUpdateCartItemQuantity: (
    localId: string,
    newQty: number,
    handleModalClose?: () => void,
    stepType?: string,
  ) => void
  onHandleCartDrawerVisibility?: () => void
  isItemInCart: (localId: string) => boolean
  onHandleSetFormErrorMsg: (value: string) => void
  onHandleModalCheckoutConfirmVisibility: () => void
  onHandleSubmitCheckout: () => void
}

export interface IProviderProps {
  children?: any
}

const StockOrderContext = createContext<IStockOrderContextData | undefined>(
  undefined,
)

export const useStockOrderContext = () => {
  const context = useContext(StockOrderContext)
  if (!context) {
    throw new Error('useApp must be used within an AuthProvider')
  }
  return context
}

export const StockOrderProvider: React.FC<IProviderProps> = ({ children }) => {
  const navigate = useNavigate()

  const { notify } = useApp()
  const [cartItems, setCartItems] = useState<IStockOrderCartData[]>([])

  const [formErrorMsg, setFormErrorMsg] = useState<string>('')

  const [isCartDrawerVisible, setIsCartDrawerVisible] = useToggle(false)
  const [isModalCheckoutConfirmVisible, setIsModalCheckoutConfirmVisible] =
    useToggle(false)
  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const _onSubmitCheckout = useCallback(
    async (payload: IStockOrderCreateRequestPayload) => {
      setIsSubmitted()

      try {
        const res: AxiosResponse<IStockOrderRequestResponse> =
          await requestCreateOrderCheckout(payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()
        setIsModalCheckoutConfirmVisible()

        navigate('/stock-order/orders')
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

  const _addItemToCart = (item: IStockOrderCartData) => {
    const newItem = { ...item }

    setCartItems([...cartItems, newItem])
  }

  const _removeItemFromCart = (localId: string) => {
    const updatedCart = cartItems.filter(
      (item) => item.itemObj?.localId !== localId,
    )
    setCartItems(updatedCart)
  }

  const _updateCartItemQuantity = (
    localId: string,
    newQuantity: number,
    handleModalClose: () => void,
    stepType: 'up' | 'down',
  ) => {
    let isUpdateFailed = false

    const updatedCart = cartItems.map((item) => {
      let updatedQty = 0
      if (stepType) {
        if (stepType === 'down') updatedQty = item.qty -= 1
        else if (stepType === 'up') updatedQty = item.qty += 1
      } else {
        updatedQty = item?.qty + newQuantity
      }

      if (updatedQty >= 999) {
        // reach max avail qty
        setFormErrorMsg('You have reached maximum available quantity')
        isUpdateFailed = true
      } else if (updatedQty < 0) {
        setFormErrorMsg('Order quantity must be more than 1')
        isUpdateFailed = true
      }

      return item.itemObj?.localId === localId
        ? { ...item, qty: updatedQty }
        : item
    })

    if (!isUpdateFailed) {
      setCartItems(updatedCart)
      handleModalClose && handleModalClose()
    }
  }

  const _onHandleAddToCart = (newItem: IStockOrderCartData) => {
    _addItemToCart(newItem)
  }

  const _onHandleRemoveFromCart = (locaIdToRemove: string) => {
    _removeItemFromCart(locaIdToRemove)
  }

  const _onHandleUpdateCartItemQuantity = (
    localIdToUpdate: string,
    newQuantity: number,
    handleModalClose: () => void,
    stepType?: 'up' | 'down',
  ) => {
    _updateCartItemQuantity(
      localIdToUpdate,
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
    const orderDetailList = cartItems?.map((item) => {
      return {
        itemId: item?.itemObj?.itemId,
        itemType: item?.itemObj?.itemType,
        qty: item?.qty,
      }
    })

    const payload = { orderDetailList }
    _onSubmitCheckout(payload)
  }

  const _calculateItemTotal = (item: IStockOrderCartData) => {
    const itemPrice = parseFloat(item?.itemObj?.price)

    const quantity = item.qty
    return itemPrice * quantity
  }

  const _isItemInCart = (localId: string) => {
    return cartItems?.some((item) => item?.itemObj?.localId === localId)
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

  const data: IStockOrderContextData = {
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
    <StockOrderContext.Provider value={data}>
      {children}
    </StockOrderContext.Provider>
  )
}
