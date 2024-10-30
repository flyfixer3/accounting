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
  IStudentEquipmentOrderCartData,
  IStudentEquipmentOrderRequestPayload,
  IStudentEquipmentOrderRequestResponse,
} from 'src/models/student-equipment.model'
import { requestStudentEquipmentOrderCheckout } from 'src/services/student-equipment.service'

interface IStudentEquipmentOrderContextData {
  cartItems: IStudentEquipmentOrderCartData[]
  getTotalCartItem: number
  isCartDrawerVisible?: boolean
  onCalculateSubtotal?: number
  formErrorMsg?: string
  isModalCheckoutConfirmVisible?: boolean
  isSubmitted: boolean
  onHandleAddToCart: (newItem: IStudentEquipmentOrderCartData) => void
  onHandleRemoveFromCart: (equipmentId: number) => void
  onHandleUpdateCartItemQuantity: (
    equipmentId: number,
    newQty: number,
    handleModalClose?: () => void,
    stepType?: string,
  ) => void
  onHandleCartDrawerVisibility?: () => void
  isItemInCart: (equipmentId: number) => boolean
  onHandleSetFormErrorMsg: (value: string) => void
  onHandleModalCheckoutConfirmVisibility: () => void
  onHandleSubmitCheckout: () => void
}

export interface IProviderProps {
  children?: any
}

const StudentEquipmentOrderContext = createContext<
  IStudentEquipmentOrderContextData | undefined
>(undefined)

export const useStudentEquipmentOrderContext = () => {
  const context = useContext(StudentEquipmentOrderContext)
  if (!context) {
    throw new Error('useApp must be used within an AuthProvider')
  }
  return context
}

export const StudentEquipmentOrderProvider: React.FC<IProviderProps> = ({
  children,
}) => {
  const navigate = useNavigate()

  const { notify } = useApp()
  const [cartItems, setCartItems] = useState<IStudentEquipmentOrderCartData[]>(
    [],
  )

  const [formErrorMsg, setFormErrorMsg] = useState<string>('')

  const [isCartDrawerVisible, setIsCartDrawerVisible] = useToggle(false)
  const [isModalCheckoutConfirmVisible, setIsModalCheckoutConfirmVisible] =
    useToggle(false)
  const [isSubmitted, setIsSubmitted] = useToggle(false)

  const _onSubmitCheckout = useCallback(
    async (payload: IStudentEquipmentOrderRequestPayload) => {
      setIsSubmitted()

      try {
        const res: AxiosResponse<IStudentEquipmentOrderRequestResponse> =
          await requestStudentEquipmentOrderCheckout(payload)

        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        setIsSubmitted()
        setIsModalCheckoutConfirmVisible()

        navigate('/student-equipment/order')
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

  const _addItemToCart = (item: IStudentEquipmentOrderCartData) => {
    const newItem = { ...item }
    newItem.equipmentObj.currentStock =
      parseInt(newItem.equipmentObj.qty) - item.qty
    setCartItems([...cartItems, newItem])
  }

  const _removeItemFromCart = (equipmentId: number) => {
    const updatedCart = cartItems.filter(
      (item) => item.equipmentObj.id !== equipmentId,
    )
    setCartItems(updatedCart)
  }

  const _updateCartItemQuantity = (
    equipmentId: number,
    newQuantity: number,
    handleModalClose: () => void,
    stepType: 'up' | 'down',
  ) => {
    let isUpdateFailed = false

    const updatedCart = cartItems.map((item) => {
      const newObjItem = { ...item.equipmentObj }

      newObjItem.currentStock = parseInt(item.equipmentObj.qty) - newQuantity

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

      return item.equipmentObj.id === equipmentId
        ? { ...item, qty: updatedQty }
        : item
    })

    if (!isUpdateFailed) {
      setCartItems(updatedCart)
      handleModalClose && handleModalClose()
    }
  }

  const _onHandleAddToCart = (newItem: IStudentEquipmentOrderCartData) => {
    _addItemToCart(newItem)
  }

  const _onHandleRemoveFromCart = (equipmentIdToRemove: number) => {
    _removeItemFromCart(equipmentIdToRemove)
  }

  const _onHandleUpdateCartItemQuantity = (
    equipmentIdToUpdate: number,
    newQuantity: number,
    handleModalClose: () => void,
    stepType?: 'up' | 'down',
  ) => {
    _updateCartItemQuantity(
      equipmentIdToUpdate,
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
    const orderEquipmentList = cartItems?.map((item) => {
      return {
        equipmentStockId: item?.equipmentObj?.id,
        qty: item?.qty,
      }
    })

    const payload = { orderEquipmentList }
    _onSubmitCheckout(payload)
  }

  const _calculateItemTotal = (item: IStudentEquipmentOrderCartData) => {
    const equipmentPrice = parseFloat(item?.equipmentObj?.equipmentPrice)

    const quantity = item.qty
    return equipmentPrice * quantity
  }

  const _isItemInCart = (equipmentId: number) => {
    return cartItems?.some((item) => item?.equipmentObj?.id === equipmentId)
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

  const data: IStudentEquipmentOrderContextData = {
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
    <StudentEquipmentOrderContext.Provider value={data}>
      {children}
    </StudentEquipmentOrderContext.Provider>
  )
}
