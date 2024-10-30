// @ts-nocheck
import { ISupplierDataCreateRequestPayload, ISupplierDataForm } from '@src/models/supplier.model'
import { Button, Card, Col, Flex, Form, Input, Row } from 'antd'
import { useEffect } from 'react'
import Spacer from 'src/components/view/Spacer'
import { useApp } from 'src/context/app.context'
import { validatePhoneNumber } from 'src/helpers/validator.helper'
import useSupplierAddController from '../controller/useSupplierAddController'

const SupplierAdd = () => {
    type FieldType = ISupplierDataForm

    const { onSetBreadcrumbs } = useApp()

    const {
        formErrorMsg,
        setFormErrorMsg,
        isSubmitted,
        onSubmitSupplierAdd
    } = useSupplierAddController()

    const [supplierDataForm] = Form.useForm<ISupplierDataForm>()

    const _handleFinishForm = (data: ISupplierDataForm) => {
        const payload: ISupplierDataCreateRequestPayload = {
            supplierName: data.supplierName,
            supplierAddress: data.supplierAddress,
            supplierPhoneNumber: data.supplierPhoneNumber,
            supplierEmail: data.supplierEmail,
            supplierPicName: data.supplierPicName,
            supplierPicPhoneNumber: data.supplierPicPhoneNumber
        }

        onSubmitSupplierAdd(payload)
    }

    useEffect(() => {
        onSetBreadcrumbs([
            { title: 'Suppliers', path: '/suppliers' },
            { title: 'Supplier Add', path: `/supplier/add` },
        ])
    }, [])

    return (
        <>
            <Row>
                <Col xs={24}>
                    <Card>
                        <Row gutter={[8, 8]}>
                            <Col xs={24} sm={16}>
                                <div className={'detail-title'}>Supplier Add</div>
                            </Col>
                        </Row>

                        <Spacer margin={'1rem'} />

                        <Form
                            name='supplierAddForm'
                            form={supplierDataForm}
                            labelCol={{ span: 10 }}
                            wrapperCol={{ span: 14 }}
                            layout='horizontal'
                            autoComplete='off'
                            style={{ maxWidth: 600 }}
                            labelAlign='left'
                            preserve={false}
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
                                        disabled={isSubmitted}
                                        loading={isSubmitted}
                                    >
                                        Create
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

export default SupplierAdd