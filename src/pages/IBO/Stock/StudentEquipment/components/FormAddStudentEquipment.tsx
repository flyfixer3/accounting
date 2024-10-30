// @ts-nocheck
import { Button, Col, Form, InputNumber, Row } from 'antd'
import React, { useEffect } from 'react'
import Input from 'antd/es/input/Input'
import SelectCourse from 'src/components/select/SelectCourse/SelectCourse'
import SelectCourseLevel from 'src/components/select/SelectCourse/SelectCourseLevel'

import {
  currencyInputFormatter,
  currencyInputParser,
} from 'src/helpers/formatter.helper'
import Spacer from 'src/components/view/Spacer'

import UploadImageSimple from 'src/components/upload-image/UploadImageSimple'
import {
  IStudentEquipmentStockFormData,
  IStudentEquipmentStockIBODetailResponse,
} from 'src/models/student-equipment.model'

interface IFormAddStudentEquipmentProps {
  editedData?: IStudentEquipmentStockIBODetailResponse
  handleSubmitForm: (e: IStudentEquipmentStockFormData, isEdit: boolean) => void
  isSubmitted?: boolean
  formErrorMsg?: string
  setFormErrorMsg?: (e: string) => void
}

const FormAddStudentEquipment: React.FC<IFormAddStudentEquipmentProps> = ({
  editedData,
  isSubmitted,
  handleSubmitForm,
  formErrorMsg,
  setFormErrorMsg,
}) => {
  const [studentEquipmentForm] = Form.useForm<IStudentEquipmentStockFormData>()

  const equipmentImgUrlValue = Form.useWatch(
    'equipmentImageUrl',
    studentEquipmentForm,
  )

  type FieldType = IStudentEquipmentStockFormData

  const handleFinishForm = (payload: IStudentEquipmentStockFormData) => {
    handleSubmitForm(payload, editedData ? true : false)
  }

  const normFile = (e: any) => {
    const { file, url } = e

    studentEquipmentForm.setFieldsValue({
      equipmentImageUrl: url,
      equipmentImageFile: file,
    })
  }

  useEffect(() => {
    if (!editedData) studentEquipmentForm.resetFields()
    else {
      studentEquipmentForm.setFieldsValue({
        equipmentName: editedData?.equipmentName,
        equipmentPrice: editedData?.equipmentPrice,
        qty: parseInt(editedData?.qty),
      })
    }
  }, [editedData])

  return (
    <Form
      name="studentEquipmentForm"
      form={studentEquipmentForm}
      initialValues={{
        equipmentName: '',
        equipmentPrice: '0',
        equipmentImageUrl: '',
        equipmentImageFile: null,
        qty: 0,
      }}
      onFinish={handleFinishForm}
      onValuesChange={() => {
        setFormErrorMsg && setFormErrorMsg('')
      }}
      layout="vertical"
      autoComplete="off"
      preserve={false}>
      <Form.Item name={'equipmentImageUrl'} noStyle>
        <Input type="hidden" />
      </Form.Item>

      <Row>
        <Col xs={24}>
          <Form.Item<FieldType>
            label="Equipment Image"
            name={'equipmentImageFile'}>
            <UploadImageSimple
              src={equipmentImgUrlValue}
              onChange={normFile}
              alt="equipment image"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Equipment Name"
            name={'equipmentName'}
            rules={[
              {
                required: true,
                message: 'Please input Equipment Name',
              },
            ]}>
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Equipment Selling Price"
            name={'equipmentPrice'}
            rules={[
              {
                required: true,
                message: 'Please input Equipment Price',
              },
            ]}>
            <InputNumber
              formatter={(value: string) => currencyInputFormatter(value, 'Rp')}
              parser={(value: string) => currencyInputParser(value, 'Rp')}
              style={{ width: '100%' }}
              precision={2}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Stock Quantity"
            name={'qty'}
            rules={[
              {
                required: true,
                message: 'Stock quantity must be filled',
              },
              {
                type: 'number',
                min: 1,
                message: 'Stock quantity must be more than 1',
              },
            ]}>
            <InputNumber width={'100%'} min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      {formErrorMsg ? (
        <>
          <Row>
            <Col xs={24}>
              <div className="font-error text-center">{formErrorMsg}</div>
            </Col>
          </Row>
          <Spacer margin={'4px auto'} />
        </>
      ) : null}

      <Row>
        <Col xs={24}>
          <Form.Item>
            <Button
              type="primary"
              block
              htmlType="submit"
              disabled={isSubmitted}
              loading={isSubmitted}>
              Save
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default FormAddStudentEquipment
