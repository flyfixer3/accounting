// @ts-nocheck
import { Col, Row, Steps } from 'antd'
import styles from '../Add/index.module.scss'

import { useStudentRegistrationContext } from '../context/student-registration.context'
const FormHeader = () => {
  const { formStep } = useStudentRegistrationContext()

  return (
    <>
      <Row gutter={[8, 16]}>
        <Col xs={24}>
          <div className={styles?.addStudentRegistrationTitle}>
            Add New Student Registration
          </div>
        </Col>
        <Col xs={24}>
          <Steps
            size="small"
            current={formStep?.step}
            status={formStep?.status}
            items={[
              {
                title: 'Student Form',
              },
              {
                title: 'Parent Form',
              },
              {
                title: 'Course Form',
              },
              {
                title: 'Class Form',
              },
              {
                title: 'Review Form',
              },
            ]}
          />
        </Col>
      </Row>
    </>
  )
}

export default FormHeader
