// @ts-nocheck
import FormAddBooks from 'src/pages/IBO/Stock/Book/components/FormAddBooks'
import { Modal } from 'antd'
import React from 'react'
import useBookStockAddController from 'src/pages/IBO/Stock/Book/controller/useBookStockAddController'
import useModalAddBookStockController from './controller/useModalAddBookStockController'
import { IBookStockFormData } from '@src/models/books.model'

interface IModalAddBookStockProps {
  isVisible: boolean
  handleClose: (e?: boolean) => void
}

const ModalAddBookStock: React.FC<IModalAddBookStockProps> = ({
  isVisible,
  handleClose,
}) => {
  const { isSubmitted, formErrorMsg, setFormErrorMsg, handleSubmitBookStock } =
    useModalAddBookStockController()

  return (
    <Modal
      title={'Add New Book Stock'}
      open={isVisible}
      onCancel={() => handleClose()}
      centered
      footer={null}>
      <FormAddBooks
        handleSubmitForm={(e: IBookStockFormData) =>
          handleSubmitBookStock(e, false, handleClose)
        }
        formErrorMsg={formErrorMsg}
        setFormErrorMsg={setFormErrorMsg}
        isSubmitted={isSubmitted}
      />
    </Modal>
  )
}

export default ModalAddBookStock
