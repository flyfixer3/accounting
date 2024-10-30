// @ts-nocheck
import { useEffect } from 'react'
import useClassDetailController from '../controller/useClassDetailController'
import { Button, Col, Flex, Row } from 'antd'
import Card from 'antd/es/card/Card'
import { useNavigate } from 'react-router-dom'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import Spacer from 'src/components/view/Spacer'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import moment from 'moment'
import StatusBadge from 'src/components/view/StatusBadge'

const ClassDetail = () => {
  const navigate = useNavigate()
  const { onSetBreadcrumbs, params, classDetailData } =
    useClassDetailController()

  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'Class',
        path: '/class',
      },
      {
        title: 'Class Detail',
        path: `/class/${params?.id}`,
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
                  {classDetailData?.className || '-'}
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <Flex justify="flex-end">
                  <Button
                    type={'primary'}
                    onClick={() => {
                      navigate(`/class/edit/${classDetailData?.id}`)
                    }}>
                    Edit Class
                  </Button>
                </Flex>
              </Col>
            </Row>

            <Spacer margin={'.5rem'} />

            <DetailRow title={'ID'} value={classDetailData?.id || '-'} />

            <DetailRow
              title={'Date & Time'}
              value={`${classDetailData?.classDay || '-'} (${
                classDetailData?.classStartTime || '-'
              } - ${classDetailData?.classEndTime || '-'})`}
            />

            <DetailRow
              title={'Teacher'}
              value={classDetailData?.classTeacher?.teacherName || '-'}
            />

            <DetailRow
              title={'Course'}
              value={`${classDetailData?.classCourse?.courseName || '-'} - ${
                classDetailData?.classCourseLevel?.courseLevelName || '-'
              }`}
            />

            <DetailRow
              title={'Total Students'}
              value={classDetailData?.totalStudent || 0}
            />

            <DetailRow
              title={'Status'}
              renderValue={
                classDetailData?.status ? (
                  <StatusBadge status={classDetailData?.status} />
                ) : (
                  '-'
                )
              }
            />

            <DetailRow
              title={'Created At'}
              value={
                classDetailData?.createdAt
                  ? moment(classDetailData?.createdAt)?.format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />

            <DetailRow
              title={'Edited At'}
              value={
                classDetailData?.updatedAt
                  ? moment(classDetailData?.updatedAt)?.format(
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

export default ClassDetail
