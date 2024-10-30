// @ts-nocheck
import { Button, Card, Col, Flex, Row } from 'antd'
import useTeacherDetailController from '../controller/useTeacherDetailController'
import Spacer from 'src/components/view/Spacer'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import moment from 'moment'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import { useEffect } from 'react'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import { useNavigate } from 'react-router-dom'
import TeacherStatusBadge from '../components/TeacherStatusBadge'

const TeacherDetail = () => {
  const navigate = useNavigate()
  const { teacherDetailData, onSetBreadcrumbs, params } =
    useTeacherDetailController()
  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'Teacher',
        path: '/teacher',
      },
      {
        title: 'Teacher Detail',
        path: `/teacher/${params.id}`,
      },
    ])
  }, [])
  return (
    <>
      <Row>
        <Col xs={24}>
          <Card>
            <Row>
              <Col xs={24} sm={12}>
                <div className={'detail-title'}>
                  {teacherDetailData?.teacherName || '-'}
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <Flex justify="flex-end">
                  <Button
                    type={'primary'}
                    onClick={() => {
                      navigate(
                        `/teacher/edit/${teacherDetailData?.teacherNumber}`,
                      )
                    }}>
                    Edit Teacher
                  </Button>
                </Flex>
              </Col>
            </Row>

            <Spacer margin={'.5rem'} />

            <DetailRow
              title={'Number'}
              value={teacherDetailData?.teacherNumber || '-'}
            />

            <DetailRow
              title={'Nickname'}
              value={teacherDetailData?.teacherNickname || '-'}
            />

            <DetailRow
              title={'Phone Number'}
              value={teacherDetailData?.teacherPhoneNumber || '-'}
            />

            <DetailRow
              title={'Email'}
              value={teacherDetailData?.teacherEmail || '-'}
            />

            <DetailRow
              title={'Gender'}
              value={teacherDetailData?.gender || '-'}
            />

            <DetailRow
              title={'Address'}
              value={teacherDetailData?.teacherAddress || '-'}
            />

            <DetailRow
              title={'Place of Birth'}
              value={teacherDetailData?.teacherPlaceOfBirth || '-'}
            />

            <DetailRow
              title={'Date of Birth'}
              value={
                teacherDetailData?.teacherDateOfBirth
                  ? moment(teacherDetailData?.teacherDateOfBirth).format(
                      DATETIME_FORMATTER_ENUM?.primary,
                    )
                  : '-'
              }
            />

            <DetailRow
              title={'Religion'}
              value={teacherDetailData?.religion?.name || '-'}
            />

            <DetailRow
              title={'Join Date'}
              value={
                teacherDetailData?.teacherJoinDate
                  ? moment(teacherDetailData?.teacherJoinDate).format(
                      DATETIME_FORMATTER_ENUM?.primary,
                    )
                  : '-'
              }
            />

            <DetailRow
              title={'Education'}
              value={teacherDetailData?.teacherEducation?.name || '-'}
            />

            <DetailRow
              title={'Course'}
              value={teacherDetailData?.teacherCourseLevel?.courseName || '-'}
            />

            <DetailRow
              title={'Course Level'}
              value={
                teacherDetailData?.teacherCourseLevel?.courseLevelName || '-'
              }
            />

            <DetailRow
              title={'Base Salary'}
              value={`${moneyFormatter(
                parseInt(teacherDetailData?.baseSalary),
              )}`}
            />

            <DetailRow
              title={'Teacher Status'}
              renderValue={
                teacherDetailData?.teacherStatus ? (
                  <TeacherStatusBadge
                    status={teacherDetailData?.teacherStatus}
                  />
                ) : (
                  '-'
                )
              }
            />

            <DetailRow
              title={'Created At'}
              value={
                teacherDetailData?.createdAt
                  ? moment(teacherDetailData?.createdAt)?.format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />

            <DetailRow
              title={'Edited At'}
              value={
                teacherDetailData?.updatedAt
                  ? moment(teacherDetailData?.updatedAt)?.format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />
          </Card>
        </Col>
      </Row>

      <Spacer margin={'1rem auto'} />
    </>
  )
}

export default TeacherDetail
