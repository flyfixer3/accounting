// @ts-nocheck
import {
  IItemIdNamePair,
  ISupplierOrderCreateOrderDetailFormData,
} from 'src/models/supplier.model'
import { Alert, Button, Col, Form, Input, InputNumber } from 'antd'
import Modal from 'antd/es/modal/Modal'
import React, { useState } from 'react'
import {
  currencyInputFormatter,
  currencyInputParser,
} from 'src/helpers/formatter.helper'
import SelectActiveStatus from 'src/components/select/SelectActiveStatus'
import { ISelectData } from 'src/models/general.model'
import { COURSE_VOUCHER_BUNDLE, SUPPLIER_ORDER_TYPE } from 'src/enums/enums'
import Spacer from 'src/components/view/Spacer'
import BookStockAutocomplete from 'src/components/input/BookStockAutocomplete'
import EquipmentStockAutocomplete from 'src/components/input/EquipmentStockAutocomplete'
import CourseVoucherAutocomplete from 'src/components/input/CourseVoucherAutocomplete'

interface IModalProps {
  isVisible: boolean
  handleClose: () => void
  onSetOrderDetailList: (e: ISupplierOrderCreateOrderDetailFormData) => void
}

const ModalAddOrderDetail: React.FC<IModalProps> = ({
  isVisible,
  handleClose,
  onSetOrderDetailList,
}) => {
  type FieldType = ISupplierOrderCreateOrderDetailFormData

  const itemTypeOptions: ISelectData[] = [
    { value: SUPPLIER_ORDER_TYPE?.book, label: 'Book' },
    {
      value: SUPPLIER_ORDER_TYPE?.equipment,
      label: 'Equipment',
    },
    {
      value: SUPPLIER_ORDER_TYPE?.courseVoucher,
      label: 'Course Voucher',
    },
  ]

  const [addOrderDetailForm] =
    Form.useForm<ISupplierOrderCreateOrderDetailFormData>()

  const [errorMessage, setErrorMessage] = useState<string>('')
  const [itemType, setItemType] = useState<string>('')
  const itemTypeValue = Form.useWatch('itemType', addOrderDetailForm)

  const _handleFinishForm = (e: ISupplierOrderCreateOrderDetailFormData) => {
    if (e.itemIdNamePair == null) {
      setErrorMessage('Item is required')
      return
    }
    onSetOrderDetailList(e)
  }

  const _handleChangeItemType = (value: string) => {
    setErrorMessage('')

    addOrderDetailForm.setFieldsValue({
      itemType: value,
    })

    setItemType(value)

    // Reset other field
    addOrderDetailForm.setFieldsValue({
      itemIdNamePair: null,
      price: '0',
      qty: 0,
    })
  }

  const _handleSelectExistingData = (e: ISelectData) => {
    setErrorMessage('')

    const itemId: number = e?.value as number
    const itemName: string = e.label

    const itemIdNamePair: IItemIdNamePair = {
      itemId,
      itemName,
    }

    addOrderDetailForm.setFieldsValue({ itemIdNamePair })
  }

  const searchAutocompleteView = () => {
    if (!itemType) {
      return (
        <Form.Item<FieldType>
          label="Item Name"
          name={'itemIdNamePair'}
          rules={[
            {
              required: true,
              message: 'Please input Item Name',
            },
          ]}>
          <Input disabled={!itemType} />
        </Form.Item>
      )
    }

    if (itemType === SUPPLIER_ORDER_TYPE.book) {
      return (
        <Form.Item label="Item Name" name={'itemIdNamePair'}>
          <BookStockAutocomplete
            disabled={!itemType}
            allowClear={true}
            handleSelectedData={_handleSelectExistingData}
            withAdd
          />
        </Form.Item>
      )
    }

    if (itemType === SUPPLIER_ORDER_TYPE.equipment) {
      return (
        <Form.Item label="Item Name" name={'itemIdNamePair'}>
          <EquipmentStockAutocomplete
            disabled={!itemType}
            allowClear={true}
            handleSelectedData={_handleSelectExistingData}
            withAdd
          />
        </Form.Item>
      )
    }

    if (itemType === SUPPLIER_ORDER_TYPE?.courseVoucher) {
      return (
        <Form.Item label="Item Name" name={'itemIdNamePair'}>
          <CourseVoucherAutocomplete
            disabled={!itemType}
            allowClear={true}
            handleSelectedData={_handleSelectExistingData}
          />
        </Form.Item>
      )
    }
  }

  const errorMessageView = () => {
    return (
      <>
        <Col xs={24}>
          <div className="font-error text-center">{errorMessage}</div>
        </Col>

        <Spacer margin={'4px auto'} />
      </>
    )
  }

  return (
    <Modal
      open={isVisible}
      onCancel={handleClose}
      footer={null}
      title={'Add Order Detail'}
      centered>
      <Form
        name="addOrderDetailForm"
        form={addOrderDetailForm}
        initialValues={{
          itemName: '',
          itemType: '',
          price: '0',
          qty: 0,
        }}
        onFinish={_handleFinishForm}
        onValuesChange={() => {
          setErrorMessage('')
        }}
        layout="vertical"
        autoComplete="off"
        preserve={false}>
        <Form.Item<FieldType>
          label="Item Type"
          name={'itemType'}
          rules={[
            {
              required: true,
              message: 'Please input Item Type',
            },
          ]}>
          <SelectActiveStatus
            handleChange={_handleChangeItemType}
            value={itemTypeValue}
            list={itemTypeOptions}
          />
        </Form.Item>
        {searchAutocompleteView()}
        {itemTypeValue === SUPPLIER_ORDER_TYPE?.courseVoucher ? (
          <>
            <Alert
              showIcon
              type={'info'}
              message={
                <div className="text-normal">
                  Each bundle of Course Vouchers contains{' '}
                  {COURSE_VOUCHER_BUNDLE?.quantity} vouchers. Please note that
                  the quantity specified refers to one bundle, which includes{' '}
                  {COURSE_VOUCHER_BUNDLE?.quantity} course vouchers.
                </div>
              }
            />
            <Spacer margin=".5rem auto" />
          </>
        ) : null}
        <Form.Item<FieldType>
          label="Item Quantity"
          name={'qty'}
          rules={[
            {
              required: true,
              message: 'Item quantity must be filled',
            },
          ]}>
          <InputNumber
            disabled={!itemType}
            width={'100%'}
            min={0}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item<FieldType>
          label="Order Price"
          name={'price'}
          rules={[
            {
              required: true,
              message: 'Please input Item Price',
            },
          ]}>
          <InputNumber
            disabled={!itemType}
            formatter={(value: string) => currencyInputFormatter(value, 'Rp')}
            parser={(value: string) => currencyInputParser(value, 'Rp')}
            style={{ width: '100%' }}
            precision={2}
          />
        </Form.Item>
        {errorMessage ? errorMessageView() : null}
        <Form.Item>
          <Button disabled={!itemType} type="primary" block htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalAddOrderDetail
