// @ts-nocheck
import { Button, Col, Form, InputNumber, Row } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React from 'react'
import { ISelectData } from 'src/models/general.model'
import {
  ISupplierOrderDetailData,
  ISupplierOrderReceiveBookFormData,
  ISupplierOrderReceiveOrderItemRequestPayload,
} from 'src/models/supplier.model'
import useSupplierReceiveOrderItemController from '../../controller/useSupplierReceiveOrderItemController'

interface IBookForm {
  selectedData: ISupplierOrderDetailData
}

const BookForm: React.FC<IBookForm> = ({ selectedData }) => {
  const {
    formErrorMsg,
    isSubmitted,
    setFormErrorMsg,
    onHandleSubmitReceiveOrderItem,
  } = useSupplierReceiveOrderItemController()

  const [addBookStockForm] = Form.useForm<ISupplierOrderReceiveBookFormData>()
  type FieldType = ISupplierOrderReceiveBookFormData

  const _handleFinishForm = (e: ISupplierOrderReceiveBookFormData) => {
    const trim = e?.bookNumberList?.replace(/\s/g, '')
    const splitRes = trim.split(',')

    const newForm: ISupplierOrderReceiveOrderItemRequestPayload = {
      qty: e?.qty,
      itemNumberList: splitRes,
    }
    onHandleSubmitReceiveOrderItem(newForm, selectedData)
  }

  return (
    <>
      <Form
        name="addBookStockForm"
        form={addBookStockForm}
        initialValues={{
          bookId: null,
          bookNumberList: [],
          qty: 0,
        }}
        onFinish={_handleFinishForm}
        onValuesChange={() => setFormErrorMsg('')}
        layout="vertical"
        autoComplete="off"
        preserve={false}>
        <Form.Item<FieldType>
          label="Received Quantity"
          name={'qty'}
          rules={[
            {
              required: true,
              message: 'Received quantity must be filled',
            },
          ]}>
          <InputNumber
            width={'100%'}
            min={0}
            max={parseInt(selectedData?.qty)}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="Book Number"
          name={'bookNumberList'}
          required
          rules={[
            {
              required: true,
              message: 'Book Number list must be filled',
            },
          ]}>
          <TextArea
            rows={4}
            placeholder="e.g B001,BOO2,B003"
            autoSize={false}
            style={{ resize: 'none' }}
          />
        </Form.Item>

        <Row gutter={[8, 16]}>
          {formErrorMsg ? (
            <>
              <Col xs={24}>
                <div className="font-error text-center">{formErrorMsg}</div>
              </Col>
            </>
          ) : null}

          <Col xs={24} sm={24}>
            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={isSubmitted}
              loading={isSubmitted}>
              Receive
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default BookForm
