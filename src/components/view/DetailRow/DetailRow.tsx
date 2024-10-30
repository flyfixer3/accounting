// @ts-nocheck
import useResponsive from 'src/hooks/useResponsive'
import { Col, Row } from 'antd'
import Spacer from '../Spacer'

import styles from './DetailRow.module.scss'
import { ReactNode } from 'react'
import { appColors } from 'src/assets/styles/styles'

interface IDetailRowProps {
  title: string
  value?: string | number
  renderValue?: ReactNode
  onClick?: () => void
}

const DetailRow = ({ title, value, renderValue, onClick }: IDetailRowProps) => {
  const { isOnlyMobile } = useResponsive()
  return (
    <>
      <Row>
        <Col xs={24} sm={8}>
          <div className={styles?.detailRowTitle}>{title}</div>
        </Col>
        {isOnlyMobile ? null : <Col sm={1}>:</Col>}
        <Col xs={24} sm={12}>
          {renderValue ? (
            renderValue
          ) : (
            <div
              className={styles?.detailRowValue}
              style={{
                cursor: onClick ? 'pointer' : 'default',
                color: onClick ? appColors?.blue70 : appColors?.neutral100,
              }}
              onClick={() => (onClick ? onClick() : {})}>
              {value !== undefined ? value : '-'}
            </div>
          )}
        </Col>
      </Row>
      <Spacer margin={'10px'} />
    </>
  )
}

export default DetailRow
