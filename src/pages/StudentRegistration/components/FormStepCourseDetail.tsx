// @ts-nocheck
import { Button, Col, Form, Row } from 'antd'
import { IStudentRegistrationCourseDetailFormData } from 'src/models/student-registration.model'
import Spacer from 'src/components/view/Spacer'
import SelectCourse from 'src/components/select/SelectCourse/SelectCourse'
import SelectCourseLevel from 'src/components/select/SelectCourse/SelectCourseLevel'
import SelectBookByCourseLevel from 'src/components/select/SelectBookByCourseLevel/SelectBookByCourseLevel'
import { useEffect, useState } from 'react'
import { ICourseData, ICourseLevelData } from 'src/models/course.model'
import useCourseDetailFormController from '../controller/useCourseDetailFormController'
import { IBookData } from 'src/models/books.model'

const FormStepCourseDetail = () => {
  const {
    isSubmitting,
    formErrorMsg,
    onValidateStepCourseDetail,
    formStep,
    handleBackBtn,
    courseDetailDataPayload,
    onSetExistingData,
    setFormErrorMsg,
  } = useCourseDetailFormController()

  const [selectedCourseObj, setSelectedCourseObj] = useState<ICourseData>(null)
  const [selectedCourseLevelObj, setSelectedCourseLevelObj] =
    useState<ICourseLevelData>(null)
  const [selectedBookObj, setSelectedBookObj] = useState<IBookData>(null)

  const [courseDetailForm] =
    Form.useForm<IStudentRegistrationCourseDetailFormData>()
  const courseIdValue = Form.useWatch('courseId', courseDetailForm)
  const courseLevelIdValue = Form.useWatch('courseLevelId', courseDetailForm)
  const bookIdValue = Form.useWatch('bookId', courseDetailForm)

  type FieldType = IStudentRegistrationCourseDetailFormData

  const handleFinishForm = (e: IStudentRegistrationCourseDetailFormData) => {
    const newFormResult = {
      ...e,
      selectedCourseObj,
      selectedCourseLevelObj,
      selectedBookObj,
    }

    onValidateStepCourseDetail(newFormResult, formStep)
  }

  const handleCourseChange = (value: number, obj: any) => {
    setSelectedCourseObj(obj)
    courseDetailForm.setFieldsValue({
      courseId: value,
      courseLevelId: null,
      bookId: null,
    })
  }

  const handleCourseLevelChange = (value: number, obj: any) => {
    setSelectedCourseLevelObj(obj)
    courseDetailForm.setFieldsValue({
      courseLevelId: value,
      bookId: null,
    })
  }
  const handleBookChange = (value: number, obj: any) => {
    setSelectedBookObj(obj)
    courseDetailForm.setFieldsValue({ bookId: value })
  }

  const isValidate = () => {
    const data = courseDetailForm.getFieldsValue(true)

    const conditions = [!!data.courseId, !!data.courseLevelId, !!data.bookId]

    if (conditions.includes(false)) {
      return false
    }
    return true
  }

  useEffect(() => {
    if (courseDetailDataPayload)
      onSetExistingData(courseDetailForm, courseDetailDataPayload)
  }, [courseDetailDataPayload])

  if (formStep?.step !== 2) return

  return (
    <>
      <Spacer margin={'1rem auto'} />
      <Form
        name="courseDetailForm"
        form={courseDetailForm}
        initialValues={{
          courseId: '',
          bookId: '',
          courseLevelId: '',
          selectedCourseObj: null,
          selectedCourseLevelObj: null,
        }}
        onFinish={handleFinishForm}
        onValuesChange={() => setFormErrorMsg(null)}
        layout="vertical"
        autoComplete="off"
        preserve={false}>
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
                value={courseIdValue}
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
                value={courseLevelIdValue}
                placement={'topLeft'}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[8, 8]}>
          <Col xs={24}>
            <Form.Item<FieldType>
              label="Book"
              name={'bookId'}
              rules={[
                {
                  required: true,
                  message: 'Please input Book',
                },
              ]}>
              <SelectBookByCourseLevel
                courseLevelId={courseLevelIdValue}
                value={bookIdValue}
                handleChange={handleBookChange}
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

        <Row gutter={[16, 8]}>
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
          <Col xs={24}>
            <Form.Item>
              <Button type="primary" block ghost onClick={handleBackBtn}>
                Back
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default FormStepCourseDetail
