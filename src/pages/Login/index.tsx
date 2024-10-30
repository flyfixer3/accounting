// @ts-nocheck
import { Button, Col, Form, Image, Input, Row } from 'antd'
import React from 'react'
import loginBgImg from 'src/assets/images/bg/login-bg.jpg'

import { appColors } from 'src/assets/styles/styles'
import Spacer from 'src/components/view/Spacer'
import useResponsive from 'src/hooks/useResponsive'
import useLoginController from './controller/useLoginController'
import styles from './index.module.scss'

const Login: React.FC = () => {
  const { isOnlyMobile } = useResponsive()
  const { onSubmitLogin, isSubmitting, errorMsg, onFormValueChange } =
    useLoginController()

  type FieldType = {
    username?: String
    password?: String
  }

  return (
    <div className={styles?.loginContainer}>
      <Row>
        {isOnlyMobile ? null : (
          <Col xs={8}>
            <Image
              src={loginBgImg}
              height={'100vh'}
              className="object-cover"
              width={'100%'}
            />
            <div
              style={{
                backgroundColor: `${appColors?.blue50}50`,
                position: 'absolute',
                top: 0,
                height: '100%',
                width: '100%',
              }}></div>
          </Col>
        )}
        <Col xs={24} sm={10}>
          <div className={styles?.loginFormWrapper}>
            <div className={styles?.loginWelcomeTxt}>
              <span>Welcome,</span> login with your IBO / TC account
            </div>
            <Form
              name="loginForm"
              initialValues={{
                username: '',
                password: '',
              }}
              onFinish={(e) => onSubmitLogin(e)}
              onValuesChange={onFormValueChange}
              layout="vertical"
              autoComplete={'off'}
              className={styles?.loginForm}>
              <Form.Item<FieldType>
                label="Username"
                name={'username'}
                rules={[
                  { required: true, message: 'Please input your username!' },
                ]}>
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}>
                <Input.Password />
              </Form.Item>

              {errorMsg ? <div className="font-error">{errorMsg}</div> : null}
              <Spacer margin=".5rem" />
              <Form.Item>
                <Button
                  type="primary"
                  block
                  htmlType="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}>
                  Login
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Login
