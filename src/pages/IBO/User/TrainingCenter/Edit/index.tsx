// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { useEffect } from 'react'
import { Card, Col, Row } from 'antd'
import Spacer from 'src/components/view/Spacer'
import useTrainingCenterAddController from '../controller/useTrainingCenterAddController'
import FormAddTrainingCenter from '../components/FormAddTrainingCenter'
import useTrainingCenterUserController from '../controller/useTrainingCenterController'
import { useParams } from 'react-router-dom'

const TrainingCenterEdit = () => {
  const params = useParams()
  const { onSetBreadcrumbs } = useApp()

  const { onRefetchDetail, detailData } = useTrainingCenterUserController()

  const { isSubmitted, formErrorMsg, setFormErrorMsg, handleSubmitForm } =
    useTrainingCenterAddController()

  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'Training Center',
        path: '/user/training-center',
      },
      {
        title: 'Training Center Edit',
        path: `/user/training-center/edit/${params?.id}`,
      },
    ])
    onRefetchDetail(params?.id)
  }, [])
  return (
    <>
      <Row>
        <Col xs={24} sm={5} />
        <Col xs={24} sm={14}>
          <Row>
            <Col xs={24}>
              <div className={'add-section-title'}>
                Edit Training Center User
              </div>
            </Col>
          </Row>

          <Spacer margin={'.5rem auto'} />

          <Card>
            <FormAddTrainingCenter
              editedData={detailData}
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

export default TrainingCenterEdit
