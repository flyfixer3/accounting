// @ts-nocheck
interface IStatusBadgeProps {
  status: string
}

const BookStatusBadge = ({ status }: IStatusBadgeProps) => {
  return (
    <div className={['book-status-badge', status.toLowerCase()].join(' ')}>
      {status}
    </div>
  )
}

export default BookStatusBadge
