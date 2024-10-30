// @ts-nocheck
import {
  IStudentEquipmentList,
  IStudentEquipmentPurchaseFormData,
} from 'src/models/student-equipment.model'
import useStudentEquipmentPurchaseController from '../controller/useStudentEquipmentPurchaseController'
import React, { useEffect } from 'react'
import { Button, Col, Form, InputNumber, Row } from 'antd'
import { IStudentSelect } from 'src/models/student.model'
import Modal from 'antd/es/modal/Modal'
import Input from 'antd/es/input/Input'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import StudentAutocomplete from 'src/components/input/StudentAutocomplete/StudentAutocomplete'
import Spacer from 'src/components/view/Spacer'

interface IModalPurchaseEquipment {
  isVisible: boolean
  handleClose: () => void
  title?: string
  selectedData: IStudentEquipmentList
}

const ModalPurchaseEquipment: React.FC<IModalPurchaseEquipment> = ({
  isVisible,
  handleClose,
  title = 'Purchase Equipment',
  selectedData,
}) => {
  const { onHandlePurchaseEquipment, formErrorMsg, isSubmitted } =
    useStudentEquipmentPurchaseController()

  const [purchaseEquipmentForm] =
    Form.useForm<IStudentEquipmentPurchaseFormData>()
  type FieldType = IStudentEquipmentPurchaseFormData

  const qtyValue = Form.useWatch('qty', purchaseEquipmentForm)

  const handleFinishForm = (e: IStudentEquipmentPurchaseFormData) => {
    onHandlePurchaseEquipment(e, handleClose)
  }

  const _handleSelectedExistingStudent = (e: IStudentSelect) => {
    const studentId: number = parseInt(e?.value)
    purchaseEquipmentForm.setFieldsValue({ studentId })
  }

  useEffect(() => {
    if (selectedData && Object.keys(selectedData)) {
      purchaseEquipmentForm.setFieldsValue({ equipmentId: selectedData?.id })
    } else {
      purchaseEquipmentForm.resetFields()
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
        name="purchaseEquipmentForm"
        form={purchaseEquipmentForm}
        initialValues={{
          studentId: '',
          equipmentId: '',
          qty: 0,
        }}
        onFinish={handleFinishForm}
        layout="vertical"
        autoComplete="off"
        preserve={false}>
        <Form.Item<FieldType> name={'equipmentId'} style={{ display: 'none' }}>
          <Input />
        </Form.Item>

        <DetailRow
          title="Equipment Name"
          value={selectedData?.equipmentName || '-'}
        />

        <DetailRow
          title="Equipment Price"
          value={moneyFormatter(parseFloat(selectedData?.equipmentPrice))}
        />

        <DetailRow title="Available Quantity" value={selectedData?.qty} />

        <Row>
          <Col xs={24} sm={24}>
            <Form.Item<FieldType>
              label="Search Student"
              name={'studentId'}
              rules={[
                {
                  required: true,
                  message: 'Please select student',
                },
              ]}>
              <StudentAutocomplete
                allowClear={true}
                handleSelectedData={_handleSelectedExistingStudent}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24}>
            <Form.Item<FieldType>
              label="Purchase Quantity"
              name={'qty'}
              rules={[
                {
                  type: 'number',
                  min: 1,
                  message: 'Purchase quantity must be more than 1',
                },
              ]}>
              <InputNumber
                width={'100%'}
                min={0}
                max={parseInt(selectedData?.qty)}
              />
            </Form.Item>
          </Col>
        </Row>

        <DetailRow
          title="Total Price"
          value={moneyFormatter(
            parseFloat(selectedData?.equipmentPrice) * qtyValue || 0,
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
                Purchase
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default ModalPurchaseEquipment
