// @ts-nocheck
import Modal from 'antd/es/modal/Modal'
import { Button, Col, Flex, Image, Row } from 'antd'

import CheckoutImage from 'src/assets/images/figures/checkout.png'

import styles from '../index.module.scss'
import { useStockOrderContext } from '../../context/stock-order.context'

const ModalCheckoutConfirmation = () => {
  const {
    isModalCheckoutConfirmVisible,
    onHandleModalCheckoutConfirmVisibility,
    onHandleSubmitCheckout,
    isSubmitted,
  } = useStockOrderContext()

  if (!isModalCheckoutConfirmVisible) return

  return (
    <>
      <Modal
        open={isModalCheckoutConfirmVisible}
        onCancel={onHandleModalCheckoutConfirmVisibility}
        footer={null}
        title={'Checkout Confirmation'}>
        <Flex justify="center">
          <Image
            src={CheckoutImage}
            width={250}
            alt={'Checkout'}
            preview={false}
          />
        </Flex>

        <Row gutter={[8, 16]}>
          <Col xs={24}>
            <div className={styles?.modalCheckoutTitle}>
              Are you sure you want to checkout?
            </div>
            <div className={styles?.modalCheckoutDesc}>
              Once you check out, the items will be issued as{' '}
              <span>Pre-Order</span> items
            </div>
          </Col>
          <Col xs={12}>
            <Button
              block
              type="default"
              onClick={onHandleModalCheckoutConfirmVisibility}>
              Cancel
            </Button>
          </Col>
          <Col xs={12}>
            <Button
              block
              type="primary"
              onClick={onHandleSubmitCheckout}
              disabled={isSubmitted}
              loading={isSubmitted}>
              Checkout
            </Button>
          </Col>
        </Row>
      </Modal>
    </>
  )
}

export default ModalCheckoutConfirmation
