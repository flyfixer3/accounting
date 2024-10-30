// @ts-nocheck
import {
  ITeacherData,
  ITeacherDetailResponse,
  TeacherGenderType,
} from 'src/models/teacher.model'
import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  InputNumber,
  Row,
} from 'antd'
import React, { useEffect } from 'react'
import Input from 'antd/es/input/Input'
import SelectGender from 'src/components/select/SelectGender'
import SelectReligion from 'src/components/select/SelectReligion/SelectReligion'
import TextArea from 'antd/es/input/TextArea'
import SelectTeacherEducation from 'src/components/select/SelectTeacherEducation/SelectTeacherEducation'
import SelectCourse from 'src/components/select/SelectCourse/SelectCourse'
import SelectCourseLevel from 'src/components/select/SelectCourse/SelectCourseLevel'
import dayjs from 'dayjs'
import SelectTeacherStatus from './SelectTeacherStatus'
import {
  currencyInputFormatter,
  currencyInputParser,
} from 'src/helpers/formatter.helper'
import Spacer from 'src/components/view/Spacer'
import { validatePhoneNumber } from 'src/helpers/validator.helper'
interface IFormAddTeacherProps {
  editedData?: ITeacherDetailResponse
  handleSubmitForm: (e: ITeacherData, isEdit: boolean) => void
  isSubmitting?: boolean
  formErrorMsg?: string
  setFormErrorMsg?: (e: string) => void
}

const FormAddTeacher: React.FC<IFormAddTeacherProps> = ({
  editedData,
  isSubmitting,
  handleSubmitForm,
  formErrorMsg,
  setFormErrorMsg,
}) => {
  const [teacherForm] = Form.useForm<ITeacherData>()

  const courseIdValue = Form.useWatch('courseId', teacherForm)

  type FieldType = ITeacherData

  const handleFinishForm = (payload: ITeacherData) => {
    handleSubmitForm(payload, editedData ? true : false)
  }

  const handleCourseChange = (value: string) => {
    teacherForm.setFieldsValue({ courseId: value, courseLevelId: null })
  }

  const handleCourseLevelChange = (value: number) => {
    teacherForm.setFieldsValue({ courseLevelId: value })
  }

  const handleTeacherEduChange = (value: number) => {
    teacherForm.setFieldsValue({ teacherEducation: value })
  }

  const handleTeacherReligionChange = (value: number) => {
    teacherForm.setFieldsValue({ religion: value })
  }

  const handleTeacherGender = (value: TeacherGenderType) => {
    teacherForm.setFieldsValue({ gender: value })
  }

  const handleTeacherJoinDate: DatePickerProps['onChange'] = (
    date,
    dateString,
  ) => {
    teacherForm.setFieldsValue({ teacherJoinDate: date })
  }

  const handleTeacherDOB: DatePickerProps['onChange'] = (date, dateString) => {
    teacherForm.setFieldsValue({ teacherDateOfBirth: date })
  }

  const handleTeacherStatus = (value: string) => {
    teacherForm.setFieldsValue({ teacherStatus: value })
  }

  useEffect(() => {
    if (!editedData) teacherForm.resetFields()
    else {
      teacherForm.setFieldsValue({
        teacherNumber: editedData?.teacherNumber,
        teacherName: editedData?.teacherName,
        teacherNickname: editedData?.teacherNickname,
        gender: editedData?.gender === 'Male' ? 'M' : 'F',
        teacherEmail: editedData?.teacherEmail,
        teacherPhoneNumber: editedData?.teacherPhoneNumber,
        teacherAddress: editedData?.teacherAddress,
        teacherDateOfBirth: dayjs(editedData?.teacherDateOfBirth),
        teacherPlaceOfBirth: editedData?.teacherPlaceOfBirth,
        teacherJoinDate: dayjs(editedData?.teacherJoinDate),
        teacherEducation: editedData?.teacherEducation?.id,
        religion: editedData?.religion?.id,
        courseId: editedData?.teacherCourseLevel?.courseNumber,
        courseLevelId: editedData?.teacherCourseLevel?.courseLevelId,
        teacherStatus: editedData?.teacherStatus,
        baseSalary: editedData?.baseSalary,
      })
    }
  }, [editedData])

  return (
    <Form
      name="teacherform"
      form={teacherForm}
      initialValues={{
        teacherName: '',
        teacherNickname: '',
        teacherStatus: 0,
        teacherPhoneNumber: '',
        gender: 'M',
        teacherPlaceOfBirth: '',
        teacherDateOfBirth: '',
        teacherAddress: '',
        teacherJoinDate: '',
        baseSalary: '',
      }}
      onFinish={handleFinishForm}
      onValuesChange={() => {
        setFormErrorMsg('')
      }}
      layout="vertical"
      autoComplete="off"
      preserve={false}>
      {editedData ? (
        <Row>
          <Col xs={24}>
            <Form.Item<FieldType> label="Teacher Number" name={'teacherNumber'}>
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
      ) : null}
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Teacher Name"
            name={'teacherName'}
            rules={[
              {
                required: true,
                message: 'Please input Teacher Name',
              },
            ]}>
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Teacher Nickname"
            name={'teacherNickname'}
            rules={[
              {
                required: true,
                message: 'Please input Teacher Nickname',
              },
            ]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Teacher Email"
            name={'teacherEmail'}
            rules={[
              {
                required: true,
                message: 'Please input Teacher Email',
              },
              {
                type: 'email',
                message: 'Please input a valid Teacher email',
              },
            ]}>
            <Input type="email" inputMode="email" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Teacher Phone Number"
            name={'teacherPhoneNumber'}
            rules={[
              {
                required: true,
                message: 'Please input Teacher Phone Number',
              },
              validatePhoneNumber,
            ]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Teacher Place of Birth"
            name={'teacherPlaceOfBirth'}
            rules={[
              {
                required: true,
                message: 'Please input Teacher Place of Birth',
              },
            ]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Teacher Date of Birth"
            name={'teacherDateOfBirth'}
            rules={[
              {
                required: true,
                message: 'Please input Teacher Date of Birth',
              },
            ]}>
            <DatePicker
              style={{ width: '100%' }}
              format={'YYYY-MM-DD'}
              onChange={handleTeacherDOB}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col xs={24}>
          <Form.Item<FieldType>
            label="Teacher Address"
            name={'teacherAddress'}
            rules={[
              {
                required: true,
                message: 'Please input Teacher Address',
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

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Teacher Gender"
            name={'gender'}
            rules={[
              {
                required: true,
                message: 'Please input Teacher Gender',
              },
            ]}>
            <SelectGender
              value={editedData ? editedData?.gender : 'M'}
              handleChange={handleTeacherGender}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Teacher Religion"
            name={'religion'}
            rules={[
              {
                required: true,
                message: 'Please input Teacher Religion',
              },
            ]}>
            <SelectReligion
              handleChange={handleTeacherReligionChange}
              value={editedData ? editedData?.religion?.id : 0}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Teacher Join Date"
            name={'teacherJoinDate'}
            rules={[
              {
                required: true,
                message: 'Please input Teacher Join Date',
              },
            ]}>
            <DatePicker
              style={{ width: '100%' }}
              format={'YYYY-MM-DD'}
              onChange={handleTeacherJoinDate}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Teacher Education"
            name={'teacherEducation'}
            rules={[
              {
                required: true,
                message: 'Please input Teacher Education',
              },
            ]}>
            <SelectTeacherEducation
              handleChange={handleTeacherEduChange}
              value={editedData ? editedData?.teacherEducation?.id : 0}
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
              value={
                editedData ? editedData?.teacherCourseLevel?.courseNumber : null
              }
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
              value={
                editedData
                  ? editedData?.teacherCourseLevel?.courseLevelId
                  : null
              }
              placement={'topLeft'}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Teacher Base Salary"
            name={'baseSalary'}
            rules={[
              {
                required: true,
                message: 'Please input Teacher Base Salary',
              },
            ]}>
            <InputNumber
              formatter={(value: string) => currencyInputFormatter(value, 'Rp')}
              parser={(value: string) => currencyInputParser(value, 'Rp')}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        {editedData ? (
          <Col xs={24} sm={12}>
            <Form.Item<FieldType> label="Teacher Status" name={'teacherStatus'}>
              <SelectTeacherStatus
                handleChange={handleTeacherStatus}
                value={editedData ? editedData?.teacherStatus : null}
                placement={'topLeft'}
              />
            </Form.Item>
          </Col>
        ) : null}
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
              disabled={isSubmitting}
              loading={isSubmitting}>
              Save
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default FormAddTeacher
