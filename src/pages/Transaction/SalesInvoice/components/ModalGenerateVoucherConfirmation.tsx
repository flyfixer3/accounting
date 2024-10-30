// @ts-nocheck
import Spacer from 'src/components/view/Spacer'
import { Button, Col, Row } from 'antd'
import Modal from 'antd/es/modal/Modal'
import React from 'react'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import { IStudentDetailResponse } from 'src/models/student.model'

interface IModalGenerateVoucherConfirmationProps {
  isVisible: boolean
  handleClose: () => void
  onRefetchDetail: () => void
  studentData: IStudentDetailResponse
  onHandleSubmitGenerateVoucher: (
    e: IStudentDetailResponse,
    func: () => void,
  ) => void
  isSubmitted: boolean
  formErrorMsg: string | any
}

const ModalGenerateVoucherConfirmation: React.FC<
  IModalGenerateVoucherConfirmationProps
> = ({
  isVisible,
  handleClose,
  studentData,
  onHandleSubmitGenerateVoucher,
  isSubmitted,
  formErrorMsg,
}) => {
  return (
    <Modal
      open={isVisible}
      onCancel={handleClose}
      maskClosable={false}
      footer={null}
      title={'Generate Voucher Confirmation'}>
      <Row>
        <Col xs={24}>
          <div>
            This student is eligible. Would you like to generate voucher for
            this student?
          </div>
        </Col>
      </Row>

      <Spacer margin="1rem auto" />

      <DetailRow title={'Name'} value={studentData?.studentName} />

      <DetailRow title={'Email'} value={studentData?.studentEmail} />

      <Spacer margin="2rem auto" />

      {formErrorMsg ? (
        <>
          <Col xs={24}>
            <div className="font-error text-center">
              {formErrorMsg || formErrorMsg?.message}
            </div>
          </Col>

          <Spacer margin={'4px auto'} />
        </>
      ) : null}

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={12}>
          <Button type="primary" ghost block onClick={handleClose}>
            Cancel
          </Button>
        </Col>
        <Col xs={24} sm={12}>
          <Button
            type="primary"
            block
            onClick={() =>
              onHandleSubmitGenerateVoucher(studentData, handleClose)
            }>
            Generate Voucher
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default ModalGenerateVoucherConfirmation
