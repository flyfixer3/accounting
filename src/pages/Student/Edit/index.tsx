// @ts-nocheck
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from 'src/context/app.context'
import useStudentEditController from '../controller/useStudentEditController'
import { Card, Col, Row } from 'antd'

import styles from './index.module.scss'
import Spacer from 'src/components/view/Spacer'
import FormStudent from '../components/FormStudent'

const StudentEdit = () => {
  const params = useParams()

  const { onSetBreadcrumbs } = useApp()
  const {
    detailData,
    isSubmitted,
    isLoading,
    formErrorMsg,
    setFormErrorMsg,
    onHandleSubmitForm,
  } = useStudentEditController()

  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'Edit Student',
        path: `/student/edit/${params.id}`,
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
              <div className={styles?.formStudentTitle}>Edit Student</div>
            </Col>
          </Row>

          <Spacer margin={'.5rem auto'} />

          <Card>
            <FormStudent
              detailData={detailData}
              handleSubmitForm={onHandleSubmitForm}
              formErrorMsg={formErrorMsg}
              isSubmitted={isSubmitted}
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

export default StudentEdit
