// @ts-nocheck
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import { moneyFormatter } from 'src/helpers/formatter.helper'

import { Button, Col, Form, InputNumber, Row } from 'antd'
import Modal from 'antd/es/modal/Modal'
import React, { useEffect } from 'react'
import Input from 'antd/es/input/Input'
import Spacer from 'src/components/view/Spacer'
import { useStockOrderContext } from '../../context/stock-order.context'
import {
  IStockOrderAddItemForm,
  IStockOrderAvailableListData,
} from 'src/models/stock-order.model'
import {
  COURSE_VOUCHER_BUNDLE,
  STOCK_ORDER_TYPE,
  SUPPLIER_ORDER_TYPE,
} from 'src/enums/enums'
import Alert from 'antd/es/alert/Alert'

interface IModalAddItemProps {
  isVisible: boolean
  handleClose: () => void
  selectedItem: IStockOrderAvailableListData
}

const ModalAddItem: React.FC<IModalAddItemProps> = ({
  isVisible,
  handleClose,
  selectedItem,
}) => {
  const {
    onHandleAddToCart,
    isItemInCart,
    onHandleUpdateCartItemQuantity,
    formErrorMsg,
    onHandleSetFormErrorMsg,
  } = useStockOrderContext()

  const [itemOrderForm] = Form.useForm<IStockOrderAddItemForm>()
  type FieldType = IStockOrderAddItemForm

  const qtyValue = Form.useWatch('qty', itemOrderForm)

  const handleFinishForm = (e: IStockOrderAddItemForm) => {
    const payload: IStockOrderAddItemForm = {
      qty: e?.qty,
      itemObj: e?.itemObj,
    }

    if (isItemInCart(payload?.itemObj?.localId))
      onHandleUpdateCartItemQuantity(
        payload?.itemObj?.localId,
        payload?.qty,
        handleClose,
      )
    else {
      onHandleAddToCart(payload)
      handleClose()
    }
  }

  useEffect(() => {
    if (selectedItem && Object.keys(selectedItem).length > 0) {
      itemOrderForm.setFieldsValue({
        qty: 0,
        itemObj: selectedItem,
      })
    } else {
      itemOrderForm.resetFields()
    }
  }, [selectedItem])

  useEffect(() => {
    onHandleSetFormErrorMsg('')
  }, [])

  return (
    <Modal
      open={isVisible}
      onCancel={handleClose}
      footer={null}
      title={'Add Order Item'}>
      <DetailRow title={'Name'} value={selectedItem?.itemName} />

      <DetailRow
        title={'Type'}
        value={
          selectedItem?.itemType === STOCK_ORDER_TYPE?.book
            ? 'Book'
            : selectedItem?.itemType === STOCK_ORDER_TYPE?.equipment
              ? 'Equipment'
              : selectedItem?.itemType === STOCK_ORDER_TYPE?.courseVoucher
                ? 'Course Voucher'
                : '-'
        }
      />

      <DetailRow
        title={'Price'}
        value={`${moneyFormatter(parseFloat(selectedItem?.price) || 0)}`}
      />

      <Form
        name="itemOrderForm"
        form={itemOrderForm}
        initialValues={{
          qty: 0,
          itemObj: null,
        }}
        onFinish={handleFinishForm}
        layout="vertical"
        autoComplete="off"
        preserve={false}>
        <Form.Item name={'itemObj'} noStyle>
          <Input type="hidden" />
        </Form.Item>

        {selectedItem?.itemType === SUPPLIER_ORDER_TYPE?.courseVoucher ? (
          <>
            <Alert
              showIcon
              type={'info'}
              message={
                <div className="text-normal">
                  Each bundle of Course Vouchers contains{' '}
                  {COURSE_VOUCHER_BUNDLE?.quantity} vouchers. Please note that
                  the quantity specified refers to one bundle, which includes{' '}
                  {COURSE_VOUCHER_BUNDLE?.quantity} course vouchers.
                </div>
              }
            />
            <Spacer margin=".5rem auto" />
          </>
        ) : null}

        <Form.Item<FieldType>
          label="Order Quantity"
          name={'qty'}
          rules={[
            {
              required: true,
              message: 'Order quantity must be filled',
            },
            {
              type: 'number',
              min: 1,
              message: 'Order quantity must be more than 0',
            },
          ]}>
          <InputNumber
            width={'100%'}
            min={0}
            max={999}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <DetailRow
          title="Total Price"
          value={
            qtyValue === 0
              ? moneyFormatter(parseFloat(selectedItem?.price))
              : moneyFormatter(parseFloat(selectedItem?.price) * qtyValue || 0)
          }
        />

        {formErrorMsg ? (
          <Row>
            <Col xs={24}>
              <div className="font-error text-center">{formErrorMsg}</div>
            </Col>
          </Row>
        ) : null}

        <Spacer margin=".5rem auto" />

        <Form.Item>
          <Button type="primary" block htmlType="submit">
            + Add to Cart
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalAddItem
