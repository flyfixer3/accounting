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
import {
  IBookStockFormData,
  IBookStockIBODetailResponse,
} from 'src/models/books.model'
import UploadImageSimple from 'src/components/upload-image/UploadImageSimple'

interface IFormAddBooksProps {
  editedData?: IBookStockIBODetailResponse
  handleSubmitForm: (e: IBookStockFormData, isEdit: boolean) => void
  isSubmitted?: boolean
  formErrorMsg?: string
  setFormErrorMsg?: (e: string) => void
}

const FormAddBooks: React.FC<IFormAddBooksProps> = ({
  editedData,
  isSubmitted,
  handleSubmitForm,
  formErrorMsg,
  setFormErrorMsg,
}) => {
  const [bookForm] = Form.useForm<IBookStockFormData>()

  const courseIdValue = Form.useWatch('courseId', bookForm)
  const bookImgUrlValue = Form.useWatch('bookImageUrl', bookForm)

  type FieldType = IBookStockFormData

  const handleFinishForm = (payload: IBookStockFormData) => {
    handleSubmitForm(payload, editedData ? true : false)
  }

  const handleCourseChange = (value: number) => {
    bookForm.setFieldsValue({ courseId: value, courseLevelId: null })
  }

  const handleCourseLevelChange = (value: number) => {
    bookForm.setFieldsValue({ courseLevelId: value })
  }

  const normFile = (e: any) => {
    const { file, url } = e

    bookForm.setFieldsValue({
      bookImageUrl: url,
      bookImageFile: file,
    })
  }

  useEffect(() => {
    if (!editedData) bookForm.resetFields()
    else {
      bookForm.setFieldsValue({
        bookName: editedData?.bookName,
        bookPrice: editedData?.bookPrice,
        courseId: editedData?.course?.id,
        courseLevelId: editedData?.courseLevel?.id,
      })
    }
  }, [editedData])

  return (
    <Form
      name="bookForm"
      form={bookForm}
      initialValues={{
        bookName: '',
        bookPrice: '0',
        bookImageUrl: '',
        bookImageFile: null,
      }}
      onFinish={handleFinishForm}
      onValuesChange={() => {
        setFormErrorMsg && setFormErrorMsg('')
      }}
      layout="vertical"
      autoComplete="off"
      preserve={false}>
      <Form.Item name={'bookImageUrl'} noStyle>
        <Input type="hidden" />
      </Form.Item>

      <Row>
        <Col xs={24}>
          <Form.Item<FieldType> label="Book Image" name={'bookImageFile'}>
            <UploadImageSimple
              src={bookImgUrlValue}
              onChange={normFile}
              alt="Book Image"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Book Name"
            name={'bookName'}
            rules={[
              {
                required: true,
                message: 'Please input Book Name',
              },
            ]}>
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Book Selling Price"
            name={'bookPrice'}
            rules={[
              {
                required: true,
                message: 'Please input Book Price',
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

      <Row gutter={[8, 8]}>
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
              value={editedData ? editedData?.course?.id : null}
              placement={'topLeft'}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Course Level"
            name={'courseLevelId'}
            rules={[
              {
                required: true,
                message: 'Please input Course Level',
              },
            ]}>
            <SelectCourseLevel
              courseId={courseIdValue}
              handleChange={handleCourseLevelChange}
              value={editedData ? editedData?.courseLevel?.id : null}
              placement={'topLeft'}
            />
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

export default FormAddBooks
