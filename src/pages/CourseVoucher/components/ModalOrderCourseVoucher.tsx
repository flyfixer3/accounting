// @ts-nocheck
import React from 'react'
import useCourseVoucherOrderController from '../controller/useCourseVoucherOrderController'
import { Button, Col, Form, InputNumber, Row } from 'antd'
import { ICourseVoucherRequestPayload } from 'src/models/course-voucher.model'
import Modal from 'antd/es/modal/Modal'
import Spacer from 'src/components/view/Spacer'
import SelectCourse from 'src/components/select/SelectCourse/SelectCourse'
import useCourseVoucherBundlePriceController from '../controller/useCourseVoucherBundlePrice'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import { moneyFormatter } from 'src/helpers/formatter.helper'

interface IModalOrderCourseVoucher {
  isVisible: boolean
  handleClose: () => void
  onRefetch: () => void
}

const ModalOrderCourseVoucher: React.FC<IModalOrderCourseVoucher> = ({
  isVisible,
  handleClose,
  onRefetch,
}) => {
  const { formErrorMsg, isSubmitted, onHandleOrderCourseVoucher } =
    useCourseVoucherOrderController()

  const { onFetchBundlePrice, courseVoucherBundlePrice } =
    useCourseVoucherBundlePriceController()

  const [orderCourseVoucherForm] = Form.useForm<ICourseVoucherRequestPayload>()
  type FieldType = ICourseVoucherRequestPayload

  const courseIdValue = Form.useWatch('courseId', orderCourseVoucherForm)
  const bundleQtyValue = Form.useWatch('bundleQty', orderCourseVoucherForm)

  const handleFinishForm = (e: ICourseVoucherRequestPayload) => {
    onHandleOrderCourseVoucher(e, handleClose, onRefetch)
  }

  const handleCourseChange = (value: number, obj: any) => {
    onFetchBundlePrice(value)
    orderCourseVoucherForm.setFieldsValue({
      courseId: value,
    })
  }

  return (
    <>
      <Modal
        open={isVisible}
        onCancel={handleClose}
        maskClosable={false}
        footer={null}
        title={'Order Course Voucher'}>
        <Form
          name="orderCourseVoucherForm"
          form={orderCourseVoucherForm}
          initialValues={{
            bundleQty: 0,
            courseId: null,
          }}
          onFinish={handleFinishForm}
          layout="vertical"
          autoComplete="off"
          preserve={false}>
          <Row>
            <Col xs={24} sm={12}>
              <Form.Item<FieldType>
                label="Course"
                name={'courseId'}
                rules={[
                  {
                    required: true,
                    message: 'Please input Course',
                  },
                ]}>
                <SelectCourse
                  handleChange={handleCourseChange}
                  value={courseIdValue}
                  allowClear={false}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24}>
              <Form.Item<FieldType>
                label={`Order Bundle Quantity (@${moneyFormatter(
                  parseFloat(courseVoucherBundlePrice) || 0,
                )})`}
                name={'bundleQty'}
                rules={[
                  {
                    required: true,
                    message: 'Bundle quantity must be filled',
                  },
                  {
                    type: 'number',
                    min: 1,
                    message: 'Bundle quantity must be more than 1',
                  },
                ]}>
                <InputNumber width={'100%'} min={0} />
              </Form.Item>
            </Col>
          </Row>

          <DetailRow
            title="Total Price"
            value={moneyFormatter(
              parseFloat(courseVoucherBundlePrice) * bundleQtyValue || 0,
            )}
          />

          <Row gutter={[8, 8]}>
            {formErrorMsg ? (
              <>
                <Col xs={24}>
                  <div className="font-error text-center">
                    {formErrorMsg || formErrorMsg?.message}
                  </div>
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
                  Order
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default ModalOrderCourseVoucher
