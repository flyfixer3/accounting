// @ts-nocheck
interface IStatusBadgeProps {
  status: string
}

const TeacherStatusBadge = ({ status }: IStatusBadgeProps) => {
  return (
    <div className={['teacher-status-badge', status.toLowerCase()].join(' ')}>
      {status}
    </div>
  )
}

export default TeacherStatusBadge
