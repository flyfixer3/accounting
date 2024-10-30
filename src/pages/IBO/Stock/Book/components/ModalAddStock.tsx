// @ts-nocheck
import Spacer from 'src/components/view/Spacer'
import { Button, Col, Form, Row } from 'antd'
import Alert from 'antd/es/alert/Alert'
import TextArea from 'antd/es/input/TextArea'
import Modal from 'antd/es/modal/Modal'
import React from 'react'
import { IBookStockDetailCreateRequestPayload } from '@src/models/books.model'

interface IAddStockForm {
  bookNumberList: string
}

interface IModalAddStockProps {
  isVisible: boolean
  handleClose: () => void
  title?: string
  onSubmit: (
    e: IBookStockDetailCreateRequestPayload,
    handleClose: () => void,
  ) => void
  isSubmitted: boolean
  formErrorMsg: string
}

const ModalAddStock: React.FC<IModalAddStockProps> = ({
  isVisible,
  handleClose,
  title,
  onSubmit,
  formErrorMsg,
  isSubmitted,
}) => {
  const [addStockForm] = Form.useForm<IAddStockForm>()
  type FieldType = IAddStockForm

  const handleFinishForm = (e: IAddStockForm) => {
    const trim = e?.bookNumberList?.replace(/\s/g, '')
    const split = trim.split(',')

    const payload: IBookStockDetailCreateRequestPayload = {
      bookNumberList: split,
    }
    onSubmit(payload, handleClose)
  }

  return (
    <Modal
      open={isVisible}
      onCancel={handleClose}
      title={title}
      footer={null}
      destroyOnClose>
      <Form
        name="addStockForm"
        form={addStockForm}
        initialValues={{
          bookNumberList: '',
        }}
        onFinish={handleFinishForm}
        layout="vertical"
        autoComplete="off"
        preserve={false}>
        <Row>
          <Col xs={24}>
            <Alert
              showIcon
              type="info"
              message={
                <div className="text-normal">
                  Input stock with format: B001,B002,B003
                </div>
              }
            />
          </Col>
        </Row>

        <Spacer margin={'.5rem auto'} />

        <Form.Item<FieldType>
          label="Book Number"
          name={'bookNumberList'}
          required>
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

export default ModalAddStock
