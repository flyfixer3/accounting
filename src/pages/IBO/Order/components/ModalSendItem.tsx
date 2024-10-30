// @ts-nocheck
import BookNumberListSearch from 'src/components/input/BookNumberListSearch'
import { SUPPLIER_ORDER_TYPE } from 'src/enums/enums'
import { Button, Col, Form, InputNumber, Row } from 'antd'
import Modal from 'antd/es/modal/Modal'
import React from 'react'

import {
  IIBOOrderDetails,
  IIBOSendOrderItemFormData,
} from 'src/models/order.model'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import Spacer from 'src/components/view/Spacer'
import { ISelectData } from 'src/models/general.model'

interface IModalSendItemProps {
  isVisible: boolean
  handleClose: () => void
  title?: string
  onSubmit: (e: IIBOSendOrderItemFormData) => void
  isSubmitted: boolean
  formErrorMsg: string
  selectedItem: IIBOOrderDetails
  onSetFormErrorMsg: (e: string) => void
}

const ModalSendItem: React.FC<IModalSendItemProps> = ({
  isVisible,
  handleClose,
  title,
  onSubmit,
  isSubmitted,
  formErrorMsg,
  selectedItem,
  onSetFormErrorMsg,
}) => {
  const [sendItemForm] = Form.useForm<IIBOSendOrderItemFormData>()
  type FieldType = IIBOSendOrderItemFormData

  const handleFinishForm = (e: IIBOSendOrderItemFormData) => {
    onSubmit(e)
  }

  const handleSelectedBookNumberList = (e: ISelectData[]) => {
    const newBookNumberList: string[] = e?.map(
      (item) => item?.value,
    ) as string[]
    sendItemForm?.setFieldsValue({ itemNumberList: newBookNumberList })
  }

  return (
    <Modal
      open={isVisible}
      onCancel={handleClose}
      title={title}
      footer={null}
      destroyOnClose>
      <Form
        name="sendItemForm"
        form={sendItemForm}
        initialValues={{
          qty: 0,
          itemNumberList: '',
        }}
        onFinish={handleFinishForm}
        onValuesChange={() => onSetFormErrorMsg('')}
        layout="vertical"
        autoComplete="off"
        preserve={false}>
        <DetailRow title={'ID'} value={selectedItem?.itemId || '-'} />

        <DetailRow title={'Name'} value={selectedItem?.itemName || '-'} />
        <DetailRow
          title={'Type'}
          value={
            selectedItem?.itemType === SUPPLIER_ORDER_TYPE?.book
              ? 'Book'
              : selectedItem?.itemType === SUPPLIER_ORDER_TYPE?.courseVoucher
                ? 'Course Voucher'
                : selectedItem?.itemType === SUPPLIER_ORDER_TYPE?.equipment
                  ? 'Equipment'
                  : '-'
          }
        />
        <DetailRow
          title={'Ordered Quantity'}
          value={selectedItem?.qty || '-'}
        />

        <DetailRow
          title={'Sent Quantity'}
          value={selectedItem?.sentQty || '-'}
        />

        <Spacer margin=".5rem auto" />

        <Form.Item<FieldType>
          label="Send Quantity"
          name={'qty'}
          rules={[
            {
              required: true,
              message: 'Send quantity must be filled',
            },
          ]}>
          <InputNumber
            width={'100%'}
            min={0}
            max={parseInt(selectedItem?.qty) - selectedItem?.sentQty}
            style={{ width: '100%' }}
          />
        </Form.Item>

        {selectedItem?.itemType === SUPPLIER_ORDER_TYPE?.book ? (
          <Form.Item
            label={'Book Number List'}
            name={'itemNumberList'}
            required
            rules={[
              {
                required: true,
                message: 'Book Number List must be filled',
              },
            ]}>
            <BookNumberListSearch
              bookId={selectedItem?.itemId}
              handleSelectedData={handleSelectedBookNumberList}
            />
          </Form.Item>
        ) : null}

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
              Send
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default ModalSendItem
