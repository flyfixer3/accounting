// @ts-nocheck
import { Col, Row } from 'antd'

import styles from '../Add/index.module.scss'
import Spacer from 'src/components/view/Spacer'
import Card from 'antd/es/card/Card'
import FormAddTeacher from '../components/FormAddTeacher'
import useTeacherAddController from '../controller/useTeacherAddController'
import { useEffect } from 'react'
import useTeacherDetailController from '../controller/useTeacherDetailController'

const TeacherEdit = () => {
  const { teacherDetailData } = useTeacherDetailController()
  const {
    onSetBreadcrumbs,
    params,
    handleSubmitCourseForm,
    formErrorMsg,
    isSubmitting,
    setFormErrorMsg,
  } = useTeacherAddController()

  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'Teacher',
        path: '/teacher',
      },
      {
        title: 'Edit Teacher',
        path: `/teacher/edit/${params?.id}`,
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
              <div className={styles?.addTeacherTitle}>Edit Teacher</div>
            </Col>
          </Row>

          <Spacer margin={'.5rem auto'} />

          <Card>
            <FormAddTeacher
              editedData={teacherDetailData}
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

export default TeacherEdit
