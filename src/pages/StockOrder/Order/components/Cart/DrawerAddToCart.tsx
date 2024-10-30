// @ts-nocheck
import { Button, Col, Drawer, Flex, Image, Row } from 'antd'

import styles from '../../index.module.scss'
import { DrawerClassNames } from 'antd/es/drawer/DrawerPanel'
import { AiOutlineClose } from 'react-icons/ai'
import Spacer from 'src/components/view/Spacer'

import EmptyCartImg from 'src/assets/images/figures/empty-cart.png'
import ImagePlaceholder from 'src/assets/images/figures/image-placeholder.webp'
import CartItem from './CartItem'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import { useStockOrderContext } from 'src/pages/StockOrder/context/stock-order.context'

const DrawerAddToCart = () => {
  const {
    cartItems,
    isCartDrawerVisible,
    onHandleCartDrawerVisibility,
    getTotalCartItem,
    onHandleRemoveFromCart,
    onCalculateSubtotal,
    onHandleUpdateCartItemQuantity,
    onHandleModalCheckoutConfirmVisibility,
  } = useStockOrderContext()
  if (!isCartDrawerVisible) return

  const classNames: DrawerClassNames = {
    body: styles.drawerBody,
  }

  const _onRenderEmptyCart =
    getTotalCartItem === 0 ? (
      <>
        <Image
          src={EmptyCartImg}
          alt="empty-cart"
          fallback={ImagePlaceholder}
          preview={false}
        />
        <div className={styles?.emptyTitle}>Your cart is empty</div>
        <div className={styles?.emptyDesc}>
          Looks like you haven't added any Item to your cart yet.
        </div>
      </>
    ) : null

  const _onRenderCartItems =
    cartItems && cartItems?.length > 0 ? (
      <div className={styles?.cartItemsWrapper}>
        {cartItems?.map((item, idx) => (
          <CartItem
            item={item}
            key={idx}
            onRemoveItem={onHandleRemoveFromCart}
            onUpdateItem={onHandleUpdateCartItemQuantity}
          />
        ))}
      </div>
    ) : null

  return (
    <>
      <Drawer
        width={420}
        placement="right"
        closable={false}
        onClose={onHandleCartDrawerVisibility}
        open={isCartDrawerVisible}
        classNames={classNames}
        title={
          <>
            <Row>
              <Col xs={24} sm={12}>
                <div>Order Item Cart List</div>
              </Col>

              <Col xs={24} sm={12}>
                <Flex justify="end" align="center">
                  <div>
                    {getTotalCartItem} {getTotalCartItem > 1 ? 'Items' : 'Item'}
                  </div>
                  <Spacer margin={'auto 4px'} />
                  <AiOutlineClose
                    size={18}
                    onClick={onHandleCartDrawerVisibility}
                  />
                </Flex>
              </Col>
            </Row>
          </>
        }
        footer={
          <>
            <Flex justify="space-between" align="center">
              <div>
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                  Subtotal
                </div>
                <div style={{ fontWeight: 600 }}>
                  {moneyFormatter(onCalculateSubtotal || 0)}
                </div>
              </div>
              <Button
                type="primary"
                disabled={getTotalCartItem === 0}
                onClick={() => {
                  onHandleCartDrawerVisibility()
                  onHandleModalCheckoutConfirmVisibility()
                }}>
                Checkout
              </Button>
            </Flex>
          </>
        }>
        <div>
          {_onRenderEmptyCart}
          {_onRenderCartItems}
        </div>
      </Drawer>
    </>
  )
}

export default DrawerAddToCart
