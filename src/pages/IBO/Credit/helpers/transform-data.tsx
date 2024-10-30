// @ts-nocheck
import moment from 'moment'
import { DATETIME_FORMATTER_ENUM, SUPPLIER_ORDER_TYPE } from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import {
  IReportPurchaseListResponse,
  IReportSalesListResponse,
  IReportStocksListResponse,
} from 'src/models/report.model'

type TransformType = 'date' | 'currency' | 'supplier-order-item-type'

const customValueTransformation = (value: any, type?: TransformType) => {
  // Implement your custom logic here
  // For example, you can format dates, numbers, or apply any other transformations
  if (type === 'date') {
    return value ? moment(value).format(DATETIME_FORMATTER_ENUM?.primary) : '-'
  } else if (type === 'currency') {
    return moneyFormatter(parseFloat(value) || 0)
  } else if (type === 'supplier-order-item-type') {
    return value === SUPPLIER_ORDER_TYPE?.book
      ? 'Book'
      : value === SUPPLIER_ORDER_TYPE?.courseVoucher
        ? 'Course Voucher'
        : value === SUPPLIER_ORDER_TYPE?.equipment
          ? 'Equipment'
          : '-'
  }
  return value
}

export const transformPurchaseDataToExcel = (
  data: IReportPurchaseListResponse[],
) => {
  const customHeaders = [
    'Order ID',
    'Order Date',
    'Supplier Name',
    'Item Name',
    'Item Type',
    'Order Buy Quantity',
    'Order Buy Price',
    'Total Order Buy Price',
    'Received Quantity',
    'Selling Price',
    'Payment Status',
    'Payment Method',
    'Bank',
  ]

  // Transform data to match the custom headers and values
  const transformedData = data.map((item) => ({
    'Order ID': customValueTransformation(item?.orderId || '-'),
    'Order Date': customValueTransformation(item?.orderDate, 'date'),
    'Supplier Name': customValueTransformation(
      item?.supplier?.supplierName || '-',
    ),
    'Item Name': customValueTransformation(item?.itemName || '-'),
    'Item Type': customValueTransformation(
      item?.itemType,
      'supplier-order-item-type',
    ),
    'Order Buy Quantity': customValueTransformation(item?.orderQty || 0),
    'Order Buy Price': customValueTransformation(item?.buyPrice, 'currency'),
    'Total Order Buy Price': customValueTransformation(
      item?.totalBuyPrice,
      'currency',
    ),
    'Received Quantity': customValueTransformation(item?.totalReceivedQty || 0),
    'Selling Price': customValueTransformation(item?.sellingPrice, 'currency'),
    'Payment Status': customValueTransformation(item?.paymentStatus || '-'),
    'Payment Method': customValueTransformation(
      item?.paymentMethod?.account_name_display || '-',
    ),
  }))

  return {
    customHeaders,
    transformedData,
  }
}

export const transformSalesDataToExcel = (data: IReportSalesListResponse[]) => {
  const customHeaders = [
    'Order ID',
    'Order Date',
    'Training Center',
    'Item Name',
    'Item Type',
    'Order Buy Quantity',
    'Order Buy Price',
    'Total Order Buy Price',
    'Sent Quantity',
    'Received Quantity',
    'Selling Price',
    'Payment Status',
    'Payment Method',
    'Bank',
  ]

  // Transform data to match the custom headers and values
  const transformedData = data.map((item) => ({
    'Order ID': customValueTransformation(item?.orderId || '-'),
    'Order Date': customValueTransformation(item?.orderDate, 'date'),
    'Training Center': customValueTransformation(
      item?.trainingCenter?.name || '-',
    ),
    'Item Name': customValueTransformation(item?.itemName || '-'),
    'Item Type': customValueTransformation(
      item?.itemType,
      'supplier-order-item-type',
    ),
    'Order Buy Quantity': customValueTransformation(item?.orderQty || 0),
    'Order Buy Price': customValueTransformation(item?.buyPrice, 'currency'),
    'Total Order Buy Price': customValueTransformation(
      item?.totalBuyPrice,
      'currency',
    ),
    'Sent Quantity': customValueTransformation(item?.totalSentQty || 0),
    'Received Quantity': customValueTransformation(item?.totalReceivedQty || 0),
    'Selling Price': customValueTransformation(item?.sellingPrice, 'currency'),
    'Payment Status': customValueTransformation(item?.orderStatus || '-'),
    'Payment Method': customValueTransformation(
      item?.paymentMethod?.account_name_display || '-',
    ),
  }))

  return {
    customHeaders,
    transformedData,
  }
}

export const transformStockDataToExcel = (
  data: IReportStocksListResponse[],
) => {
  const customHeaders = ['Item ID', 'Item Name', 'Item Type']

  // Transform data to match the custom headers and values
  const transformedData = data.map((item) => ({
    'Item ID': customValueTransformation(item?.itemId || '-'),
    'Item Name': customValueTransformation(item?.itemName || '-'),
    'Item Type': customValueTransformation(
      item?.itemType,
      'supplier-order-item-type',
    ),
  }))

  return {
    customHeaders,
    transformedData,
  }
}
