// @ts-nocheck
import { validatePhoneNumber } from "src/helpers/validator.helper"
import { Button, Card, Col, Flex, Form, Input, Row } from "antd"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import Spacer from "src/components/view/Spacer"
import { useApp } from "src/context/app.context"
import { ISupplierDataCreateRequestPayload, ISupplierDataForm, ISupplierOrderCreateFormData } from "src/models/supplier.model"
import useSupplierEditController from "../controller/useSupplierEditController"


const SupplierEdit = () => {
    type FieldType = ISupplierDataForm

    const params = useParams()
    const { onSetBreadcrumbs } = useApp()

    const {
        detail,
        formErrorMsg,
        setFormErrorMsg,
        isLoading,
        onFetchDetail,
        onSubmitUpdateDetail
    } = useSupplierEditController()

    const [supplierDataForm] = Form.useForm<ISupplierDataForm>()

    const _handleFinishForm = (data: ISupplierDataForm) => {
        const payload: ISupplierDataCreateRequestPayload = {
            supplierName: data.supplierName,
            supplierAddress: data.supplierAddress,
            supplierEmail: data.supplierEmail,
            supplierPhoneNumber: data.supplierPhoneNumber,
            supplierPicName: data.supplierPicName,
            supplierPicPhoneNumber: data.supplierPicPhoneNumber
        }

        if (params && params.supplierId) {
            onSubmitUpdateDetail(parseInt(params.supplierId), payload)
        }
    }

    useEffect(() => {
        onSetBreadcrumbs([
            { title: 'Suppliers', path: '/suppliers' },
            { title: 'Supplier Detail', path: `/supplier/detail/${params?.supplierId}` },
            { title: 'Supplier Edit', path: `/supplier/edit/${params?.supplierId}` },
        ])

        onFetchDetail(parseInt(params?.supplierId))
    }, [])

    useEffect(() => {
        if (detail) {
            supplierDataForm.setFieldsValue({
                supplierName: detail.supplierName,
                supplierAddress: detail.supplierAddress,
                supplierEmail: detail.supplierEmail,
                supplierPhoneNumber: detail.supplierPhoneNumber,
                supplierPicName: detail.supplierPicName,
                supplierPicPhoneNumber: detail.supplierPicPhoneNumber
            })
        }
    }, [detail])

    return (
        <>
            <Row>
                <Col xs={24}>
                    <Card>
                        <Row gutter={[8, 8]}>
                            <Col xs={24} sm={16}>
                                <div className={'detail-title'}>Supplier Edit</div>
                            </Col>
                        </Row>

                        <Spacer margin={'1rem'} />

                        <Form
                            name='supplierEditForm'
                            form={supplierDataForm}
                            labelCol={{ span: 10 }}
                            wrapperCol={{ span: 14 }}
                            layout='horizontal'
                            autoComplete='off'
                            style={{ maxWidth: 600 }}
                            labelAlign='left'
                            preserve={false}
                            disabled={isLoading}
                            onValuesChange={() => setFormErrorMsg('')}
                            onFinish={_handleFinishForm}
                        >
                            <Form.Item<FieldType>
                                label='Supplier Name'
                                name={'supplierName'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input Supplier Name'
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label='Supplier Address'
                                name={'supplierAddress'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input Supplier Address'
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label='Supplier Phone Number'
                                name={'supplierPhoneNumber'}
                                rules={[validatePhoneNumber]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label='Supplier Email'
                                name={'supplierEmail'}
                                rules={[
                                    {
                                        type: 'email',
                                        message: 'Please input a valid email',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label='Supplier PIC Name'
                                name={'supplierPicName'}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label='Supplier PIC Phone Number'
                                name={'supplierPicPhoneNumber'}
                                rules={[validatePhoneNumber]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 14, span: 10 }}>
                                <Flex justify='end'>
                                    <div className="font-error text-center">{formErrorMsg}</div>
                                </Flex>
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 14, span: 10 }}>
                                <Flex justify='end'>
                                    <Button 
                                        type='primary' 
                                        htmlType='submit'
                                        disabled={isLoading}
                                        loading={isLoading}
                                    >
                                        Save
                                    </Button>
                                </Flex>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>

            <Spacer margin="1rem auto" />
        </>
    )
}

export default SupplierEdit