// @ts-nocheck
import DetailRow from 'src/components/view/DetailRow/DetailRow'

import { Button, Col, Form, Row } from 'antd'
import Modal from 'antd/es/modal/Modal'
import React from 'react'
import Spacer from 'src/components/view/Spacer'
import { moneyFormatter } from 'src/helpers/formatter.helper'

import { ITeacherTableData } from '@src/models/teacher.model'
import Alert from 'antd/es/alert/Alert'
import { ISalaryData } from 'src/models/salary.model'
import { ISupplierOrderUpdatePaymentRequestPayload } from 'src/models/supplier.model'
import SubaccountSelect from 'src/pages/Accounting/components/SubaccountSelect'

interface IModalUpdatePayment {
  isVisible: boolean
  handleClose: () => void
  teacher: ITeacherTableData
  salary: ISalaryData
  formErrorMsg: string
  isSubmitted: boolean
  onSetFormErrorMsg: (e: string) => void
  onHandleSubmitPayment: (e: ISupplierOrderUpdatePaymentRequestPayload) => void
}

const ModalUpdatePayment: React.FC<IModalUpdatePayment> = ({
  teacher,
  salary,
  isVisible,
  handleClose,
  formErrorMsg,
  isSubmitted,
  onSetFormErrorMsg,
  onHandleSubmitPayment,
}) => {
  const [updatePaymentStatusForm] =
    Form.useForm<ISupplierOrderUpdatePaymentRequestPayload>()
  type FieldType = ISupplierOrderUpdatePaymentRequestPayload

  const subaccountIdValue = Form.useWatch(
    'subaccountId',
    updatePaymentStatusForm,
  )

  const handleFinishForm = (e: ISupplierOrderUpdatePaymentRequestPayload) => {
    onHandleSubmitPayment(e)
  }

  const handlePaymentMethodChange = (value: number, obj: any) => {
    updatePaymentStatusForm.setFieldsValue({
      subaccountId: value,
    })
  }

  const isValidate = () => {
    const data = updatePaymentStatusForm.getFieldsValue(true)

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
      <DetailRow
        title={'Teacher'}
        value={`${teacher.teacherName} #${teacher.teacherNumber}`}
      />

      <DetailRow
        title={'Base Salary'}
        value={`${moneyFormatter(parseFloat(salary.base_salary))}`}
      />
      <DetailRow
        title={'Commission'}
        value={`${moneyFormatter(parseFloat(salary?.commission))}`}
      />
      <DetailRow
        title={'Total Salary'}
        value={`${moneyFormatter(parseFloat(salary.base_salary) + parseFloat(salary.commission))}`}
      />

      <Form
        name="updatePaymentStatusForm"
        form={updatePaymentStatusForm}
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
            handleChange={handlePaymentMethodChange}
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
