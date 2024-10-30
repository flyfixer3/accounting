// @ts-nocheck
import { IBookData, IBookPurchaseFormData } from 'src/models/books.model'
import { Button, Col, Form, Input, Modal, Row } from 'antd'
import React, { useEffect } from 'react'
import useBookPurchaseController from '../controller/useBookPurchaseController'
import Spacer from 'src/components/view/Spacer'
import StudentAutocomplete from 'src/components/input/StudentAutocomplete/StudentAutocomplete'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import { IStudentSelect } from '@src/models/student.model'

interface IModalPurchaseBook {
  isVisible: boolean
  handleClose: () => void
  title?: string
  selectedData: IBookData
}

const ModalPurchaseBook: React.FC<IModalPurchaseBook> = ({
  isVisible,
  handleClose,
  title = 'Purchase Book',
  selectedData,
}) => {
  const { formErrorMsg, isSubmitted, setFormErrorMsg, onHandlePurchaseBook } =
    useBookPurchaseController()

  const [purchaseBookForm] = Form.useForm<IBookPurchaseFormData>()
  type FieldType = IBookPurchaseFormData

  const handleFinishForm = (e: IBookPurchaseFormData) => {
    onHandlePurchaseBook(e, handleClose)
  }

  const _handleSelectedExistingStudent = (e: IStudentSelect) => {
    const studentId: number = parseInt(e?.value)
    purchaseBookForm.setFieldsValue({ studentId })
  }

  useEffect(() => {
    if (selectedData && Object.keys(selectedData)) {
      purchaseBookForm.setFieldsValue({ bookId: selectedData?.id })
    } else {
      purchaseBookForm.resetFields()
    }
  }, [selectedData])

  return (
    <Modal
      open={isVisible}
      onCancel={handleClose}
      maskClosable={false}
      footer={null}
      title={title}>
      <Form
        name="purchaseBookForm"
        form={purchaseBookForm}
        initialValues={{
          studentId: '',
          bookId: '',
        }}
        onFinish={handleFinishForm}
        onValuesChange={() => setFormErrorMsg('')}
        layout="vertical"
        autoComplete="off"
        preserve={false}>
        <Form.Item<FieldType> name={'bookId'} style={{ display: 'none' }}>
          <Input />
        </Form.Item>

        <DetailRow
          title="Book Number"
          value={selectedData?.bookNumber || '-'}
        />

        <DetailRow title="Book Name" value={selectedData?.bookName || '-'} />

        <Row gutter={[8, 8]}>
          <Col xs={24} sm={24}>
            <Form.Item<FieldType>
              label="Search Student"
              name={'studentId'}
              rules={[
                {
                  required: true,
                  message: 'Please select student',
                },
              ]}>
              <StudentAutocomplete
                allowClear={true}
                handleSelectedData={_handleSelectedExistingStudent}
              />
            </Form.Item>
          </Col>

          {formErrorMsg ? (
            <>
              <Col xs={24}>
                <div className="font-error text-center">{formErrorMsg}</div>
              </Col>

              <Spacer margin={'4px auto'} />
            </>
          ) : null}

          <Col xs={24} sm={12}>
            <Form.Item>
              <Button type="primary" ghost block onClick={handleClose}>
                Cancel
              </Button>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item>
              <Button
                type="primary"
                block
                htmlType="submit"
                disabled={isSubmitted}>
                Purchase
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default ModalPurchaseBook
