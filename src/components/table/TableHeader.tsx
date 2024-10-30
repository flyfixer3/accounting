// @ts-nocheck
import { Col, Flex, Row, RowProps } from 'antd'
import Spacer from '../view/Spacer'

import styles from './index.module.scss'

interface IActionItemsProps {
  key: string
  column?: number
  children: JSX.Element
}

interface IActionProps {
  actions: IActionItemsProps[]
  totalData: number
  justifyContentRow?:
    | 'space-between'
    | 'start'
    | 'end'
    | 'center'
    | 'space-around'
    | 'space-evenly'
}

const TableHeader = ({
  totalData,
  actions,
  justifyContentRow = 'space-between',
}: IActionProps) => {
  return (
    <>
      {actions && actions?.length > 0 ? (
        <Row gutter={[16, 16]} align="middle" justify={justifyContentRow}>
          {actions.map((item: IActionItemsProps, idx) => (
            <Col key={idx} md={item?.column || 12} xs={24}>
              {item?.children}
            </Col>
          ))}
        </Row>
      ) : null}

      <Spacer margin={'.5rem auto'} />

      <Row>
        <Col xs={24}>
          <div className={styles?.tableMetaWrapper}>
            <Flex justify="flex-end">
              <div className={styles?.tableMetaTotalTxt}>
                Total Data: {totalData || 0}
              </div>
            </Flex>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default TableHeader
