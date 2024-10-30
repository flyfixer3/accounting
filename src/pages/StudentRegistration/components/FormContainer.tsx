// @ts-nocheck
import { Card, Col, Row } from 'antd'
import FormHeader from './FormHeader'
import Spacer from 'src/components/view/Spacer'
import FormStepStudent from './FormStepStudent'
import FormStepParent from './FormStepParent'
import FormStepCourseDetail from './FormStepCourseDetail'
import FormStepCourseClass from './FormStepCourseClass'
import { useStudentRegistrationContext } from '../context/student-registration.context'
import { useEffect } from 'react'
import FormReview from './FormReview'

const FormContainer = () => {
  const { handleChangeFormStep } = useStudentRegistrationContext()

  useEffect(() => {
    handleChangeFormStep(0)
  }, [])

  return (
    <>
      <Row>
        <Col xs={24} sm={3} />
        <Col xs={24} sm={16}>
          <FormHeader />

          <Spacer margin={'1rem auto'} />

          <Card>
            <FormStepStudent />
            <FormStepParent />
            <FormStepCourseDetail />
            <FormStepCourseClass />
            <FormReview />
          </Card>
        </Col>
        <Col xs={24} sm={3} />
      </Row>
    </>
  )
}

export default FormContainer
