import { useMutation } from '@tanstack/react-query'
import { Button, Form, Switch } from 'antd'
import Input from 'antd/es/input/Input'
import Modal from 'antd/es/modal/Modal'
import axios from 'axios'
import { useEffect } from 'react'
import Spacer from 'src/components/view/Spacer'
import { useApp } from 'src/context/app.context'
import useToastError from 'src/hooks/useToastError'
import { BASE_URL } from 'src/services/api.service'
import { AccountingAccount, AccountingAccountPayload } from '../types'

interface IModalCreateAccountProps {
  isVisible: boolean
  handleClose: () => void
  title: string
  editedData: AccountingAccount | null
  onSuccess?: () => void
}

const ModalCreateAccount = ({
  isVisible,
  handleClose,
  title,
  editedData,
  onSuccess,
}: IModalCreateAccountProps) => {
  const { notify } = useApp()
  const { mutate, error, isPending } = useMutation({
    mutationFn: async (data: AccountingAccountPayload) => {
      await axios.post(`${BASE_URL}/accounting/accounts/upsert`, data)
    },
    onSuccess: () => {
      notify?.success({
        message: 'Account has been saved',
      })
      handleClose()
      onSuccess?.()
    },
  })
  useToastError(error, 'Failed to save account')

  const [accountForm] = Form.useForm<AccountingAccountPayload>()

  type FieldType = AccountingAccountPayload

  useEffect(() => {
    if (!editedData) accountForm.resetFields()
    else {
      accountForm.setFieldsValue({
        account_name: editedData?.account_name,
        account_number: editedData?.account_number,
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
            name="accountForm"
            form={accountForm}
            initialValues={{
              account_name: '',
              account_number: '',
              description: '',
              is_active: true,
            }}
            onFinish={(values) => {
              mutate({ ...values, id: editedData?.id })
            }}
            onValuesChange={() => {}}
            layout="vertical"
            autoComplete="off"
            preserve={false}>
            <Form.Item<FieldType>
              label="Account Number"
              name={'account_number'}
              rules={[
                {
                  required: true,
                  message: 'Please input Account Number',
                },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Account Name"
              name={'account_name'}
              rules={[
                { required: true, message: 'Please input Account Name' },
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

export default ModalCreateAccount
