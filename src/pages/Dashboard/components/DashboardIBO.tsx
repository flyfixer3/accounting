// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { Col, Row } from 'antd'
import { useNavigate } from 'react-router-dom'
import useDashboardIBOController from '../controller/useDashboardIBOController'
import { useEffect } from 'react'
import CardStatistic from 'src/components/view/CardStatistic/CardStatistic'
import Spacer from 'src/components/view/Spacer'

const DashboardIBO = () => {
  const navigate = useNavigate()
  const { onSetBreadcrumbs } = useApp()

  const { metaData, isLoading, onRefetch } = useDashboardIBOController()

  useEffect(() => {
    onSetBreadcrumbs([{ title: 'Dashboard', path: '/dashboard' }])
    onRefetch()
  }, [])

  return (
    <>
      <Row>
        <Col xs={24}>
          <div className="section-title-primary">Training Centers</div>
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={6}>
          <CardStatistic
            title={'Total Training Center'}
            value={metaData?.totalTrainingCenter || 0}
            isLoading={isLoading}
          />
        </Col>
      </Row>

      <Spacer margin="1rem auto" />

      <Row>
        <Col xs={24}>
          <div className="section-title-primary">Supplier Orders</div>
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={6}>
          <CardStatistic
            title={'Total Unpaid'}
            value={metaData?.orderSupplierMetadata.totalUnpaid || 0}
            isLoading={isLoading}
          />
        </Col>

        <Col xs={24} sm={6}>
          <CardStatistic
            title={'Total Paid'}
            value={metaData?.orderSupplierMetadata.totalPaid || 0}
            isLoading={isLoading}
          />
        </Col>

        <Col xs={24} sm={6}>
          <CardStatistic
            title={'Total Complete'}
            value={metaData?.orderSupplierMetadata.totalComplete || 0}
            isLoading={isLoading}
          />
        </Col>

        <Col xs={24} sm={6}>
          <CardStatistic
            title={'Total Incomplete'}
            value={metaData?.orderSupplierMetadata.totalIncomplete || 0}
            isLoading={isLoading}
          />
        </Col>
      </Row>

      <Spacer margin="1rem auto" />

      <Row>
        <Col xs={24}>
          <div className="section-title-primary">Training Center Orders</div>
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={6}>
          <CardStatistic
            title={'Total Pending'}
            value={metaData?.orderTcMetadata.totalPending || 0}
            isLoading={isLoading}
          />
        </Col>

        <Col xs={24} sm={6}>
          <CardStatistic
            title={'Total Rejected'}
            value={metaData?.orderTcMetadata.totalReject || 0}
            isLoading={isLoading}
          />
        </Col>

        <Col xs={24} sm={6}>
          <CardStatistic
            title={'Total Unpaid'}
            value={metaData?.orderTcMetadata.totalUnpaid || 0}
            isLoading={isLoading}
          />
        </Col>

        <Col xs={24} sm={6}>
          <CardStatistic
            title={'Total Paid'}
            value={metaData?.orderTcMetadata.totalPaid || 0}
            isLoading={isLoading}
          />
        </Col>

        <Col xs={24} sm={6}>
          <CardStatistic
            title={'Total Complete'}
            value={metaData?.orderTcMetadata.totalComplete || 0}
            isLoading={isLoading}
          />
        </Col>

        <Col xs={24} sm={6}>
          <CardStatistic
            title={'Total Incomplete'}
            value={metaData?.orderTcMetadata.totalIncomplete || 0}
            isLoading={isLoading}
          />
        </Col>
      </Row>

      <Spacer margin="1rem auto" />
    </>
  )
}

export default DashboardIBO
