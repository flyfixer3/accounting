import { Card } from 'antd'
import { useParams } from 'react-router-dom'
import Spacer from 'src/components/view/Spacer'
import useTransactionQuery from '../hooks/useTransactionQuery'
import AddTransactionsForm from './form'

export default function CreateTransactionsPage() {
  const params = useParams()
  const id = params.id
  const { data: transaction, isLoading } = useTransactionQuery(id)

  return (
    <div className="max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-medium">
        {params.id ? 'Edit Transaction' : 'Add New Transaction'}
      </h1>

      <Spacer margin={'.5rem auto'} />

      <Card>
        {isLoading && id ? (
          <div>Loading...</div>
        ) : (
          <AddTransactionsForm transaction={transaction?.data} />
        )}
      </Card>
    </div>
  )
}
