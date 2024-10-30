// @ts-nocheck
import { useAuth } from 'src/context/auth.context'
import Initial from 'src/components/image/Initial'
import { Col, Row } from 'antd'

import styles from '../index.module.scss'

const SidebarHeader = () => {
  const { getUserData } = useAuth()
  console.log(getUserData().user.user.usernamze);
  return (
    <div className={styles?.sidebarHeaderContainer}>
      <Row>
        <Col xs={4} sm={4}>
          <div className={styles?.imgWrapper}>
            <Initial
              name={
                getUserData()?.user?.user?.nickname ||
                getUserData()?.user?.ibo?.name ||
                '-'
              }
            />
          </div>
        </Col>
        <Col xs={20} sm={20}>
          <div className={styles?.username}>
            {getUserData()?.user?.user?.nickname ||
              getUserData()?.user?.ibo?.name ||
              '-'}
          </div>
          <div className={styles?.email}>
            {getUserData()?.user?.user?.username ||
              getUserData()?.user?.ibo?.email ||
              '-'}
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default SidebarHeader
