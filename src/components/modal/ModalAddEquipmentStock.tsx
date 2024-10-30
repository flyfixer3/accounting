// @ts-nocheck
import { Modal } from 'antd'
import React from 'react'

import useModalAddEquipmentStockController from './controller/useModalAddEquipmentStockController'
import { IBookStockFormData } from 'src/models/books.model'
import FormAddStudentEquipment from 'src/pages/IBO/Stock/StudentEquipment/components/FormAddStudentEquipment'
import { IStudentEquipmentStockFormData } from '@src/models/student-equipment.model'

interface IModalAddEquipmentStockProps {
  isVisible: boolean
  handleClose: (e?: boolean) => void
}

const ModalAddEquipmentStock: React.FC<IModalAddEquipmentStockProps> = ({
  isVisible,
  handleClose,
}) => {
  const {
    isSubmitted,
    formErrorMsg,
    setFormErrorMsg,
    handleSubmitStudentEquipmentStock,
  } = useModalAddEquipmentStockController()

  return (
    <Modal
      title={'Add New Equipment Stock'}
      open={isVisible}
      onCancel={() => handleClose()}
      centered
      footer={null}>
      <FormAddStudentEquipment
        handleSubmitForm={(e: IStudentEquipmentStockFormData) =>
          handleSubmitStudentEquipmentStock(e, false, handleClose)
        }
        formErrorMsg={formErrorMsg}
        setFormErrorMsg={setFormErrorMsg}
        isSubmitted={isSubmitted}
      />
    </Modal>
  )
}

export default ModalAddEquipmentStock
