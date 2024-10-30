// @ts-nocheck
import { Button, Form, FormInstance } from 'antd'
import { useEffect } from 'react'

const FormSubmitButton = ({
  form,
  isLoading,
  isDisabled,
  handleDisabled,
}: {
  form: FormInstance
  isDisabled: boolean
  isLoading: boolean
  handleDisabled: (e: boolean) => void
}) => {
  const values = Form.useWatch([], form)

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        handleDisabled(true)
      },
      () => {
        handleDisabled(false)
      },
    )
  }, [values])

  return (
    <Button
      type="primary"
      block
      htmlType="submit"
      disabled={!isDisabled}
      loading={isLoading}>
      Save
    </Button>
  )
}

export default FormSubmitButton
