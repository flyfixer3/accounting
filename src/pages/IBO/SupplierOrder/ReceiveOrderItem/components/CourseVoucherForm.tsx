// @ts-nocheck
import {
  ISupplierOrderDetailData,
  ISupplierOrderReceiveCourseVoucherFormData,
  ISupplierOrderReceiveOrderItemRequestPayload,
} from 'src/models/supplier.model'
import { Button, Col, Form, InputNumber, Row } from 'antd'
import React from 'react'
import useSupplierReceiveOrderItemController from '../../controller/useSupplierReceiveOrderItemController'
import TextArea from 'antd/es/input/TextArea'
import SelectCourse from 'src/components/select/SelectCourse/SelectCourse'
import { COURSE_VOUCHER_BUNDLE } from 'src/enums/enums'

interface ICourseVoucherForm {
  selectedData: ISupplierOrderDetailData
}

const CourseVoucherForm: React.FC<ICourseVoucherForm> = ({ selectedData }) => {
  const {
    formErrorMsg,
    isSubmitted,
    setFormErrorMsg,
    onHandleSubmitReceiveOrderItem,
  } = useSupplierReceiveOrderItemController()

  const [addCourseVoucherForm] =
    Form.useForm<ISupplierOrderReceiveCourseVoucherFormData>()

  type FieldType = ISupplierOrderReceiveCourseVoucherFormData

  const _handleFinishForm = (e: ISupplierOrderReceiveCourseVoucherFormData) => {
    const trim = e?.courseVoucherNumberList?.replace(/\s/g, '')
    const splitRes = trim.split(',')

    const newForm: ISupplierOrderReceiveOrderItemRequestPayload = {
      qty: e?.qty,
      itemNumberList: splitRes,
    }

    onHandleSubmitReceiveOrderItem(newForm, selectedData)
  }

  return (
    <>
      <Form
        name="addCourseVoucherForm"
        form={addCourseVoucherForm}
        initialValues={{
          courseId: null,
          courseVoucherNumberList: [],
          qty: 0,
        }}
        onFinish={_handleFinishForm}
        onValuesChange={() => setFormErrorMsg('')}
        layout="vertical"
        autoComplete="off"
        preserve={false}>
        <Form.Item<FieldType>
          label={`Received Quantity (per bundle, 1 bundle = ${COURSE_VOUCHER_BUNDLE?.quantity} )`}
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

        <Form.Item<FieldType>
          label="Course Voucher Number"
          name={'courseVoucherNumberList'}
          required
          rules={[
            {
              required: true,
              message: 'Course Voucher Number list must be filled',
            },
          ]}>
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

export default CourseVoucherForm
