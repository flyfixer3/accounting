// @ts-nocheck
import { useEffect } from 'react'
import useClassAddController from '../controller/useClassAddController'
import { Col, Row } from 'antd'
import Spacer from 'src/components/view/Spacer'
import Card from 'antd/es/card/Card'
import FormAddClass from '../components/FormAddClass'

import styles from '../Add/index.module.scss'
import useClassDetailController from '../controller/useClassDetailController'

const ClassEdit = () => {
  const { params, classDetailData } = useClassDetailController()
  const {
    handleSubmitCourseForm,
    formErrorMsg,
    isSubmitting,
    onSetBreadcrumbs,
    handleSetFormMessage,
  } = useClassAddController()

  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'Class',
        path: '/class',
      },
      {
        title: 'Edit Class',
        path: `/class/edit/${params?.id}`,
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
              <div className={styles?.addClassTitle}>
                Edit Class {params?.id}
              </div>
            </Col>
          </Row>

          <Spacer margin={'.5rem auto'} />

          <Card>
            <FormAddClass
              editedData={classDetailData}
              handleSubmitForm={handleSubmitCourseForm}
              isSubmitting={isSubmitting}
              formErrorMsg={formErrorMsg}
              handleSetFormMessage={handleSetFormMessage}
            />
          </Card>
        </Col>
        <Col xs={24} sm={5} />
      </Row>

      <Spacer margin={'1rem auto'} />
    </>
  )
}

export default ClassEdit
