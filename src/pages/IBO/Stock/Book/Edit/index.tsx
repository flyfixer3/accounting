// @ts-nocheck
import { useEffect } from 'react'
import { Card, Col, Row } from 'antd'
import Spacer from 'src/components/view/Spacer'
import styles from './index.module.scss'
import FormAddBooks from '../components/FormAddBooks'
import { useApp } from 'src/context/app.context'
import useBookStockAddController from '../controller/useBookStockAddController'
import { useParams } from 'react-router-dom'
import useBookStockDetailController from '../controller/useBookStockDetailController'

const BookStockEdit = () => {
  const params = useParams()
  const { onSetBreadcrumbs } = useApp()

  const { detailData } = useBookStockDetailController()

  const { isSubmitted, formErrorMsg, setFormErrorMsg, handleSubmitBookStock } =
    useBookStockAddController()

  useEffect(() => {
    onSetBreadcrumbs([
      { title: 'Book Stocks', path: '/stock/books' },
      { title: 'Edit Book Stock', path: `/stock/books/edit/${params?.id}` },
    ])
  }, [])
  return (
    <>
      <Row>
        <Col xs={24} sm={5} />
        <Col xs={24} sm={14}>
          <Row>
            <Col xs={24}>
              <div className={styles?.editBooksTitle}>Edit Book</div>
            </Col>
          </Row>

          <Spacer margin={'.5rem auto'} />

          <Card>
            <FormAddBooks
              editedData={detailData}
              handleSubmitForm={handleSubmitBookStock}
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

export default BookStockEdit
