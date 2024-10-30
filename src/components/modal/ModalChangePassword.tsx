// @ts-nocheck
import { Button, Col, Form, Input, Row } from 'antd'
import Modal from 'antd/es/modal/Modal'
import React from 'react'
import useModalChangePasswordController from './controller/useModalChangePasswordController'
import { IChangePasswordRequestPayload } from 'src/models/auth.model'
import Spacer from '../view/Spacer'

interface IModalChangePasswordProps {
  isVisible: boolean
  handleClose: (e?: boolean) => void
  isOldPasswordVisibile?: boolean
}

const ModalChangePassword: React.FC<IModalChangePasswordProps> = ({
  isVisible,
  handleClose,
  isOldPasswordVisibile = true,
}) => {
  const { isSubmitted, inputError, setInputError, onSubmit } =
    useModalChangePasswordController()

  const [forgotPasswordForm] = Form.useForm<IChangePasswordRequestPayload>()
  type FieldType = IChangePasswordRequestPayload

  return (
    <Modal
      title={'Change Password'}
      open={isVisible}
      onCancel={() => handleClose()}
      footer={null}>
      <Form
        form={forgotPasswordForm}
        layout="vertical"
        autoComplete="off"
        onFinish={async (e: IChangePasswordRequestPayload) => {
          await onSubmit(e, forgotPasswordForm)
        }}
        onValuesChange={() => setInputError(null)}>
        {isOldPasswordVisibile ? (
          <Form.Item<FieldType>
            label={'Old Password'}
            name={'oldPassword'}
            validateStatus={
              inputError?.errors?.['oldPassword'] ? 'error' : 'success'
            }
            rules={[
              {
                required: true,
                message: 'Please input Old Password',
              },
            ]}>
            <Input.Password />
          </Form.Item>
        ) : null}

        <Form.Item<FieldType>
          label={'New Password'}
          name={'newPassword'}
          validateStatus={
            inputError?.errors?.['newPassword'] ? 'error' : 'success'
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
            inputError?.errors?.['confirmPassword'] ? 'error' : 'success'
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

        {inputError?.message ? (
          <>
            <Row>
              <Col xs={24}>
                <div className="font-error text-center">
                  {inputError?.message}
                </div>
              </Col>
            </Row>
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
