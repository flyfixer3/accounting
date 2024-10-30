// @ts-nocheck
import { ICourseIBORequestPayload } from 'src/models/course.model'
import { Button, Form, InputNumber } from 'antd'
import Modal from 'antd/es/modal/Modal'
import Input from 'antd/es/input/Input'
import {
  currencyInputFormatter,
  currencyInputParser,
} from 'src/helpers/formatter.helper'
import Spacer from 'src/components/view/Spacer'
import { useEffect } from 'react'

interface IModalCreateCourseProps {
  isVisible: boolean
  handleClose: () => void
  title: string
  editedData: ICourseIBORequestPayload
  handleSubmitForm: (e: ICourseIBORequestPayload, isEdit: boolean) => void
  isSubmitting?: boolean
  formErrorMsg?: string
}

const ModalCreateCourse = ({
  isVisible,
  handleClose,
  title,
  editedData,
  handleSubmitForm,
  isSubmitting,
  formErrorMsg,
}: IModalCreateCourseProps) => {
  const [courseForm] = Form.useForm<ICourseIBORequestPayload>()

  type FieldType = ICourseIBORequestPayload

  const handleFinishForm = (e: ICourseIBORequestPayload) => {
    handleSubmitForm(e, editedData ? true : false)
  }

  useEffect(() => {
    if (!editedData) courseForm.resetFields()
    else {
      courseForm.setFieldsValue({
        courseNumber: editedData?.courseNumber,
        courseName: editedData?.courseName,
        courseRegistrationFee: editedData?.courseRegistrationFee,
      })
    }
  }, [editedData])

  return (
    <>
      <Modal
        open={isVisible}
        onCancel={handleClose}
        title={title}
        maskClosable={false}
        closeIcon={true}
        footer={null}>
        <>
          <Form
            name="courseForm"
            form={courseForm}
            initialValues={{
              courseNumber: '',
              courseName: '',
              courseRegistrationFee: '',
              courseVoucherPricePerBundle: '',
            }}
            onFinish={handleFinishForm}
            onValuesChange={() => {}}
            layout="vertical"
            autoComplete="off"
            preserve={false}>
            <Form.Item<FieldType>
              label="Course Number"
              name={'courseNumber'}
              rules={[
                {
                  required: true,
                  message: 'Please input Course Number',
                },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Course Name"
              name={'courseName'}
              rules={[{ required: true, message: 'Please input Course Name' }]}>
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Course Registration Fee"
              name={'courseRegistrationFee'}
              rules={[
                {
                  required: true,
                  message: 'Please input Course Registration Fee',
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

            {!editedData ? (
              <Form.Item<FieldType>
                label="Course Voucher Price per Bundle (1 bundle @ 25 voucher)"
                name={'courseVoucherPricePerBundle'}
                rules={[
                  {
                    required: true,
                    message: 'Please input Course Voucher Price per Bundle Fee',
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
            ) : null}

            {formErrorMsg ? (
              <div className="font-error">{formErrorMsg}</div>
            ) : null}
            <Spacer margin=".5rem" />

            <Form.Item>
              <Button
                type="primary"
                block
                htmlType="submit"
                disabled={isSubmitting}
                loading={isSubmitting}>
                Save
              </Button>
            </Form.Item>
          </Form>
        </>
      </Modal>
    </>
  )
}

export default ModalCreateCourse
