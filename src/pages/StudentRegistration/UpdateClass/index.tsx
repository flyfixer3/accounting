// @ts-nocheck
import Spacer from 'src/components/view/Spacer'
import { Card, Col, Row } from 'antd'
import { useApp } from 'src/context/app.context'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import FormUpdateClass from '../components/FormUpdateClass'

const StudentRegistrationUpdateClass = () => {
  const { onSetBreadcrumbs } = useApp()
  const params = useParams()

  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'Student Registration',
        path: '/student-registration',
      },
      {
        title: 'Student Registration Detail',
        path: `/student-registration/${params.id}`,
      },
      {
        title: 'Change Class',
        path: `/student-registration/${params.id}/change-class`,
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
              <div className={'add-section-title'}>Change Class</div>
            </Col>
          </Row>

          <Spacer margin={'.5rem auto'} />

          <Card>
            <FormUpdateClass />
          </Card>
        </Col>
        <Col xs={24} sm={5} />
      </Row>

      <Spacer margin={'1rem auto'} />
    </>
  )
}

export default StudentRegistrationUpdateClass
