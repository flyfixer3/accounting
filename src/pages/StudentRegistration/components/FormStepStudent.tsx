// @ts-nocheck
import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Row,
} from 'antd'
import { IStudentRegistrationStudentFormData } from 'src/models/student-registration.model'
import SelectReligion from 'src/components/select/SelectReligion/SelectReligion'
import SelectGender from 'src/components/select/SelectGender'
import TextArea from 'antd/es/input/TextArea'
import SelectSchool from 'src/components/select/SelectSchool/SelectSchool'
import Spacer from 'src/components/view/Spacer'
import { validatePhoneNumber } from 'src/helpers/validator.helper'
import FormTypeSelection from './FormTypeSelection'
import useStudentFormController from '../controller/useStudentFormController'
import { StudentGenderType } from 'src/models/student.model'
import { useEffect } from 'react'

const FormStepStudent = () => {
  const {
    isSubmitting,
    formErrorMsg,
    formAddType,
    formStep,
    onValidateStepStudent,
    handleSelectedExistingStudent,
    detailData,
    studentDataPayload,
    onSetExistingData,
    setFormErrorMsg,
  } = useStudentFormController()

  const [studentForm] = Form.useForm<IStudentRegistrationStudentFormData>()

  type FieldType = IStudentRegistrationStudentFormData

  const studentSchoolValue = Form.useWatch('studentSchool', studentForm)

  const handleFinishForm = (e: IStudentRegistrationStudentFormData) => {
    if (detailData || studentDataPayload) {
      const id = detailData?.id || studentDataPayload?.studentId

      onValidateStepStudent(e, id)
    } else onValidateStepStudent(e)
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
      onSetExistingData(studentForm, detailData)
    }
  }, [detailData])

  useEffect(() => {
    if (studentDataPayload) onSetExistingData(studentForm, studentDataPayload)
  }, [studentDataPayload])

  if (formStep?.step !== 0) return

  return (
    <>
      <FormTypeSelection
        handleSelectedExistingStudent={handleSelectedExistingStudent}
        form={studentForm}
      />
      <Spacer margin={'1rem auto'} />
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
        onValuesChange={() => setFormErrorMsg(null)}
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
              <Input disabled={formAddType === 'search_existing'} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item<FieldType>
              label="Student Phone Number"
              name={'studentPhoneNumber'}
              rules={[validatePhoneNumber]}>
              <Input disabled={formAddType === 'search_existing'} />
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
              <Input
                type="email"
                inputMode="email"
                disabled={formAddType === 'search_existing'}
              />
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
                disabled={formAddType === 'search_existing'}
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
              <SelectGender
                value={null}
                handleChange={handleStudentGender}
                disabled={formAddType === 'search_existing'}
              />
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
              <Input disabled={formAddType === 'search_existing'} />
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
                disabled={formAddType === 'search_existing'}
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
              <Input disabled={formAddType === 'search_existing'} />
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
                disabled={formAddType === 'search_existing'}
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
                disabled={formAddType === 'search_existing'}
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
                  disabled={!isValidate() || isSubmitting}
                  loading={isSubmitting}>
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

export default FormStepStudent
