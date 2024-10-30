// @ts-nocheck
import { Button, Col, Form, Row, TimePicker } from 'antd'
import React, { useEffect } from 'react'
import Input from 'antd/es/input/Input'
import SelectCourse from 'src/components/select/SelectCourse/SelectCourse'
import SelectCourseLevel from 'src/components/select/SelectCourse/SelectCourseLevel'
import Spacer from 'src/components/view/Spacer'
import { IClassDetailResponse, IClassFormData } from 'src/models/class.model'
import SelectDayName from 'src/components/select/SelectDaysOfWeek'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import SelectTeacher from 'src/components/select/SelectTeacher/SelectTeacher'
import dayjs from 'dayjs'
import { IRequestErrorData } from 'src/models/general.model'
import SelectActiveStatus from 'src/components/select/SelectActiveStatus'

interface IFormAddClassProps {
  editedData?: IClassDetailResponse
  handleSubmitForm: (e: IClassFormData, isEdit: boolean) => void
  isSubmitting?: boolean
  formErrorMsg?: IRequestErrorData
  handleSetFormMessage?: (e: IRequestErrorData) => void
}

const FormAddClass: React.FC<IFormAddClassProps> = ({
  editedData,
  isSubmitting,
  handleSubmitForm,
  formErrorMsg,
  handleSetFormMessage,
}) => {
  const [classForm] = Form.useForm<IClassFormData>()

  const courseIdValue = Form.useWatch('classCourse', classForm)
  const classDayValue = Form.useWatch('classDay', classForm)

  type FieldType = IClassFormData

  const handleFinishForm = (payload: IClassFormData) => {
    handleSubmitForm(payload, editedData ? true : false)
  }

  const handleCourseChange = (value: number) => {
    classForm.setFieldsValue({
      classCourse: value,
      classCourseLevel: null,
    })
  }

  const handleCourseLevelChange = (value: number) => {
    classForm.setFieldsValue({
      classCourseLevel: value,
    })
  }

  const handleDayNameChage = (value: string) => {
    classForm.setFieldsValue({ classDay: value })
  }

  const handleClassTeacherChange = (value: number) => {
    classForm.setFieldsValue({ classTeacher: value })
  }

  const handleClassStatus = (value: string) => {
    classForm.setFieldsValue({ status: value })
  }

  useEffect(() => {
    if (!editedData) classForm.resetFields()
    else {
      const [startTimeHour, startTimeMin, startTimeSec] =
        editedData?.classStartTime.split(':').map(Number)
      const startTime = dayjs()
        .set('hour', startTimeHour)
        .set('minute', startTimeMin)
        .set('second', startTimeSec)

      const [endTimeHour, endTimeMin, endTimeSec] = editedData?.classEndTime
        .split(':')
        .map(Number)
      const endTime = dayjs()
        .set('hour', endTimeHour)
        .set('minute', endTimeMin)
        .set('second', endTimeSec)

      classForm.setFieldsValue({
        id: editedData?.id,
        className: editedData?.className,
        classDay: editedData?.classDay,
        classStartTime: startTime,
        classEndTime: endTime,
        classCourse: editedData?.classCourse?.id,
        classCourseLevel: editedData?.classCourseLevel?.id,
        classTeacher: editedData?.classTeacher?.id,
        status: editedData?.status,
      })
    }
  }, [editedData])

  return (
    <Form
      name="teacherform"
      form={classForm}
      initialValues={{}}
      onFinish={handleFinishForm}
      onValuesChange={() => {
        handleSetFormMessage({ message: '', errors: null })
      }}
      layout="vertical"
      autoComplete="off"
      preserve={false}>
      {editedData ? (
        <Row>
          <Col xs={24}>
            <Form.Item<FieldType> label="Class ID" name={'id'}>
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
      ) : null}

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Class Name"
            name={'className'}
            rules={[
              {
                required: true,
                message: 'Please input Class Name',
              },
            ]}>
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Class Day Name"
            name={'classDay'}
            rules={[
              {
                required: true,
                message: 'Please input Class Day',
              },
            ]}>
            <SelectDayName
              handleChange={handleDayNameChage}
              value={classDayValue}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Class Start Time"
            name={'classStartTime'}
            validateStatus={
              formErrorMsg?.errors?.classStartTime ? 'error' : 'success'
            }
            rules={[
              {
                required: true,
                message: 'Please input Class Start Time',
              },
            ]}>
            <TimePicker format={DATETIME_FORMATTER_ENUM?.time} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Class End Time"
            name={'classEndTime'}
            validateStatus={
              formErrorMsg?.errors?.classEndTime ? 'error' : 'success'
            }
            rules={[
              {
                required: true,
                message: 'Please input Class End Time',
              },
            ]}>
            <TimePicker format={DATETIME_FORMATTER_ENUM?.time} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Course"
            name={'classCourse'}
            validateStatus={
              formErrorMsg?.errors?.classCourse ? 'error' : 'success'
            }
            rules={[
              {
                required: true,
                message: 'Please input Course',
              },
            ]}>
            <SelectCourse
              handleChange={handleCourseChange}
              value={editedData ? editedData?.classCourse?.id : null}
              placement={'topLeft'}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Course Level"
            name={'classCourseLevel'}
            validateStatus={
              formErrorMsg?.errors?.classCourseLevel ? 'error' : 'success'
            }
            rules={[
              {
                required: true,
                message: 'Please input Course Level',
              },
            ]}>
            <SelectCourseLevel
              courseId={courseIdValue}
              handleChange={handleCourseLevelChange}
              value={editedData ? editedData?.classCourseLevel?.id : null}
              placement={'topLeft'}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12}>
          <Form.Item<FieldType>
            label="Teacher"
            name={'classTeacher'}
            validateStatus={
              formErrorMsg?.errors?.classTeacher ? 'error' : 'success'
            }
            rules={[
              {
                required: true,
                message: 'Please input Class Teacher',
              },
            ]}>
            <SelectTeacher
              handleChange={handleClassTeacherChange}
              value={editedData ? editedData?.classTeacher?.id : 0}
              placement={'topLeft'}
              courseId={courseIdValue}
            />
          </Form.Item>
        </Col>
        {editedData ? (
          <Col xs={24} sm={12}>
            <Form.Item<FieldType>
              label="Status"
              name={'status'}
              validateStatus={
                formErrorMsg?.errors?.status ? 'error' : 'success'
              }
              rules={[
                {
                  required: true,
                  message: 'Please input status',
                },
              ]}>
              <SelectActiveStatus
                handleChange={handleClassStatus}
                value={editedData ? editedData?.status : ''}
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
              <div className="font-error text-center">
                {formErrorMsg?.message}
              </div>
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

export default FormAddClass
