// @ts-nocheck
import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  InputNumber,
  Row,
  Input,
} from 'antd'
import React, { useEffect } from 'react'
import SelectGender from 'src/components/select/SelectGender'
import SelectReligion from 'src/components/select/SelectReligion/SelectReligion'
import TextArea from 'antd/es/input/TextArea'
import SelectTeacherEducation from 'src/components/select/SelectTeacherEducation/SelectTeacherEducation'
import SelectCourse from 'src/components/select/SelectCourse/SelectCourse'
import SelectCourseLevel from 'src/components/select/SelectCourse/SelectCourseLevel'
import dayjs from 'dayjs'

import {
  currencyInputFormatter,
  currencyInputParser,
} from 'src/helpers/formatter.helper'
import Spacer from 'src/components/view/Spacer'
import { validatePhoneNumber } from 'src/helpers/validator.helper'
import {
  IUserTrainingCenterData,
  IUserTrainingCenterRequestPayload,
} from 'src/models/user.model'

interface IFormAddTrainingCenterProps {
  editedData?: IUserTrainingCenterData
  handleSubmitForm: (
    e: IUserTrainingCenterRequestPayload,
    isEdit: boolean,
  ) => void
  isSubmitted?: boolean
  formErrorMsg?: string
  setFormErrorMsg?: (e: string) => void
}

const FormAddTrainingCenter: React.FC<IFormAddTrainingCenterProps> = ({
  editedData,
  isSubmitted,
  handleSubmitForm,
  formErrorMsg,
  setFormErrorMsg,
}) => {
  const [userForm] = Form.useForm<IUserTrainingCenterRequestPayload>()

  type FieldType = IUserTrainingCenterRequestPayload

  const handleFinishForm = (payload: IUserTrainingCenterRequestPayload) => {
    handleSubmitForm(payload, editedData ? true : false)
  }

  useEffect(() => {
    if (!editedData) userForm.resetFields()
    else {
      userForm.setFieldsValue({
        trainingCenterNumber: editedData?.trainingCenterNumber,
        trainingCenterName: editedData?.trainingCenterName,
        trainingCenterEmail: editedData?.trainingCenterEmail,
        trainingCenterPhoneNumber: editedData?.trainingCenterPhoneNumber,
        trainingCenterAddress: editedData?.trainingCenterAddress,
        trainingCenterOwnerName: editedData?.trainingCenterOwnerName,
      })
    }
  }, [editedData])

  return (
    <Form
      name="userForm"
      form={userForm}
      initialValues={{
        loginUsername: '',
        loginPassword: '',
        loginConfirmPassword: '',
        trainingCenterNumber: '',
        trainingCenterName: '',
        trainingCenterEmail: '',
        trainingCenterPhoneNumber: '',
        trainingCenterAddress: '',
        trainingCenterOwnerName: '',
      }}
      onFinish={handleFinishForm}
      onValuesChange={() => {
        setFormErrorMsg('')
      }}
      layout="vertical"
      autoComplete="off"
      preserve={false}>
      {editedData ? null : (
        <>
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={24}>
              <Form.Item<FieldType>
                label="Logged In User Name"
                name={'loginUsername'}
                rules={[
                  {
                    required: true,
                    message: 'Please input Logged In User Name',
                  },
                ]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[8, 8]}>
            <Col xs={24} sm={12}>
              <Form.Item<FieldType>
                label="Password"
                name="loginPassword"
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}>
                <Input.Password />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item<FieldType>
                label="Password"
                name="loginConfirmPassword"
                rules={[
                  {
                    required: true,
                    message: 'Please input your confirm password!',
                  },
                ]}>
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Training Center Number"
            name={'trainingCenterNumber'}
            rules={[
              {
                required: true,
                message: 'Please input user number',
              },
            ]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Training Center Name"
            name={'trainingCenterName'}
            rules={[
              {
                required: true,
                message: 'Please input user Name',
              },
            ]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col xs={24} sm={24}>
          <Form.Item<FieldType>
            label="Training Center Owner Name"
            name={'trainingCenterOwnerName'}
            rules={[
              {
                required: true,
                message: 'Please input owner Name',
              },
            ]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Training Center Email"
            name={'trainingCenterEmail'}
            rules={[
              {
                required: true,
                message: 'Please input user Email',
              },
              {
                type: 'email',
                message: 'Please input a valid email',
              },
            ]}>
            <Input type="email" inputMode="email" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Training Center Phone Number"
            name={'trainingCenterPhoneNumber'}
            rules={[
              {
                required: true,
                message: 'Please input user Phone Number',
              },
              validatePhoneNumber,
            ]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col xs={24}>
          <Form.Item<FieldType>
            label="Training Center Address"
            name={'trainingCenterAddress'}
            rules={[
              {
                required: true,
                message: 'Please input user Address',
              },
            ]}>
            <TextArea
              rows={4}
              placeholder="Jl. Melati 1 no 2 ..."
              autoSize={false}
              style={{ resize: 'none' }}
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

export default FormAddTrainingCenter
