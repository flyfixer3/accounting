// @ts-nocheck
import { useEffect } from 'react'
import { Card, Col, Row } from 'antd'
import Spacer from 'src/components/view/Spacer'
import styles from './index.module.scss'
import { useApp } from 'src/context/app.context'
import useStudentEquipmentStockAddController from '../controller/useStudentEquipmentStockAddController'
import FormAddStudentEquipment from '../components/FormAddStudentEquipment'

const StudentEquipmentStockAdd = () => {
  const { onSetBreadcrumbs } = useApp()

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
        title: 'Add Student Equipment Stock',
        path: '/stock/student-equipment/add',
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
              <div className={styles?.addStudentEquipmentTitle}>
                Add New Equipment
              </div>
            </Col>
          </Row>

          <Spacer margin={'.5rem auto'} />

          <Card>
            <FormAddStudentEquipment
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

export default StudentEquipmentStockAdd
