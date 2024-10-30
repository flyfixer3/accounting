// @ts-nocheck
import { Button, Col, Flex, Row, Spin } from 'antd'
import useStudentDetailController from '../controller/useStudentDetailController'
import { useEffect } from 'react'
import { useApp } from 'src/context/app.context'
import { useNavigate, useParams } from 'react-router-dom'
import Card from 'antd/es/card/Card'
import Spacer from 'src/components/view/Spacer'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import dayjs from 'dayjs'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'

const StudentDetail = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { onSetBreadcrumbs } = useApp()
  const { detailData, isLoading } = useStudentDetailController()

  useEffect(() => {
    onSetBreadcrumbs([
      { title: 'Student Detail', path: `/student/${params?.id}` },
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
                  {detailData?.studentName || '-'}
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <Flex justify="flex-end">
                  <Button
                    type={'primary'}
                    onClick={() => {
                      navigate(`/student/edit/${detailData?.id}`)
                    }}>
                    Edit Student
                  </Button>
                </Flex>
              </Col>
            </Row>

            <Spacer margin={'.5rem'} />

            {isLoading ? (
              <Flex justify="center">
                <Spin />
              </Flex>
            ) : (
              <>
                <DetailRow
                  title="Student Name"
                  value={detailData?.studentName || '-'}
                />
                <DetailRow
                  title="Student Email"
                  value={detailData?.studentEmail || '-'}
                />
                <DetailRow
                  title="Student Phone Number"
                  value={detailData?.studentPhoneNumber || '-'}
                />
                <DetailRow
                  title="Student Gender"
                  value={detailData?.gender || '-'}
                />
                <DetailRow
                  title="Student Religion"
                  value={detailData?.religion?.name || '-'}
                />
                <DetailRow
                  title="Student Place of Birth"
                  value={detailData?.studentPlaceOfBirth || '-'}
                />
                <DetailRow
                  title="Student Date of Birth"
                  value={
                    detailData?.studentDateOfBirth
                      ? dayjs(detailData?.studentDateOfBirth).format(
                          DATETIME_FORMATTER_ENUM?.primary,
                        )
                      : '-'
                  }
                />
                <DetailRow
                  title="Student Address"
                  value={detailData?.studentAddress || '-'}
                />
                <DetailRow
                  title="Student City"
                  value={detailData?.studentCity || '-'}
                />
                <DetailRow
                  title="Student School"
                  value={detailData?.school?.schoolName || '-'}
                />
              </>
            )}
          </Card>
        </Col>
      </Row>

      <Spacer margin={'1rem auto'} />
    </>
  )
}

export default StudentDetail
