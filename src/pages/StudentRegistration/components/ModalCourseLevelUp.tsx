// @ts-nocheck
import Modal from 'antd/es/modal/Modal'
import React from 'react'
import { Button, Col, Form, Row } from 'antd'
import Spacer from 'src/components/view/Spacer'
import {
  IStudentCourseLevelUpRequestPayload,
  IStudentRegistrationDetailResponse,
} from 'src/models/student-registration.model'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import SelectCourseLevelUpByStudent from 'src/components/select/SelectCourseLevelByStudent/SelectCourseLevelByStudent'

interface IModalCourseLevelUpProps {
  isVisible: boolean
  handleClose: () => void
  selectedData: IStudentRegistrationDetailResponse
  formErrorMsg: string
  isSubmitted: boolean
  onSetFormErrorMsg: (e: string) => void
  onHandleSubmit: (e: IStudentCourseLevelUpRequestPayload) => void
}

const ModalCourseLevelUp: React.FC<IModalCourseLevelUpProps> = ({
  isVisible,
  handleClose,
  selectedData,
  formErrorMsg,
  isSubmitted,
  onSetFormErrorMsg,
  onHandleSubmit,
}) => {
  const [studentUpdateCourseLevelForm] =
    Form.useForm<IStudentCourseLevelUpRequestPayload>()
  type FieldType = IStudentCourseLevelUpRequestPayload

  const courseLevelValue = Form.useWatch(
    'courseLevelId',
    studentUpdateCourseLevelForm,
  )

  const handleFinishForm = (e: IStudentCourseLevelUpRequestPayload) => {
    onHandleSubmit(e)
  }

  const handleCourseLevelChange = (value: number) => {
    studentUpdateCourseLevelForm.setFieldsValue({ courseLevelId: value })
  }

  const isValidate = () => {
    const data = studentUpdateCourseLevelForm.getFieldsValue(true)

    const conditions = [!!data.courseLevelId]

    if (conditions.includes(false)) {
      return false
    }
    return true
  }

  return (
    <Modal
      open={isVisible}
      onCancel={handleClose}
      maskClosable={false}
      footer={null}
      title={'Course Level Up'}>
      <Form
        name="studentUpdateCourseLevelForm"
        form={studentUpdateCourseLevelForm}
        initialValues={{
          courseLevelId: '',
        }}
        onValuesChange={() => onSetFormErrorMsg('')}
        onFinish={handleFinishForm}
        layout="vertical"
        autoComplete="off"
        preserve={false}>
        <DetailRow
          title="Current Course Level"
          value={
            selectedData?.studentCourseDetail?.courseLevel?.courseLevelName
          }
        />
        <Form.Item<FieldType>
          label="Course Level"
          name={'courseLevelId'}
          rules={[
            {
              required: true,
              message: 'Please input Course Level',
            },
          ]}>
          <SelectCourseLevelUpByStudent
            courseId={selectedData?.studentCourseDetail?.course?.id}
            studentId={selectedData?.student?.id}
            handleChange={handleCourseLevelChange}
            value={courseLevelValue}
            placement={'topLeft'}
          />
        </Form.Item>

        <Row gutter={[8, 16]}>
          {formErrorMsg ? (
            <>
              <Col xs={24}>
                <div className="font-error text-center">{formErrorMsg}</div>
              </Col>

              <Spacer margin={'4px auto'} />
            </>
          ) : null}

          <Col xs={24}>
            <Form.Item>
              <Button
                type="primary"
                block
                htmlType="submit"
                disabled={!isValidate() || isSubmitted}>
                Update
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default ModalCourseLevelUp
