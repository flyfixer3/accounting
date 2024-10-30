// @ts-nocheck
import { Button, Col, Form, InputNumber, Modal, Row } from 'antd'
import React, { useEffect } from 'react'

import Spacer from 'src/components/view/Spacer'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import {
  ICourseVoucherIBOPriceListData,
  ICourseVoucherIBOPriceRequestPayload,
} from 'src/models/course-voucher.model'
import {
  currencyInputFormatter,
  currencyInputParser,
} from 'src/helpers/formatter.helper'

interface IModalUpdate {
  isVisible: boolean
  handleClose: () => void
  title?: string
  selectedData: ICourseVoucherIBOPriceListData
  handleSubmit: (payload: ICourseVoucherIBOPriceRequestPayload) => void
  formErrorMsg: string
  isSubmitted: boolean
  onSetFormErrorMsg: (errorMsg: string) => void
}

const ModalUpdate: React.FC<IModalUpdate> = ({
  isVisible,
  handleClose,
  title = 'Update Course Voucher Price',
  selectedData,
  handleSubmit,
  formErrorMsg,
  isSubmitted,
  onSetFormErrorMsg,
}) => {
  const [updateForm] = Form.useForm<ICourseVoucherIBOPriceRequestPayload>()
  type FieldType = ICourseVoucherIBOPriceRequestPayload

  const handleFinishForm = (e: ICourseVoucherIBOPriceRequestPayload) => {
    handleSubmit(e)
  }

  useEffect(() => {
    if (selectedData && Object.keys(selectedData)) {
      updateForm.setFieldsValue({ price: selectedData?.price })
    } else {
      updateForm.resetFields()
    }
  }, [selectedData])

  return (
    <Modal
      open={isVisible}
      onCancel={handleClose}
      maskClosable={false}
      footer={null}
      title={title}>
      <Form
        name="updateForm"
        form={updateForm}
        onFinish={handleFinishForm}
        onValuesChange={() => onSetFormErrorMsg('')}
        layout="vertical"
        autoComplete="off"
        preserve={false}>
        <DetailRow
          title="Course Number"
          value={selectedData?.course?.courseNumber || '-'}
        />

        <DetailRow
          title="Course Name"
          value={selectedData?.course?.courseName || '-'}
        />

        <Row gutter={[8, 8]}>
          <Col xs={24} sm={24}>
            <Form.Item<FieldType>
              label="Course Voucher Price"
              name={'price'}
              rules={[
                {
                  required: true,
                  message: 'Please input course voucher price',
                },
              ]}>
              <InputNumber
                formatter={(value: string) =>
                  currencyInputFormatter(value, 'Rp')
                }
                parser={(value: string) => currencyInputParser(value, 'Rp')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>

          {formErrorMsg ? (
            <>
              <Col xs={24}>
                <div className="font-error text-center">{formErrorMsg}</div>
              </Col>

              <Spacer margin={'4px auto'} />
            </>
          ) : null}

          <Col xs={24} sm={12}>
            <Form.Item>
              <Button type="primary" ghost block onClick={handleClose}>
                Cancel
              </Button>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item>
              <Button
                type="primary"
                block
                htmlType="submit"
                disabled={isSubmitted}>
                Save
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default ModalUpdate
