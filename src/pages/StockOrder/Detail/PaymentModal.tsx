import { useMutation } from '@tanstack/react-query'
import { Modal } from 'antd'
import axios from 'axios'
import { useState } from 'react'
import useToastError from 'src/hooks/useToastError'
import SubaccountSelect from 'src/pages/Accounting/components/SubaccountSelect'
import { BASE_URL } from 'src/services/api.service'

export default function PaymentModal({
  close,
  isOpen,
  totalAmount,
  orderId,
  onSuccess,
}: {
  isOpen: boolean
  close: () => void
  totalAmount: number
  orderId: string
  onSuccess?: () => void
}) {
  const [selected, setSelected] = useState(null)
  const { mutate, error, isPending } = useMutation({
    mutationFn: async () => {
      await axios.post(`${BASE_URL}/orders/pay`, {
        order_id: orderId,
        subaccount_id: selected,
      })
    },
    onSuccess: () => {
      onSuccess?.()
      close()
    },
  })
  useToastError(error, 'Failed to pay')

  return (
    <Modal
      centered
      open={isOpen}
      onCancel={close}
      onOk={() => mutate()}
      confirmLoading={isPending}
      title={'Please choose which account you want to pay with'}>
      <SubaccountSelect
        value={selected}
        onChange={(acc) => setSelected(acc)}
        filterCategoryNumber="3"
      />
    </Modal>
  )
}
