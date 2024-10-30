// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { useEffect } from 'react'
import { Card, Col, Row } from 'antd'
import Spacer from 'src/components/view/Spacer'
import useTrainingCenterAddController from '../controller/useTrainingCenterAddController'
import FormAddTrainingCenter from '../components/FormAddTrainingCenter'

const TrainingCenterAdd = () => {
  const { onSetBreadcrumbs } = useApp()

  const { isSubmitted, formErrorMsg, setFormErrorMsg, handleSubmitForm } =
    useTrainingCenterAddController()

  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'Training Center',
        path: '/user/training-center',
      },
      {
        title: 'Training Center Add',
        path: '/user/training-center/add',
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
              <div className={'add-section-title'}>
                Add New Training Center User
              </div>
            </Col>
          </Row>

          <Spacer margin={'.5rem auto'} />

          <Card>
            <FormAddTrainingCenter
              handleSubmitForm={handleSubmitForm}
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

export default TrainingCenterAdd
