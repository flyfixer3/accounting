// @ts-nocheck
import { useApp } from 'src/context/app.context'
import React, { useEffect } from 'react'
import { Col, Flex, Image, Row } from 'antd'
import useDashboardTCController from '../controller/useDashboardTCController'
import CardStatistic from 'src/components/view/CardStatistic/CardStatistic'
import Spacer from 'src/components/view/Spacer'
import Card from 'antd/es/card/Card'
import Initial from 'src/components/image/Initial'
import { IStudentDetailResponse } from 'src/models/student.model'
import moment from 'moment'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import { LiaBirthdayCakeSolid } from 'react-icons/lia'
import { appColors } from 'src/assets/styles/styles'

import BirthdayImage from 'src/assets/images/figures/birthday.png'
import { useNavigate } from 'react-router-dom'
import { IClassDetailResponse } from '@src/models/class.model'
import Table from 'src/components/table/Table'
import { ColumnsType } from 'antd/es/table'

import styles from '../index.module.scss'

const TABLE_COLUMNS: ColumnsType<IClassDetailResponse> = [
  {
    title: 'Name',
    dataIndex: 'className',
    key: 'className',
    render: (data) => data || '-',
  },
  {
    title: 'Time',
    render: (text, record, index) => {
      return `${record?.classStartTime || '-'} - ${record?.classEndTime || '-'}`
    },
  },
  {
    title: 'Teacher',
    dataIndex: 'classTeacher',
    key: 'classTeacher',
    render: (text, record, index) => {
      return record?.classTeacher?.teacherName || '-'
    },
  },
  {
    title: 'Course',
    width: '250px',
    ellipsis: true,
    render: (text, record, index) => {
      return `${record?.classCourse?.courseName || '-'} - ${
        record?.classCourseLevel?.courseLevelName || '-'
      }`
    },
  },
]

const DashboardTC: React.FC = () => {
  const navigate = useNavigate()
  const { onSetBreadcrumbs } = useApp()

  const { metaData, isLoading, onRefetch } = useDashboardTCController()

  useEffect(() => {
    onSetBreadcrumbs([{ title: 'Dashboard', path: '/dashboard' }])
    onRefetch()
  }, [])

  const _onRenderTodayBirthdaySection = (data: IStudentDetailResponse[]) => {
    return (
      <Card
        bodyStyle={{ padding: '1rem' }}
        title={
          <Flex justify="space-between">
            <div>Today's Birthday</div>
            <div>{moment().format(DATETIME_FORMATTER_ENUM?.primary)}</div>
          </Flex>
        }>
        <>
          {data?.length > 0 ? (
            data?.map((item, idx) => {
              return (
                <>
                  <div
                    onClick={() => {
                      navigate(`/student/${item?.id}`)
                    }}
                    className={styles.studentItem}>
                    <Row align={'middle'}>
                      <Col xs={24} sm={20}>
                        <Flex>
                          <Flex align="center">
                            <Initial
                              name={item?.studentName}
                              size="32px"
                              backgroundColor={appColors?.blue50}
                              color={appColors?.neutral0}
                            />
                          </Flex>
                          <Spacer margin="auto 4px" />
                          <div>
                            <div>{item?.studentName}</div>
                            <div className={styles?.studentItemDesc}>
                              {item?.studentEmail}
                              {item?.studentPhoneNumber
                                ? `- ${item?.studentPhoneNumber || ''}`
                                : ''}
                            </div>
                          </div>
                        </Flex>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Flex justify="end">
                          <LiaBirthdayCakeSolid
                            size={20}
                            color={appColors?.blue70}
                          />
                        </Flex>
                      </Col>
                    </Row>
                  </div>
                </>
              )
            })
          ) : (
            <Row justify={'center'}>
              <Col xs={24}>
                <Flex justify="center">
                  <Image
                    width={'200px'}
                    height={'auto'}
                    src={BirthdayImage}
                    alt="no-birthday"
                    preview={false}
                  />
                </Flex>
                <div className={'emptyTitle'}>No Birthday today</div>
              </Col>
            </Row>
          )}
        </>
      </Card>
    )
  }

  const _onRenderTodayClassSection = (data: IClassDetailResponse[]) => {
    return (
      <Card bodyStyle={{ padding: '1rem' }} title={<div>Today's Class</div>}>
        <Table
          data={data}
          columns={TABLE_COLUMNS}
          pagination={null}
          loading={isLoading}
          isAction
          onDetail={(e: string) => {
            navigate(`/class/${e}`)
          }}
          rowKey={(data: IClassDetailResponse) => data?.id}
          identifier={'id'}
          size="small"
        />
      </Card>
    )
  }

  return (
    <>
      <Row>
        <Col xs={24}>
          <div className="section-title-primary">Students</div>
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Student'}
            value={metaData?.totalStudent || 0}
            isLoading={isLoading}
          />
        </Col>
      </Row>

      <Spacer margin="1rem auto" />

      {metaData?.totalAvailableCourseVoucher?.length > 0 ? (
        <>
          <Row>
            <Col xs={24}>
              <div className="section-title-primary">
                Available Course Voucher
              </div>
            </Col>
          </Row>

          <Row gutter={[8, 8]}>
            {metaData?.totalAvailableCourseVoucher?.map((item, idx) => {
              return (
                <Col xs={24} sm={8} key={idx}>
                  <CardStatistic
                    title={item?.courseName}
                    value={item?.totalAvailable || 0}
                    isLoading={isLoading}
                  />
                </Col>
              )
            })}
          </Row>
        </>
      ) : null}

      <Spacer margin="1rem auto" />

      <Row>
        <Col xs={24}>
          <div className="section-title-primary">Invoices</div>
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Unpaid Invoice'}
            value={metaData?.totalUnpaidInvoice || 0}
            isLoading={isLoading}
          />
        </Col>
      </Row>

      <Spacer margin="1rem auto" />

      <Row>
        <Col xs={24}>
          <div className="section-title-primary">Orders</div>
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
      <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Pending Order'}
            value={metaData?.orderMetadata.totalPending || 0}
            isLoading={isLoading}
          />
        </Col>

        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Unpaid Order'}
            value={metaData?.orderMetadata.totalUnpaid || 0}
            isLoading={isLoading}
          />
        </Col>
      </Row>

      <Spacer margin="1rem auto" />

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8}>
          {_onRenderTodayBirthdaySection(
            metaData?.studentWhoCelebrateBirthayList,
          )}
        </Col>
        <Col xs={24} sm={16}>
          {_onRenderTodayClassSection(metaData?.todayClassList)}
        </Col>
      </Row>
    </>
  )
}

export default DashboardTC
