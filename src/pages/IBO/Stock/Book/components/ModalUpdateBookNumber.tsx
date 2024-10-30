// @ts-nocheck
import { Button, Col, Form, Row } from 'antd'

import Modal from 'antd/es/modal/Modal'
import React, { useEffect } from 'react'
import {
  IBookStockDetailUpdateBookNumberRequestPayload,
  IBookStockIBOStockDetailListData,
} from 'src/models/books.model'
import Input from 'antd/es/input/Input'
import DetailRow from 'src/components/view/DetailRow/DetailRow'

interface IUpdateBookNumberForm {
  bookNumber: string
}

interface IModalUpdateBookNumberProps {
  isVisible: boolean
  handleClose: () => void
  onSubmit: (
    e: IBookStockDetailUpdateBookNumberRequestPayload,
    bookStockDetailId: number,
  ) => void
  isSubmitted: boolean
  formErrorMsg: string
  onSetFormErrorMsg: (e: string) => void
  selectedData: IBookStockIBOStockDetailListData
}

const ModalUpdateBookNumber: React.FC<IModalUpdateBookNumberProps> = ({
  isVisible,
  handleClose,
  onSubmit,
  formErrorMsg,
  isSubmitted,
  onSetFormErrorMsg,
  selectedData,
}) => {
  const [updateBookNumberForm] = Form.useForm<IUpdateBookNumberForm>()
  type FieldType = IUpdateBookNumberForm

  const bookNumberValue = Form.useWatch('bookNumber', updateBookNumberForm)

  const handleFinishForm = (e: IUpdateBookNumberForm) => {
    onSubmit(e, selectedData?.id)
  }

  useEffect(() => {
    return () => updateBookNumberForm.resetFields()
  }, [])

  return (
    <Modal
      open={isVisible}
      onCancel={handleClose}
      title={'Change Book Number'}
      footer={null}
      destroyOnClose>
      <Form
        name="updateBookNumberForm"
        form={updateBookNumberForm}
        initialValues={{
          bookNumber: '',
        }}
        onFinish={handleFinishForm}
        onValuesChange={() => onSetFormErrorMsg('')}
        layout="vertical"
        autoComplete="off"
        preserve={false}>
        <Row gutter={[8, 8]}>
          <Col xs={24}>
            <DetailRow
              title="Current Book Number"
              value={selectedData?.bookNumber}
            />
          </Col>

          <Col xs={24}>
            <Form.Item<FieldType>
              label="Book Number"
              name={'bookNumber'}
              required
              rules={[
                {
                  required: true,
                  message: 'Please input book number you want to change',
                },
              ]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

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
              disabled={bookNumberValue === '' || isSubmitted}
              loading={isSubmitted}>
              Update
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default ModalUpdateBookNumber
