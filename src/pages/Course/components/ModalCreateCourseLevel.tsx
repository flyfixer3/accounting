// @ts-nocheck
import { ICourseLevelIBORequestPayload } from 'src/models/course.model'
import { Button, Form, InputNumber } from 'antd'
import Modal from 'antd/es/modal/Modal'
import Input from 'antd/es/input/Input'
import {
  currencyInputFormatter,
  currencyInputParser,
} from 'src/helpers/formatter.helper'
import Spacer from 'src/components/view/Spacer'
import { STATUS_ENUM } from 'src/enums/enums'
import { useEffect } from 'react'

interface IModalCreateCourseLevelProps {
  isVisible: boolean
  handleClose: () => void
  title: string
  editedData: ICourseLevelIBORequestPayload
  handleSubmitForm: (e: ICourseLevelIBORequestPayload, isEdit: boolean) => void
  isSubmitting?: boolean
  formErrorMsg?: string
}

const ModalCreateCourseLevel = ({
  isVisible,
  handleClose,
  title,
  editedData,
  handleSubmitForm,
  isSubmitting,
  formErrorMsg,
}: IModalCreateCourseLevelProps) => {
  const [courseLevelForm] = Form.useForm<ICourseLevelIBORequestPayload>()
  type FieldType = ICourseLevelIBORequestPayload

  const handleFinishForm = (e: ICourseLevelIBORequestPayload) => {
    handleSubmitForm(e, editedData ? true : false)
  }

  useEffect(() => {
    if (!editedData) courseLevelForm.resetFields()
    else {
      courseLevelForm.setFieldsValue({
        id: editedData?.id,
        courseLevelName: editedData?.courseLevelName,
        courseLevelMonthlyFee: editedData?.courseLevelMonthlyFee,
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
            name="courseLevelForm"
            form={courseLevelForm}
            initialValues={{
              id: null,
              courseLevelName: '',
              courseLevelMonthlyFee: '',
            }}
            onFinish={handleFinishForm}
            layout="vertical"
            autoComplete="off"
            preserve={false}>
            {editedData ? (
              <Form.Item<FieldType>
                label="Course Level ID"
                name={'id'}
                noStyle
                hidden
              />
            ) : null}
            <Form.Item<FieldType>
              label="Course Level Name"
              name={'courseLevelName'}
              rules={[
                { required: true, message: 'Please input Course Level Name' },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Course Level Monthly Fee"
              name={'courseLevelMonthlyFee'}
              rules={[
                { required: true, message: 'Please input Course Monthly Fee' },
              ]}>
              <InputNumber
                formatter={(value: string) =>
                  currencyInputFormatter(value, 'Rp')
                }
                parser={(value: string) => currencyInputParser(value, 'Rp')}
                style={{ width: '100%' }}
              />
            </Form.Item>

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

export default ModalCreateCourseLevel
