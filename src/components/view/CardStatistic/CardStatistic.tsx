// @ts-nocheck
import styles from './CardStatistic.module.scss'
import SpinFC from 'antd/es/spin'

const CardStatistic = ({
  value,
  title,
  currency = false,
  active,
  onClick,
  isLoading,
}: {
  value: string | number
  title: string
  currency?: boolean
  active?: boolean
  onClick?: () => void
  isLoading: boolean
}) => {
  return (
    <>
      <div
        style={{
          cursor: onClick ? 'pointer' : 'default',
        }}
        className={[
          styles?.cardStatisticContainer,
          active ? styles?.cardStatisticContainerActive : '',
        ].join(' ')}
        onClick={onClick}>
        {isLoading ? (
          <div>
            <SpinFC size={'default'} />
          </div>
        ) : (
          <>
            <div
              className={[
                styles?.cardStatisticValue,
                active ? styles?.cardStatisticValueActive : '',
              ].join(' ')}>
              {value !== undefined ? value : '-'}
            </div>
            <div
              className={[
                styles?.cardStatisticTitle,
                active ? styles?.cardStatisticTitleActive : '',
              ].join(' ')}>
              {title || '-'}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default CardStatistic
