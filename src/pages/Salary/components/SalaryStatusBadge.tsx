// @ts-nocheck
interface IStatusBadgeProps {
  status: string
}

const SalaryStatusBadge = ({ status }: IStatusBadgeProps) => {
  return (
    <div className={['salary-status-badge', status.toLowerCase()].join(' ')}>
      {status}
    </div>
  )
}

export default SalaryStatusBadge
