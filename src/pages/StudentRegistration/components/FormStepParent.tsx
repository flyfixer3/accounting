// @ts-nocheck
import { Button, Col, Form, Input, Row } from 'antd'
import { IStudentRegistrationParentFormPayload } from 'src/models/student-registration.model'
import Spacer from 'src/components/view/Spacer'
import { validatePhoneNumber } from 'src/helpers/validator.helper'
import FormTypeSelection from './FormTypeSelection'
import useParentFormController from '../controller/useParentFormController'
import { useEffect } from 'react'

const FormStepParent = () => {
  const {
    isSubmitting,
    formErrorMsg,
    formAddType,
    formStep,
    onValidateStepParent,
    handleSelectedExistingParent,
    handleBackBtn,
    detailData,
    parentDataPayload,
    onSetExistingData,
    setFormErrorMsg,
  } = useParentFormController()

  const [parentForm] = Form.useForm<IStudentRegistrationParentFormPayload>()

  type FieldType = IStudentRegistrationParentFormPayload

  const handleFinishForm = (e: IStudentRegistrationParentFormPayload) => {
    if (detailData || parentDataPayload) {
      const id = detailData?.id || parentDataPayload?.parentId

      onValidateStepParent(e, formStep, id)
    } else onValidateStepParent(e, formStep)
  }

  const isValidate = () => {
    const data = parentForm.getFieldsValue(true)

    const conditions = [!!data.parentName, !!data.parentPhone]

    if (conditions.includes(false)) {
      return false
    }
    return true
  }

  useEffect(() => {
    if (!detailData) parentForm.resetFields()
    else {
      onSetExistingData(parentForm, detailData)
    }
  }, [detailData])

  useEffect(() => {
    if (parentDataPayload) onSetExistingData(parentForm, parentDataPayload)
  }, [parentDataPayload])

  if (formStep?.step !== 1) return

  return (
    <>
      <FormTypeSelection
        handleSelectedExistingParent={handleSelectedExistingParent}
        form={parentForm}
      />
      <Spacer margin={'1rem auto'} />
      <Form
        name="parentForm"
        form={parentForm}
        initialValues={{
          parentName: '',
          parentPhone: '',
          parentEmail: '',
          parentOccupation: '',
        }}
        onFinish={handleFinishForm}
        onValuesChange={() => setFormErrorMsg(null)}
        layout="vertical"
        autoComplete="off"
        preserve={false}>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={12}>
            <Form.Item<FieldType>
              label="Parent Name"
              name={'parentName'}
              rules={[
                {
                  required: true,
                  message: 'Please input Parent Name',
                },
              ]}>
              <Input disabled={formAddType === 'search_existing'} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item<FieldType>
              label="Parent Phone Number"
              name={'parentPhone'}
              rules={[
                {
                  required: true,
                  message: 'Please input Parent Phone Number',
                },
                validatePhoneNumber,
              ]}>
              <Input disabled={formAddType === 'search_existing'} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[8, 8]}>
          <Col xs={12}>
            <Form.Item<FieldType>
              label="Parent Email"
              name={'parentEmail'}
              rules={[
                {
                  type: 'email',
                  message: 'Please input a valid Parent email',
                },
              ]}>
              <Input
                type="email"
                inputMode="email"
                disabled={formAddType === 'search_existing'}
              />
            </Form.Item>
          </Col>

          <Col xs={12}>
            <Form.Item<FieldType>
              label="Parent Occupation"
              name={'parentOccupation'}>
              <Input disabled={formAddType === 'search_existing'} />
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

export default FormStepParent
