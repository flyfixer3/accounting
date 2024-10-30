// @ts-nocheck
import { Col, Image, Row } from 'antd'
import Card from 'antd/es/card/Card'
import { moneyFormatter } from 'src/helpers/formatter.helper'

import BookImgPlaceholder from 'src/assets/images/figures/book-image-placeholder.jpeg'
import EquipmentImgPlaceholder from 'src/assets/images/figures/student-equipment-image-placeholder.png'

import styles from '../index.module.scss'
import React from 'react'
import { IStockOrderAvailableListData } from 'src/models/stock-order.model'
import { STOCK_ORDER_TYPE } from 'src/enums/enums'

interface IListItemProps {
  item: IStockOrderAvailableListData
  idx: number
  onHandleSelectedData: (e: IStockOrderAvailableListData) => void
}

const ListItem: React.FC<IListItemProps> = ({
  item,
  idx,
  onHandleSelectedData,
}) => {
  // const isItemOutOfStock = useMemo(() => {
  //   const availableStock: number = item.currentStock
  //   if (availableStock < 1) return true
  //   return false
  // }, [item.currentStock])

  // const isItemAlmostOutOfStock = useMemo(() => {
  //   const availableStock: number = item.currentStock
  //   if (availableStock > 0 && availableStock <= 10) return true
  //   return false
  // }, [item?.currentStock])

  return (
    <Col xs={24} md={6}>
      <Card
        hoverable={true}
        onClick={() => onHandleSelectedData(item)}
        className={styles?.itemWrapper}
        bodyStyle={{ padding: 0 }}
        style={{
          height: '100%',
        }}>
        <Row gutter={[8, 8]}>
          <Col xs={24}>
            <div className={styles.itemImgWrapper}>
              <Image
                src={
                  item?.imageUrl ||
                  (item?.itemType === STOCK_ORDER_TYPE?.book
                    ? BookImgPlaceholder
                    : EquipmentImgPlaceholder)
                }
                width={'100%'}
                height={'240px'}
                alt={item?.itemName}
                style={{
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
                preview={false}
              />
            </div>
          </Col>
          <Col xs={24}>
            <div className={styles.itemWordingWrapper}>
              <div className={styles?.itemType}>
                {item?.itemType === STOCK_ORDER_TYPE?.book
                  ? 'Book'
                  : item?.itemType === STOCK_ORDER_TYPE?.equipment
                    ? 'Equipment'
                    : item?.itemType === STOCK_ORDER_TYPE?.courseVoucher
                      ? 'Course Voucher'
                      : '-'}
              </div>
              <div className={[styles.itemTitle].join(' ')}>
                {item?.itemName || '-'}
              </div>
              <div className={[styles.itemPrice].join(' ')}>
                {moneyFormatter(parseFloat(item?.price) || 0)}
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </Col>
  )
}

export default ListItem
