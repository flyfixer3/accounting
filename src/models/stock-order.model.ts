// @ts-nocheck
export interface IStockOrderListResponse {
  id: number
  orderStatus: string
  rejectReason: string
  totalPrice: string
  createdAt: string
  updatedAt: string
}

export interface IStockOrderListMetaResponse {
  currentTotalData: number
  totalData: number
  totalPending: number
  totalRejected: number
  totalUnpaid: number
  totalPaid: number
  totalPaidAmount: string
  totalUnpaidAmount: string
  totalAmount: string
}

export interface IStockOrderDetailsData {
  id: number
  itemName: string
  itemType: string
  price: string
  qty: number
  receivedQty: number
  isPerBundle: boolean
  createdAt: string
  updatedAt: string
}

export interface IStockOrderDetailResponse {
  id: number
  orderStatus: string
  rejectReason: string
  totalPrice: string
  orderDetails: IStockOrderDetailsData[]
  createdAt: string
  updatedAt: string
}

export interface IStockOrderReceiveItemDetailData {
  id: number
  itemNumberList: string[]
  qty: number
  receivedAt: string
  createdAt: string
  updatedAt: string
}

export interface IStockOrderSentItemDetailData {
  id: number
  itemNumberList: string[]
  qty: number
  isConfirmed: boolean
  sendAt: string
  createdAt: string
  updatedAt: string
}
export interface IStockOrderReceiveItemDetailResponse {
  id: number
  itemName: string
  itemType: string
  price: string
  qty: string
  isPerBundle: boolean
  orderItemReceivedDetails: IStockOrderReceiveItemDetailData[]
  orderItemSentDetails: IStockOrderSentItemDetailData[]
  createdAt: string
  updatedAt: string
}

export interface IStockOrderAvailableListData {
  localId?: string
  itemId: number
  itemName: string
  itemType: string
  price: string
  imageUrl: string
}

export interface IStockOrderAvailableListQueryParams {
  itemType: string
  search: string
}

export interface IStockOrderAddItemForm {
  itemObj?: IStockOrderAvailableListData
  qty: number
}

export interface IStockOrderCartData {
  itemObj?: IStockOrderAvailableListData
  qty: number
}

export interface IStockOrderCreateRequestPayload {
  orderDetailList: {
    itemId: number
    itemType: string
    qty: number
  }[]
}

export interface IStockOrderRequestResponse {
  message: string
}
