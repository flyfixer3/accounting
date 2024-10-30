// @ts-nocheck
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import {
  ISalesInvoicePaymentFormData,
  ISalesInvoiceSelectedData,
} from 'src/models/invoice.model'

import Modal from 'antd/es/modal/Modal'
import React, { useState } from 'react'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import {
  PAYMENT_METHOD_TYPE_ENUM,
  SALES_INVOICE_DETAIL_TYPE,
} from 'src/enums/enums'
import SelectPaymentMethod from 'src/components/select/SelectPaymentMethod/SelectPaymentMethod'
import { Button, Col, Form, Row } from 'antd'
import useSalesInvoicePaymentController from '../controller/useSalesInvoicePaymentController'
import Spacer from 'src/components/view/Spacer'
import SelectDiscountVoucher from 'src/components/select/SelectDiscountVoucher/SelectDiscountVoucher'
import { IDiscountVoucherData } from 'src/models/discount-voucher.model'
import { IPaymentMethod } from 'src/models/payment-method.model'
import SelectBank from 'src/components/select/SelectBank/SelectBank'

interface IModalPaymentProps {
  isVisible: boolean
  handleClose: () => void
  selectedData: ISalesInvoiceSelectedData
  onRefetchDetail: () => void
  onHandleModalGenerateVoucherVisibility: () => void
}

const ModalPayment: React.FC<IModalPaymentProps> = ({
  isVisible,
  handleClose,
  selectedData,
  onRefetchDetail,
  onHandleModalGenerateVoucherVisibility,
}) => {
  const {
    isSubmitted,
    formErrorMsg,
    totalDiscountedPrice,
    discountValue,
    onHandleSubmitPayment,
    onHandleCalculateDiscountVoucher,
    onClearDiscountCalculationData,
  } = useSalesInvoicePaymentController()

  const [selectedDiscountVoucherObj, setSelectedDiscountVoucherObj] =
    useState<IDiscountVoucherData>(null)
  const [selectedPaymentObj, setSelectedPaymentObj] =
    useState<IPaymentMethod>(null)

  const title =
    SALES_INVOICE_DETAIL_TYPE.book === selectedData.invoiceDetailType
      ? 'Book Invoice'
      : SALES_INVOICE_DETAIL_TYPE.equipment === selectedData.invoiceDetailType
        ? 'Equipment Invoice'
        : SALES_INVOICE_DETAIL_TYPE.monthlyFee ===
            selectedData.invoiceDetailType
          ? 'Monthly Fee Invoice'
          : SALES_INVOICE_DETAIL_TYPE.registration ===
              selectedData.invoiceDetailType
            ? 'Registration Invoice'
            : '-'

  const [salesInvoicePaymentForm] = Form.useForm<ISalesInvoicePaymentFormData>()
  type FieldType = ISalesInvoicePaymentFormData

  const paymentMethodIdValue = Form.useWatch(
    'paymentMethodId',
    salesInvoicePaymentForm,
  )

  const bankIdValue = Form.useWatch('bankId', salesInvoicePaymentForm)

  const discountVoucherIdValue = Form.useWatch(
    'discountVoucherId',
    salesInvoicePaymentForm,
  )

  const handleFinishForm = (e: ISalesInvoicePaymentFormData) => {
    onHandleSubmitPayment(
      e.paymentMethodId,
      selectedData,
      handleClose,
      onRefetchDetail,
      onHandleModalGenerateVoucherVisibility,
      selectedDiscountVoucherObj?.voucherCode || null,
      e?.bankId || null,
    )
  }

  const handlePaymentMethodChange = (value: number, obj: any) => {
    setSelectedPaymentObj(obj)
    salesInvoicePaymentForm.setFieldsValue({
      paymentMethodId: value,
    })
  }

  const handleBankChange = (value: number, obj: any) => {
    salesInvoicePaymentForm.setFieldsValue({
      bankId: value,
    })
  }

  const handleDiscountVoucherChange = (
    value: number,
    obj: IDiscountVoucherData,
  ) => {
    setSelectedDiscountVoucherObj(obj)
    if (obj?.voucherCode) {
      onHandleCalculateDiscountVoucher(
        obj?.voucherCode,
        selectedData?.invoiceDetailId,
      )
    } else onClearDiscountCalculationData()

    salesInvoicePaymentForm.setFieldsValue({
      discountVoucherId: value,
    })
  }

  const isValidate = () => {
    const data = salesInvoicePaymentForm.getFieldsValue(true)

    const conditions = [!!data.paymentMethodId]

    if (conditions.includes(false)) {
      return false
    }
    return true
  }

  return (
    <Modal
      open={isVisible}
      onCancel={handleClose}
      maskClosable={false}
      footer={null}
      title={title}>
      <DetailRow title={'Name'} value={selectedData?.name} />

      <DetailRow
        title={'Total Price'}
        value={`${moneyFormatter(parseFloat(selectedData?.totalPrice))}`}
      />

      {totalDiscountedPrice &&
      selectedData?.invoiceDetailType ===
        SALES_INVOICE_DETAIL_TYPE.monthlyFee ? (
        <>
          <DetailRow
            title={'Discount'}
            value={`${moneyFormatter(parseFloat(discountValue))}`}
          />
          <DetailRow
            title={'Total Price After Discount'}
            value={`${moneyFormatter(parseFloat(totalDiscountedPrice))}`}
          />
        </>
      ) : null}

      <Form
        name="salesInvoicePaymentForm"
        form={salesInvoicePaymentForm}
        initialValues={{
          paymentMethodId: '',
          discountVoucherId: '',
        }}
        onFinish={handleFinishForm}
        layout="vertical"
        autoComplete="off"
        preserve={false}>
        <Row>
          <Col xs={24} sm={24}>
            <Form.Item<FieldType>
              label="Payment Method"
              name={'paymentMethodId'}
              rules={[
                {
                  required: true,
                  message: 'Please input Payment Method for payment',
                },
              ]}>
              <SelectPaymentMethod
                handleChange={handlePaymentMethodChange}
                value={paymentMethodIdValue}
              />
            </Form.Item>
          </Col>

          {selectedPaymentObj?.paymentType?.paymentTypeName ===
          PAYMENT_METHOD_TYPE_ENUM?.cashless ? (
            <Col xs={24} sm={24}>
              <Form.Item<FieldType>
                label="Bank"
                name={'bankId'}
                rules={[
                  {
                    required: true,
                    message: 'Please input Bank for cashless payment',
                  },
                ]}>
                <SelectBank
                  handleChange={handleBankChange}
                  value={bankIdValue}
                />
              </Form.Item>
            </Col>
          ) : null}

          {selectedData?.invoiceDetailType ===
          SALES_INVOICE_DETAIL_TYPE.monthlyFee ? (
            <Col xs={24}>
              <Form.Item<FieldType>
                label="Discount Voucher"
                name={'discountVoucherId'}>
                <SelectDiscountVoucher
                  handleChange={handleDiscountVoucherChange}
                  value={discountVoucherIdValue}
                  studentId={selectedData?.studentId}
                  allowClear
                />
              </Form.Item>
            </Col>
          ) : null}

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

          <Col xs={24}>
            <Form.Item>
              <Button
                type="primary"
                block
                htmlType="submit"
                disabled={!isValidate() || isSubmitted}>
                Pay
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default ModalPayment
