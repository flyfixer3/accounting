// @ts-nocheck
import { STATUS_ENUM } from 'src/enums/enums'
import { cleanStringFormatter } from 'src/helpers/formatter.helper'

interface IStatusBadgeProps {
  status: string
}

const StatusBadge = ({ status }: IStatusBadgeProps) => {
  const transformStatusLabel =
    status === STATUS_ENUM.partialPaid ||
    status === STATUS_ENUM.outOfStock ||
    status === STATUS_ENUM.receivedByTC
      ? cleanStringFormatter(status, ' ')
      : status
  return (
    <div className={['status-badge', status.toLowerCase()].join(' ')}>
      {transformStatusLabel}
    </div>
  )
}

export default StatusBadge
