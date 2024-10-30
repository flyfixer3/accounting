// @ts-nocheck
import { Col, Row } from 'antd'
import useTeacherAddController from '../controller/useTeacherAddController'
import FormAddTeacher from '../components/FormAddTeacher'
import Spacer from 'src/components/view/Spacer'
import styles from './index.module.scss'
import Card from 'antd/es/card/Card'
import { useEffect } from 'react'

const TeacherCreate = () => {
  const {
    handleSubmitCourseForm,
    formErrorMsg,
    isSubmitting,
    onSetBreadcrumbs,
    setFormErrorMsg,
  } = useTeacherAddController()

  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'Teacher',
        path: '/teacher',
      },
      {
        title: 'Add Teacher',
        path: '/teacher/add',
      },
    ])
  }, [])

  return (
    <>
      <Row>
        <Col xs={24} sm={5} />
        <Col xs={24} sm={14}>
          <Row>
            <Col xs={24}>
              <div className={styles?.addTeacherTitle}>Add New Teacher</div>
            </Col>
          </Row>

          <Spacer margin={'.5rem auto'} />

          <Card>
            <FormAddTeacher
              handleSubmitForm={handleSubmitCourseForm}
              formErrorMsg={formErrorMsg}
              isSubmitting={isSubmitting}
              setFormErrorMsg={setFormErrorMsg}
            />
          </Card>
        </Col>
        <Col xs={24} sm={5} />
      </Row>

      <Spacer margin={'1rem auto'} />
    </>
  )
}

export default TeacherCreate
