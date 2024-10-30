// @ts-nocheck
import SelectGender from 'src/components/select/SelectGender'
import SelectReligion from 'src/components/select/SelectReligion/SelectReligion'
import SelectSchool from 'src/components/select/SelectSchool/SelectSchool'
import Spacer from 'src/components/view/Spacer'
import { validatePhoneNumber } from 'src/helpers/validator.helper'
import {
  IStudentDetailResponse,
  IStudentFormData,
  StudentGenderType,
} from 'src/models/student.model'
import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Row,
} from 'antd'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'
import { useEffect } from 'react'

interface IFormStudentProps {
  detailData: IStudentDetailResponse
  handleSubmitForm: (e: IStudentFormData) => void
  isSubmitted?: boolean
  formErrorMsg?: string
  setFormErrorMsg?: (e: string) => void
}

const FormStudent: React.FC<IFormStudentProps> = ({
  detailData,
  isSubmitted,
  handleSubmitForm,
  formErrorMsg,
  setFormErrorMsg,
}) => {
  const [studentForm] = Form.useForm<IStudentFormData>()

  type FieldType = IStudentFormData

  const studentSchoolValue = Form.useWatch('studentSchool', studentForm)

  const handleFinishForm = (e: IStudentFormData) => {
    handleSubmitForm(e)
  }

  const handleStudentReligionChange = (value: number) => {
    studentForm.setFieldsValue({ studentReligion: value })
  }

  const handleStudentGender = (value: StudentGenderType) => {
    studentForm.setFieldsValue({ studentGender: value })
  }

  const handleStudentDOB: DatePickerProps['onChange'] = (date, dateString) => {
    studentForm.setFieldsValue({ studentDateOfBirth: date })
  }

  const handleStudentSchool = (value: number) => {
    studentForm.setFieldsValue({ studentSchool: value })
  }

  const isValidate = () => {
    const data = studentForm.getFieldsValue(true)

    const conditions = [
      !!data.studentName,
      !!data.studentEmail,
      !!data.studentGender,
      !!data.studentPlaceOfBirth,
      !!data.studentDateOfBirth,
      !!data.studentReligion,
      !!data.studentAddress,
      !!data.studentCity,
      !!data.studentSchool,
    ]

    if (conditions.includes(false)) {
      return false
    }
    return true
  }

  useEffect(() => {
    if (!detailData) studentForm.resetFields()
    else {
      studentForm.setFieldsValue({
        studentName: detailData?.studentName,
        studentPhoneNumber: detailData?.studentPhoneNumber,
        studentGender: detailData?.gender,
        studentEmail: detailData?.studentEmail,
        studentAddress: detailData?.studentAddress,
        studentCity: detailData?.studentCity,
        studentDateOfBirth: dayjs(detailData?.studentDateOfBirth),
        studentPlaceOfBirth: detailData?.studentPlaceOfBirth,
        studentReligion: detailData?.religion?.id,
        studentSchool: detailData?.school?.id,
      })
    }
  }, [detailData])

  return (
    <>
      <Form
        name="studentForm"
        form={studentForm}
        initialValues={{
          studentName: '',
          studentEmail: '',
          studentPhoneNumber: '',
          studentGender: '',
          studentPlaceOfBirth: '',
          studentDateOfBirth: '',
          studentReligion: '',
          studentAddress: '',
          studentCity: '',
          studentSchool: '',
        }}
        onFinish={handleFinishForm}
        onValuesChange={() => setFormErrorMsg('')}
        layout="vertical"
        autoComplete="off"
        preserve={false}>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={12}>
            <Form.Item<FieldType>
              label="Student Name"
              name={'studentName'}
              rules={[
                {
                  required: true,
                  message: 'Please input Student Name',
                },
              ]}>
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item<FieldType>
              label="Student Phone Number"
              name={'studentPhoneNumber'}
              rules={[validatePhoneNumber]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[8, 8]}>
          <Col xs={24}>
            <Form.Item<FieldType>
              label="Student Email"
              name={'studentEmail'}
              rules={[
                {
                  required: true,
                  message: 'Please input Student Email',
                },
                {
                  type: 'email',
                  message: 'Please input a valid Student email',
                },
              ]}>
              <Input type="email" inputMode="email" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[8, 8]}>
          <Col xs={24} sm={12}>
            <Form.Item<FieldType>
              label="Student Religion"
              name={'studentReligion'}
              rules={[
                {
                  required: true,
                  message: 'Please input Student Religion',
                },
              ]}>
              <SelectReligion
                handleChange={handleStudentReligionChange}
                value={null}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item<FieldType>
              label="Student Gender"
              name={'studentGender'}
              rules={[
                {
                  required: true,
                  message: 'Please input Student Gender',
                },
              ]}>
              <SelectGender value={null} handleChange={handleStudentGender} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[8, 8]}>
          <Col xs={24} sm={12}>
            <Form.Item<FieldType>
              label="Student Place of Birth"
              name={'studentPlaceOfBirth'}
              rules={[
                {
                  required: true,
                  message: 'Please input Student Place of Birth',
                },
              ]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item<FieldType>
              label="Student Date of Birth"
              name={'studentDateOfBirth'}
              rules={[
                {
                  required: true,
                  message: 'Please input Student Date of Birth',
                },
              ]}>
              <DatePicker
                style={{ width: '100%' }}
                format={'YYYY-MM-DD'}
                onChange={handleStudentDOB}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col xs={24}>
            <Form.Item<FieldType>
              label="Student City"
              name={'studentCity'}
              rules={[
                {
                  required: true,
                  message: 'Please input Student City',
                },
              ]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col xs={24}>
            <Form.Item<FieldType>
              label="Student Address"
              name={'studentAddress'}
              rules={[
                {
                  required: true,
                  message: 'Please input Student Address',
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

        <Row>
          <Col xs={24}>
            <Form.Item<FieldType>
              label="Student School"
              name={'studentSchool'}
              rules={[
                {
                  required: true,
                  message: 'Please input Student School',
                },
              ]}>
              <SelectSchool
                handleChange={handleStudentSchool}
                value={
                  studentSchoolValue ||
                  studentForm.getFieldValue('studentSchool')
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Spacer margin={'1rem auto'} />

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
            <Form.Item shouldUpdate noStyle>
              {() => (
                <Button
                  type="primary"
                  block
                  htmlType="submit"
                  disabled={!isValidate() || isSubmitted}
                  loading={isSubmitted}>
                  Save
                </Button>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default FormStudent
