// @ts-nocheck
import { Button, Form } from 'antd'
import Input from 'antd/es/input/Input'
import Modal from 'antd/es/modal/Modal'
import useModalAddSchoolController from './controller/useModalAddSchoolController'
import { ISchoolFormData } from 'src/models/school.model'
import React from 'react'

interface IModalAddSchoolProps {
  isVisible: boolean
  handleClose: (e?: boolean) => void
}

const ModalAddSchool: React.FC<IModalAddSchoolProps> = ({
  isVisible,
  handleClose,
}) => {
  const { isSubmitted, inputError, onSubmit } = useModalAddSchoolController()

  const [schoolForm] = Form.useForm<ISchoolFormData>()
  type FieldType = ISchoolFormData

  return (
    <Modal
      title={'Add New School'}
      open={isVisible}
      onCancel={() => handleClose()}
      footer={null}>
      <Form
        form={schoolForm}
        initialValues={{
          schoolName: '',
        }}
        layout="vertical"
        autoComplete="off"
        onFinish={async (e) => {
          await onSubmit(e, schoolForm)
          handleClose(true)
        }}>
        <Form.Item<FieldType>
          label={'School Name'}
          name={'schoolName'}
          validateStatus={inputError ? 'error' : 'success'}
          rules={[
            {
              required: true,
              message: 'Please input School Name',
            },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={isSubmitted} block>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalAddSchool
