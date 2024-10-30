// @ts-nocheck
import { Button, Col, Form, Row } from 'antd'
import Alert from 'antd/es/alert/Alert'
import Modal from 'antd/es/modal/Modal'
import React from 'react'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import Spacer from 'src/components/view/Spacer'
import StatusBadge from 'src/components/view/StatusBadge'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import {
  ISupplierOrderDetailResponse,
  ISupplierOrderUpdatePaymentRequestPayload,
} from 'src/models/supplier.model'
import SubaccountSelect from 'src/pages/Accounting/components/SubaccountSelect'

interface IModalUpdatePayment {
  isVisible: boolean
  handleClose: () => void
  selectedData: ISupplierOrderDetailResponse
  formErrorMsg: string
  isSubmitted: boolean
  onSetFormErrorMsg: (e: string) => void
  onHandleSubmitPayment: (e: ISupplierOrderUpdatePaymentRequestPayload) => void
}

const ModalUpdatePayment: React.FC<IModalUpdatePayment> = ({
  isVisible,
  handleClose,
  selectedData,
  formErrorMsg,
  isSubmitted,
  onSetFormErrorMsg,
  onHandleSubmitPayment,
}) => {
  const [form] = Form.useForm<ISupplierOrderUpdatePaymentRequestPayload>()
  type FieldType = ISupplierOrderUpdatePaymentRequestPayload

  const subaccountIdValue = Form.useWatch('subaccountId', form)

  const handleFinishForm = (e: ISupplierOrderUpdatePaymentRequestPayload) => {
    onHandleSubmitPayment(e)
  }

  const handlePaymentMethodChange = (value: number, obj: any) => {
    form.setFieldsValue({
      subaccountId: value,
    })
  }

  const isValidate = () => {
    const data = form.getFieldsValue(true)

    const conditions = [!!data.subaccountId]

    if (conditions.includes(false)) {
      return false
    }
    return true
  }

  return (
    <Modal
      open={isVisible}
      onCancel={handleClose}
      maskClosable={false}
      footer={null}
      title={'Change Payment Status to Paid'}>
      <DetailRow title={'Supplier Order ID'} value={selectedData?.id} />

      <DetailRow
        title={'Total Price'}
        value={`${moneyFormatter(parseFloat(selectedData?.totalPrice))}`}
      />

      <DetailRow
        title={'Payment Status'}
        renderValue={
          <StatusBadge status={selectedData?.paymentStatus || '-'} />
        }
      />

      <Form
        name="updatePaymentStatusForm"
        form={form}
        initialValues={{
          subaccountId: '',
          bankId: '',
        }}
        onValuesChange={() => onSetFormErrorMsg('')}
        onFinish={handleFinishForm}
        layout="vertical"
        autoComplete="off"
        preserve={false}>
        <Form.Item<FieldType>
          label="Payment Method"
          name={'subaccountId'}
          rules={[
            {
              required: true,
              message: 'Please input Payment Method for payment',
            },
          ]}>
          <SubaccountSelect
            filterCategoryNumber="3"
            onChange={handlePaymentMethodChange}
            value={subaccountIdValue}
          />
        </Form.Item>

        <Row gutter={[8, 16]}>
          <Col xs={24}>
            <Alert
              showIcon
              type={'info'}
              message={
                <div className="text-normal">
                  Are you sure you want to change payment status to PAID ? This
                  action can't be undone
                </div>
              }
            />
          </Col>

          {formErrorMsg ? (
            <>
              <Col xs={24}>
                <div className="font-error text-center">{formErrorMsg}</div>
              </Col>

              <Spacer margin={'4px auto'} />
            </>
          ) : null}

          <Col xs={24}>
            <Form.Item>
              <Button
                type="primary"
                block
                htmlType="submit"
                disabled={!isValidate() || isSubmitted}>
                Pay
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default ModalUpdatePayment
