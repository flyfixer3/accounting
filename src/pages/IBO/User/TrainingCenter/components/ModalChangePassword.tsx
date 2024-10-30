// @ts-nocheck
import { IUserTrainingCenterChangePasswordRequestPayload } from '@src/models/user.model'
import { Button, Col, Form, Input } from 'antd'
import Modal from 'antd/es/modal/Modal'
import React, { useEffect } from 'react'

import Spacer from 'src/components/view/Spacer'

interface IModalChangePasswordProps {
  isVisible: boolean
  handleClose: (e?: boolean) => void
  isSubmitted: boolean
  formErrorMsg: any
  onSetFormErrorMsg: (e: string) => void
  onSubmit: (e: IUserTrainingCenterChangePasswordRequestPayload) => void
}

const ModalChangePassword: React.FC<IModalChangePasswordProps> = ({
  isVisible,
  handleClose,
  isSubmitted,
  formErrorMsg,
  onSetFormErrorMsg,
  onSubmit,
}) => {
  const [forgotPasswordForm] =
    Form.useForm<IUserTrainingCenterChangePasswordRequestPayload>()
  type FieldType = IUserTrainingCenterChangePasswordRequestPayload

  useEffect(() => {
    return () => forgotPasswordForm.resetFields()
  }, [])

  return (
    <Modal
      title={'Forgot Password'}
      open={isVisible}
      onCancel={() => handleClose()}
      footer={null}>
      <Form
        form={forgotPasswordForm}
        layout="vertical"
        autoComplete="off"
        onValuesChange={() => onSetFormErrorMsg('')}
        onFinish={async (
          e: IUserTrainingCenterChangePasswordRequestPayload,
        ) => {
          await onSubmit(e)
        }}>
        <Form.Item<FieldType>
          label={'New Password'}
          name={'newPassword'}
          validateStatus={
            formErrorMsg?.errors?.['newPassword'] ? 'error' : 'success'
          }
          rules={[
            {
              required: true,
              message: 'Please input New Password',
            },
          ]}>
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          label={'Confirm Password'}
          name={'confirmPassword'}
          dependencies={['newPassword']}
          validateStatus={
            formErrorMsg?.errors?.['confirmPassword'] ? 'error' : 'success'
          }
          rules={[
            {
              required: true,
              message: 'Please input Confirm Password',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(
                  new Error('The new password that you entered do not match!'),
                )
              },
            }),
          ]}>
          <Input.Password />
        </Form.Item>

        {formErrorMsg ? (
          <>
            <Col xs={24}>
              <div className="font-error text-center">
                {formErrorMsg?.message}
              </div>
            </Col>

            <Spacer margin={'4px auto'} />
          </>
        ) : null}

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={isSubmitted} block>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalChangePassword
