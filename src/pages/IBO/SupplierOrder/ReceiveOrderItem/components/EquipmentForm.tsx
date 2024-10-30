// @ts-nocheck
import { Button, Col, Form, InputNumber, Row } from 'antd'
import React from 'react'
import {
  ISupplierOrderDetailData,
  ISupplierOrderReceiveEquipmentFormData,
  ISupplierOrderReceiveOrderItemRequestPayload,
} from 'src/models/supplier.model'
import useSupplierReceiveOrderItemController from '../../controller/useSupplierReceiveOrderItemController'

interface IEquipmentFormProps {
  selectedData: ISupplierOrderDetailData
}

const EquipmentForm: React.FC<IEquipmentFormProps> = ({ selectedData }) => {
  const {
    formErrorMsg,
    isSubmitted,
    setFormErrorMsg,
    onHandleSubmitReceiveOrderItem,
  } = useSupplierReceiveOrderItemController()

  const [addEquipmentForm] =
    Form.useForm<ISupplierOrderReceiveEquipmentFormData>()
  type FieldType = ISupplierOrderReceiveEquipmentFormData

  const _handleFinishForm = (e: ISupplierOrderReceiveEquipmentFormData) => {
    const newForm: ISupplierOrderReceiveOrderItemRequestPayload = {
      qty: e?.qty,
    }
    onHandleSubmitReceiveOrderItem(newForm, selectedData)
  }

  return (
    <>
      <Form
        name="addEquipmentForm"
        form={addEquipmentForm}
        initialValues={{
          equipmentId: null,
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
            {
              type: 'number',
              min: 1,
              message: 'Received quantity must be more than 1',
            },
          ]}>
          <InputNumber
            width={'100%'}
            min={0}
            max={parseInt(selectedData?.qty)}
            style={{ width: '100%' }}
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

export default EquipmentForm
