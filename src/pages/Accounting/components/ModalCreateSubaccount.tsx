import { useMutation } from '@tanstack/react-query'
import { Button, Form, Switch } from 'antd'
import Input from 'antd/es/input/Input'
import Modal from 'antd/es/modal/Modal'
import axios from 'axios'
import { useEffect } from 'react'
import Spacer from 'src/components/view/Spacer'
import { useApp } from 'src/context/app.context'
import { BASE_URL } from 'src/services/api.service'
import {
  AccountingAccount,
  AccountingSubaccount,
  AccountingSubaccountPayload,
} from '../types'

interface IModalCreateSubaccountProps {
  isVisible: boolean
  handleClose: () => void
  title: string
  account: AccountingAccount
  editedData: AccountingSubaccount | null
  onSuccess?: () => void
}

const ModalCreateSubaccount = ({
  isVisible,
  handleClose,
  title,
  onSuccess,
  editedData,
  account,
}: IModalCreateSubaccountProps) => {
  const { notify } = useApp()
  const { mutate, error, isPending } = useMutation({
    mutationFn: async (data: AccountingSubaccountPayload) => {
      await axios.post(`${BASE_URL}/accounting/subaccounts/upsert`, data)
    },
    onSuccess: () => {
      notify?.success({
        message: 'Subaccount has been saved',
      })
      handleClose()
      onSuccess?.()
    },
  })
  const [subaccountForm] = Form.useForm<AccountingSubaccountPayload>()

  type FieldType = AccountingSubaccountPayload

  useEffect(() => {
    if (!editedData) subaccountForm.resetFields()
    else {
      subaccountForm.setFieldsValue({
        subaccount_name: editedData?.subaccount_name,
        subaccount_number: editedData?.subaccount_number,
        description: editedData?.description,
        is_active: editedData?.is_active,
      })
    }
  }, [editedData])

  return (
    <>
      <Modal
        open={isVisible}
        onCancel={handleClose}
        title={title}
        maskClosable={false}
        closeIcon={true}
        footer={null}>
        <>
          <Form
            name="subaccountForm"
            form={subaccountForm}
            initialValues={{
              subaccount_name: '',
              subaccount_number: '',
              description: '',
              is_active: true,
            }}
            onFinish={(values) => {
              mutate({
                ...values,
                id: editedData?.id,
                accounting_account_id: account.id,
              })
            }}
            onValuesChange={() => {}}
            layout="vertical"
            autoComplete="off"
            preserve={false}>
            <Form.Item<FieldType>
              label="Subaccount Number"
              name={'subaccount_number'}
              rules={[
                {
                  required: true,
                  message: 'Please input Subaccount Number',
                },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Subaccount Name"
              name={'subaccount_name'}
              rules={[
                { required: true, message: 'Please input Subaccount Name' },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Description"
              name={'description'}
              rules={[
                {
                  required: true,
                  message: 'Please input Description',
                },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item<FieldType> label="Is Active?" name={'is_active'}>
              <Switch className="w-fit" />
            </Form.Item>

            {error?.message ? (
              <div className="font-error">{error?.message}</div>
            ) : null}
            <Spacer margin=".5rem" />

            <Form.Item>
              <Button
                type="primary"
                block
                htmlType="submit"
                disabled={isPending}
                loading={isPending}>
                Save
              </Button>
            </Form.Item>
          </Form>
        </>
      </Modal>
    </>
  )
}

export default ModalCreateSubaccount
