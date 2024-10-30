// @ts-nocheck
import { Card, Col, Row } from 'antd'
import { useEffect } from 'react'
import Spacer from 'src/components/view/Spacer'
import styles from './index.module.scss'

import { useParams } from 'react-router-dom'
import { useApp } from 'src/context/app.context'
import FormAddStudentEquipment from '../components/FormAddStudentEquipment'
import useStudentEquipmentStockAddController from '../controller/useStudentEquipmentStockAddController'
import useStudentEquipmentStockDetailController from '../controller/useStudentEquipmentStockDetailController'

const StudentEquipmentStockEdit = () => {
  const params = useParams()
  const { onSetBreadcrumbs } = useApp()

  const { detailData } = useStudentEquipmentStockDetailController()

  const {
    isSubmitted,
    formErrorMsg,
    setFormErrorMsg,
    handleSubmitStudentEquipmentStock,
  } = useStudentEquipmentStockAddController()

  useEffect(() => {
    onSetBreadcrumbs([
      { title: 'Student Equipment Stocks', path: '/stock/student-equipment' },
      {
        title: 'Edit Student Equipment Stock',
        path: `/stock/student-equipment/edit/${params?.id}`,
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
              <div className={styles?.editStudentEquipmentTitle}>
                Edit Student Equipment
              </div>
            </Col>
          </Row>

          <Spacer margin={'.5rem auto'} />

          <Card>
            <FormAddStudentEquipment
              editedData={detailData}
              handleSubmitForm={handleSubmitStudentEquipmentStock}
              formErrorMsg={formErrorMsg}
              setFormErrorMsg={setFormErrorMsg}
              isSubmitted={isSubmitted}
            />
          </Card>
        </Col>
        <Col xs={24} sm={5} />
      </Row>

      <Spacer margin={'1rem auto'} />
    </>
  )
}

export default StudentEquipmentStockEdit
