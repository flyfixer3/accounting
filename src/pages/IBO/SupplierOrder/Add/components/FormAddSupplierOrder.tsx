// @ts-nocheck
import { Button, Col, DatePicker, DatePickerProps, Flex, Form, Row } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { appColors } from 'src/assets/styles/styles'
import SupplierNameAutocomplete from 'src/components/input/SupplierNameAutocomplete'
import SelectActiveStatus from 'src/components/select/SelectActiveStatus'
import Table from 'src/components/table/Table'
import Spacer from 'src/components/view/Spacer'
import { STATUS_ENUM, SUPPLIER_ORDER_TYPE } from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import { ISelectData } from 'src/models/general.model'
import {
  ISupplierOrderCreateFormData,
  ISupplierOrderCreateOrderDetailFormData,
} from 'src/models/supplier.model'
import SubaccountSelect from 'src/pages/Accounting/components/SubaccountSelect'
import useSupplierOrderAddController from '../../controller/useSupplierOrderAddController'
import ModalAddOrderDetail from './ModalAddOrderDetail'

const FormAddSupplierOrder = () => {
  const {
    orderDetailList,
    isLoading,
    statusListOptions,
    isModalAddOrderDetailVisibile,
    isSubmitted,
    formErrorMsg,
    setFormErrorMsg,
    handleSubmitOrderAdd,
    onSetOrderDetailList,
    handleModalAddOrderDetailVisibility,
    onRemoveOrderDetail,
  } = useSupplierOrderAddController()

  const TABLE_COLUMNS: ColumnsType<ISupplierOrderCreateOrderDetailFormData> = [
    {
      title: 'Item Name',
      // dataIndex: 'itemName',
      // key: 'itemName',
      render: (data, record) => record.itemIdNamePair.itemName || '-',
      width: 250,
    },
    {
      title: 'Item Type',
      dataIndex: 'itemType',
      key: 'itemType',
      render: (data) => {
        const text =
          data === SUPPLIER_ORDER_TYPE?.book
            ? 'Book'
            : data === SUPPLIER_ORDER_TYPE?.courseVoucher
              ? 'Course Voucher'
              : data === SUPPLIER_ORDER_TYPE?.equipment
                ? 'Equipment'
                : '-'
        return text
      },
      width: 250,
    },
    {
      title: 'Item Price',
      dataIndex: 'price',
      key: 'price',
      render: (text, record, index) => {
        return `${moneyFormatter(text)}` || `Rp 0`
      },
    },
    {
      title: 'Item Quantity',
      dataIndex: 'qty',
      key: 'qty',
      align: 'center',
      render: (data) => parseInt(data || 0),
      width: 250,
    },
    {
      title: 'Action',
      align: 'center',
      render: (data) => (
        <div
          className="clickable-wrapper"
          onClick={() => onRemoveOrderDetail(data?.id)}>
          <FiTrash2 size={16} color={appColors?.red50} />
        </div>
      ),
      width: 250,
    },
  ]

  const [addSupplierOrderForm] = Form.useForm<ISupplierOrderCreateFormData>()
  type FieldType = ISupplierOrderCreateFormData

  const statusValue = Form.useWatch('paymentStatus', addSupplierOrderForm)
  const paymentMethodIdValue = Form.useWatch(
    'subaccountId',
    addSupplierOrderForm,
  )

  const _handleFinishForm = (e: ISupplierOrderCreateFormData) => {
    handleSubmitOrderAdd(e)
  }

  const _handleChangeOrderDate: DatePickerProps['onChange'] = (date) => {
    addSupplierOrderForm.setFieldsValue({ orderDate: date })
  }

  const _handleChangePaymentStatus = (value: string) => {
    addSupplierOrderForm.setFieldsValue({
      paymentStatus: value,
    })
  }

  const _handleSelectExistingData = (e: ISelectData) => {
    const supplierId: number = e?.value as number
    addSupplierOrderForm.setFieldsValue({ supplierId })
  }

  const handlePaymentMethodChange = (value: number, obj: any) => {
    addSupplierOrderForm.setFieldsValue({
      subaccountId: value,
    })
  }

  useEffect(() => {
    if (orderDetailList?.length > 0) {
      addSupplierOrderForm?.setFieldsValue({ orderDetailList })
    }
  }, [orderDetailList])

  return (
    <>
      <Form
        name="addSupplierOrderForm"
        form={addSupplierOrderForm}
        initialValues={{
          supplierName: '',
          orderDate: '',
          paymentStatus: '',
          paymentMethodId: '',
          subaccountId: '',
          orderDetailList: [],
        }}
        onFinish={_handleFinishForm}
        onValuesChange={() => {
          setFormErrorMsg('')
        }}
        layout="vertical"
        autoComplete="off"
        preserve={false}>
        <Form.Item label="Supplier" name={'supplierId'}>
          <SupplierNameAutocomplete
            allowClear={true}
            handleSelectedData={_handleSelectExistingData}
            withAdd
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="Order Date"
          name={'orderDate'}
          rules={[
            {
              required: true,
              message: 'Please input Order Date',
            },
          ]}>
          <DatePicker
            style={{ width: '100%' }}
            format={'YYYY-MM-DD'}
            onChange={_handleChangeOrderDate}
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="Payment Status"
          name={'paymentStatus'}
          rules={[
            {
              required: true,
              message: 'Please input Payment Status',
            },
          ]}>
          <SelectActiveStatus
            handleChange={_handleChangePaymentStatus}
            value={statusValue}
            list={statusListOptions}
          />
        </Form.Item>

        {statusValue === STATUS_ENUM?.paid ? (
          <>
            <Form.Item<FieldType>
              label="Payment Method"
              name={'subaccountId'}
              rules={[
                {
                  required: true,
                  message: 'Please input Payment Method for paid payment',
                },
              ]}>
              <SubaccountSelect
                filterCategoryNumber="3"
                onChange={handlePaymentMethodChange}
                value={paymentMethodIdValue}
              />
            </Form.Item>
          </>
        ) : null}

        <Row align={'middle'}>
          <Col xs={24} sm={12}>
            <div>Order Detail</div>
          </Col>
          <Col xs={24} sm={12}>
            <Flex justify="flex-end">
              <Button
                type="primary"
                onClick={handleModalAddOrderDetailVisibility}>
                Add Order Detail
              </Button>
            </Flex>
          </Col>
        </Row>

        <Spacer margin="1rem auto" />

        <Form.Item<FieldType> name={'orderDetailList'}>
          <Table
            loading={isLoading}
            columns={TABLE_COLUMNS}
            data={orderDetailList}
            pagination={null}
            rowKey={(data: ISupplierOrderCreateOrderDetailFormData) => data?.id}
            identifier={'id'}
            isAction
          />
        </Form.Item>

        {formErrorMsg ? (
          <Row>
            <Col xs={24}>
              <div className="font-error text-center">{formErrorMsg}</div>
            </Col>

            <Spacer margin={'4px auto'} />
          </Row>
        ) : null}

        <Button
          type="primary"
          htmlType="submit"
          block
          disabled={isSubmitted}
          loading={isSubmitted}>
          Save
        </Button>
      </Form>

      {isModalAddOrderDetailVisibile ? (
        <ModalAddOrderDetail
          isVisible={isModalAddOrderDetailVisibile}
          handleClose={handleModalAddOrderDetailVisibility}
          onSetOrderDetailList={onSetOrderDetailList}
        />
      ) : null}
    </>
  )
}

export default FormAddSupplierOrder
