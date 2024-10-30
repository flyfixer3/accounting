// @ts-nocheck
import { Button, Col, Form, Row } from 'antd'
import Alert from 'antd/es/alert/Alert'
import TextArea from 'antd/es/input/TextArea'
import Modal from 'antd/es/modal/Modal'
import React from 'react'
import SelectActiveStatus from 'src/components/select/SelectActiveStatus'
import { STATUS_ENUM } from 'src/enums/enums'
import { ISelectData } from 'src/models/general.model'
import SubaccountSelect from 'src/pages/Accounting/components/SubaccountSelect'

interface IUpdateStatusForm {
  status: string
  rejectReason?: string
  subaccountId?: number
}

interface IModalUpdateStatusProps {
  isVisible: boolean
  handleClose: () => void
  title?: string
  statusListOptions: ISelectData[]
  onSubmit: (e: IUpdateStatusForm, handleClose: () => void) => void
  isSubmitted: boolean
  formErrorMsg: string
}

const ModalUpdateStatus: React.FC<IModalUpdateStatusProps> = ({
  isVisible,
  handleClose,
  title,
  statusListOptions,
  onSubmit,
  isSubmitted,
  formErrorMsg,
}) => {
  const [updateStatusForm] = Form.useForm<IUpdateStatusForm>()
  type FieldType = IUpdateStatusForm

  const statusValue = Form.useWatch('status', updateStatusForm)

  const handleFinishForm = (e: IUpdateStatusForm) => {
    onSubmit(e, handleClose)
  }

  const handleChangeStatus = (value: string) => {
    updateStatusForm.setFieldsValue({
      status: value,
    })
  }

  const subaccountId = Form.useWatch('subaccountId', updateStatusForm)

  const handlePaymentMethodChange = (value: number, obj: any) => {
    setSelectedPaymentObj(obj)
    updateStatusForm.setFieldsValue({
      paymentMethodId: value,
    })
  }

  return (
    <Modal
      open={isVisible}
      onCancel={handleClose}
      title={title}
      footer={null}
      destroyOnClose>
      <Form
        name="updateStatusForm"
        form={updateStatusForm}
        initialValues={{
          status: '',
          rejectReason: '',
          paymentMethodId: '',
          bankId: '',
        }}
        onFinish={handleFinishForm}
        layout="vertical"
        autoComplete="off"
        preserve={false}>
        <Form.Item<FieldType> label="Status" name={'status'} required>
          <SelectActiveStatus
            handleChange={handleChangeStatus}
            value={statusValue}
            list={statusListOptions}
          />
        </Form.Item>

        {statusValue === STATUS_ENUM?.rejected ? (
          <Form.Item<FieldType> label="Note" name={'rejectReason'}>
            <TextArea
              rows={4}
              placeholder="e.g Item Habis"
              autoSize={false}
              style={{ resize: 'none' }}
            />
          </Form.Item>
        ) : null}

        {statusValue === STATUS_ENUM?.paid ? (
          <>
            <Form.Item<FieldType>
              label="Received in"
              name={'subaccountId'}
              rules={[
                {
                  required: true,
                  message: 'Please input Payment Method for payment',
                },
              ]}>
              <SubaccountSelect
                handleChange={handlePaymentMethodChange}
                value={subaccountId}
                filterCategoryNumber="3"
              />
            </Form.Item>
          </>
        ) : null}

        <Row gutter={[8, 16]}>
          <Col xs={24}>
            <Alert
              showIcon
              type="warning"
              message={
                <div className="text-normal">
                  Take your time to confirm the stock. Once you update, you
                  can't re-update the status
                </div>
              }
            />
          </Col>

          {formErrorMsg ? (
            <>
              <Col xs={24}>
                <div className="font-error text-center">{formErrorMsg}</div>
              </Col>
            </>
          ) : null}

          <Col xs={24} sm={12}>
            <Button type="primary" ghost block onClick={handleClose}>
              Cancel
            </Button>
          </Col>
          <Col xs={24} sm={12}>
            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={isSubmitted}
              loading={isSubmitted}>
              Update
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default ModalUpdateStatus
