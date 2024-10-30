// @ts-nocheck
import { Col, Flex, Image, InputNumber, Row } from 'antd'

import ImagePlaceholder from 'src/assets/images/figures/image-placeholder.webp'
import BookImgPlaceholder from 'src/assets/images/figures/book-image-placeholder.jpeg'
import EquipmentImgPlaceholder from 'src/assets/images/figures/student-equipment-image-placeholder.png'
import React from 'react'
import { BiTrash } from 'react-icons/bi'
import Spacer from 'src/components/view/Spacer'
import { appColors } from 'src/assets/styles/styles'
import { moneyFormatter } from 'src/helpers/formatter.helper'

import styles from '../../index.module.scss'
import { IStockOrderCartData } from 'src/models/stock-order.model'
import { STOCK_ORDER_TYPE } from 'src/enums/enums'

interface ICartItemProps {
  item: IStockOrderCartData
  onRemoveItem: (e: string) => void
  onUpdateItem?: (
    e: string,
    qty: number,
    handleClose: () => void,
    step?: string,
  ) => void
}

const CartItem: React.FC<ICartItemProps> = ({
  item,
  onRemoveItem,
  onUpdateItem,
}) => {
  return (
    <>
      <div className={styles?.cartItemWrapper}>
        <Row align={'middle'}>
          <Col xs={24} sm={20}>
            <Flex align="center">
              <Image
                src={
                  item?.itemObj?.imageUrl ||
                  (item?.itemObj?.itemType === STOCK_ORDER_TYPE?.book
                    ? BookImgPlaceholder
                    : EquipmentImgPlaceholder)
                }
                width={100}
                alt={item?.itemObj?.itemName}
                fallback={ImagePlaceholder}
              />
              <Spacer margin="auto 4px" />
              <div>
                <div className={styles?.itemType}>
                  {item?.itemObj?.itemType === STOCK_ORDER_TYPE?.book
                    ? 'Book'
                    : item?.itemObj?.itemType === STOCK_ORDER_TYPE?.equipment
                      ? 'Equipment'
                      : item?.itemObj?.itemType ===
                          STOCK_ORDER_TYPE?.courseVoucher
                        ? 'Course Voucher'
                        : '-'}
                </div>
                <div className={styles?.cartItemTitle}>
                  {item?.itemObj?.itemName}
                </div>
              </div>
            </Flex>
          </Col>
          <Col xs={24} sm={4}>
            <Flex justify="flex-end" align="center">
              <div
                className="clickable-wrapper"
                onClick={() => onRemoveItem(item?.itemObj?.localId)}>
                <BiTrash color={appColors?.red60} size={18} />
              </div>
            </Flex>
          </Col>
        </Row>

        <Spacer margin="1rem 0" />

        <Row align={'middle'}>
          <Col xs={8}>
            <div style={{ fontSize: '14px' }}>Order Qty</div>
          </Col>
          <Col xs={8}>
            <div style={{ fontSize: '14px' }}>Item Price</div>
          </Col>
          <Col xs={8}>
            <div style={{ fontSize: '14px' }}>Total Price</div>
          </Col>
        </Row>

        <Spacer margin="6px 0" />

        <Row align={'middle'}>
          <Col xs={8}>
            <InputNumber
              value={item?.qty}
              max={999}
              onStep={(e, step) =>
                onUpdateItem(item?.itemObj?.localId, e, () => {}, step.type)
              }
            />
          </Col>
          <Col xs={8}>
            {moneyFormatter(parseFloat(item?.itemObj?.price) || 0)}
          </Col>
          <Col xs={8}>
            {moneyFormatter(parseFloat(item?.itemObj?.price) * item.qty || 0)}
          </Col>
        </Row>
      </div>
    </>
  )
}
export default CartItem
