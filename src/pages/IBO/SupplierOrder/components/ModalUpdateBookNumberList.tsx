// @ts-nocheck
import { Button, Col, Form, Row } from 'antd'

import Modal from 'antd/es/modal/Modal'
import React, { useEffect } from 'react'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import TextArea from 'antd/es/input/TextArea'
import {
  ISupplierOrderReceiveItemDetailData,
  ISupplierOrderReceiveItemDetailUpdateBookNumberRequestPayload,
} from 'src/models/supplier.model'

interface IUpdateBookNumberForm {
  itemNumberList: string
}

interface IModalUpdateBookNumberListProps {
  isVisible: boolean
  handleClose: () => void
  onSubmit: (
    e: ISupplierOrderReceiveItemDetailUpdateBookNumberRequestPayload,
    orderItemReceivedDetailId: number,
  ) => void
  isSubmitted: boolean
  formErrorMsg: string
  onSetFormErrorMsg: (e: string) => void
  selectedData: ISupplierOrderReceiveItemDetailData
}

const ModalUpdateBookNumberList: React.FC<IModalUpdateBookNumberListProps> = ({
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

  const itemNumberListValue = Form.useWatch(
    'itemNumberList',
    updateBookNumberForm,
  )

  const handleFinishForm = (e: IUpdateBookNumberForm) => {
    const trim = e?.itemNumberList?.replace(/\s/g, '')
    const split = trim.split(',')

    const payload: ISupplierOrderReceiveItemDetailUpdateBookNumberRequestPayload =
      {
        itemNumberList: split,
      }

    onSubmit(payload, selectedData?.id)
  }

  useEffect(() => {
    if (!selectedData) updateBookNumberForm.resetFields()
    else {
      const itemNumberList = selectedData?.itemNumberList?.join(',')
      updateBookNumberForm.setFieldsValue({
        itemNumberList,
      })
    }
  }, [selectedData])

  return (
    <Modal
      open={isVisible}
      onCancel={handleClose}
      title={'Change Book Number List'}
      footer={null}
      destroyOnClose>
      <Form
        name="updateBookNumberForm"
        form={updateBookNumberForm}
        initialValues={{
          itemNumberList: '',
        }}
        onFinish={handleFinishForm}
        onValuesChange={() => onSetFormErrorMsg('')}
        layout="vertical"
        autoComplete="off"
        preserve={false}>
        <Row gutter={[8, 8]}>
          <Col xs={24}>
            <Form.Item<FieldType>
              label="Item Number List"
              name={'itemNumberList'}
              required
              rules={[
                {
                  required: true,
                  message: 'Please input item number list you want to change',
                },
              ]}>
              <TextArea
                rows={4}
                placeholder="e.g B001,BOO2,B003"
                autoSize={false}
                style={{ resize: 'none' }}
              />
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
              disabled={itemNumberListValue === '' || isSubmitted}
              loading={isSubmitted}>
              Update
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default ModalUpdateBookNumberList
