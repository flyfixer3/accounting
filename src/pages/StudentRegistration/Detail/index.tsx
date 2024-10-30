// @ts-nocheck
import { useApp } from 'src/context/app.context'
import { Button, Col, Flex, Row, Spin } from 'antd'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useStudentRegistrationDetail from '../controller/useStudentRegistrationDetail'
import Card from 'antd/es/card/Card'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import dayjs from 'dayjs'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import Spacer from 'src/components/view/Spacer'
import Divider from 'src/components/view/Divider'
import StatusBadge from 'src/components/view/StatusBadge'
import ModalCourseLevelUp from '../components/ModalCourseLevelUp'
import ModalCourseHistory from '../components/ModalCourseHistory'

const StudentRegistrationDetail = () => {
  const params = useParams()
  const navigate = useNavigate()

  const { onSetBreadcrumbs } = useApp()
  const {
    detailData,
    isLoading,
    studentClassDetail,
    isModalCourseLevelUpVisible,
    isSubmitted,
    formErrorMsg,
    isModalCourseHistoryVisible,
    handleModalCourseHistoryVisibility,
    onSetFormErrorMsg,
    handleSubmitCourseLevelUp,
    handleModalCourseLevelUpVisibility,
  } = useStudentRegistrationDetail()

  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'Student Registration',
        path: '/student-registration',
      },
      {
        title: 'Student Registration Detail',
        path: `/student-registration/${params.id}`,
      },
    ])
  }, [])

  const _onRenderStudentSection = (
    <Col xs={24}>
      <Card>
        <Flex justify="space-between">
          <div className="detail-title">Student</div>
          <Button
            type="primary"
            onClick={() => {
              navigate(`/student/edit/${detailData?.student?.id}`)
            }}
            disabled={isLoading}>
            Edit Student
          </Button>
        </Flex>

        <Spacer margin="1rem auto" />

        {isLoading ? (
          <Flex justify="center">
            <Spin />
          </Flex>
        ) : (
          <>
            <DetailRow
              title="Student ID"
              value={detailData?.student?.id || '-'}
            />

            <DetailRow
              title="Student Registration Number"
              value={detailData?.studentRegistrationNumber || '-'}
            />

            <DetailRow
              title="Student Name"
              value={detailData?.student?.studentName || '-'}
            />
            <DetailRow
              title="Student Email"
              value={detailData?.student?.studentEmail || '-'}
            />
            <DetailRow
              title="Student Phone Number"
              value={detailData?.student?.studentPhoneNumber || '-'}
            />
            <DetailRow
              title="Student Gender"
              value={detailData?.student?.gender || '-'}
            />
            <DetailRow
              title="Student Religion"
              value={detailData?.student?.religion?.name || '-'}
            />
            <DetailRow
              title="Student Place of Birth"
              value={detailData?.student?.studentPlaceOfBirth || '-'}
            />
            <DetailRow
              title="Student Date of Birth"
              value={
                detailData?.student.studentDateOfBirth
                  ? dayjs(detailData?.student?.studentDateOfBirth).format(
                      DATETIME_FORMATTER_ENUM?.primary,
                    )
                  : '-'
              }
            />
            <DetailRow
              title="Student Address"
              value={detailData?.student?.studentAddress || '-'}
            />
            <DetailRow
              title="Student City"
              value={detailData?.student?.studentCity || '-'}
            />
            <DetailRow
              title="Student School"
              value={detailData?.student?.school?.schoolName || '-'}
            />
          </>
        )}
      </Card>
    </Col>
  )

  const _onRenderParentSection = (
    <Col xs={24}>
      <Card>
        <Flex justify="space-between">
          <div className="detail-title">Parent</div>
          <Button type="primary" onClick={() => {}} disabled={isLoading}>
            Edit Parent
          </Button>
        </Flex>

        <Spacer margin="1rem auto" />

        {isLoading ? (
          <Flex justify="center">
            <Spin />
          </Flex>
        ) : (
          <>
            <DetailRow
              title="Parent Name"
              value={detailData?.parent?.parentName || '-'}
            />
            <DetailRow
              title="Parent Email"
              value={detailData?.parent?.parentEmail || '-'}
            />
            <DetailRow
              title="Parent Phone Number"
              value={detailData?.parent?.parentPhone || '-'}
            />
            <DetailRow
              title="Parent Occupation"
              value={detailData?.parent?.parentOccupation || '-'}
            />
          </>
        )}
      </Card>
    </Col>
  )

  const _onRenderCourseDetailSection = (
    <Col xs={24}>
      <Card>
        <Flex justify="space-between">
          <div className="detail-title">First Registered Course Detail</div>
        </Flex>
        <Spacer margin="1rem auto" />
        {isLoading ? (
          <Flex justify="center">
            <Spin />
          </Flex>
        ) : (
          <>
            <DetailRow
              title="Course"
              value={`${
                detailData?.studentCourseDetail?.course?.courseName || '-'
              }`}
            />
            <DetailRow
              title="Course Level"
              value={`${
                detailData?.studentCourseDetail?.courseLevel?.courseLevelName ||
                '-'
              }`}
            />

            {/* <DetailRow
              title="Book"
              value={`${detailData?.studentCourseDetail?.book?.bookName} - ${detailData?.studentCourseDetail?.book?.bookNumber}`}
            /> */}
          </>
        )}
      </Card>
    </Col>
  )

  const _onRenderCourseClassSection = (
    <Col xs={24}>
      <Card>
        <Flex justify="space-between">
          <div className="detail-title">Current Course Detail</div>
          <Flex>
            <Button
              type="primary"
              disabled={isLoading}
              onClick={handleModalCourseLevelUpVisibility}>
              + Level Up
            </Button>

            <Spacer margin="auto .5rem" />

            <Button
              type="primary"
              ghost
              disabled={isLoading}
              onClick={handleModalCourseHistoryVisibility}>
              Level Up History
            </Button>
          </Flex>
        </Flex>

        <Spacer margin="1rem auto" />

        {isLoading ? (
          <>
            <Flex justify="center">
              <Spin />
            </Flex>
            <Spacer margin="2rem auto" />
          </>
        ) : (
          <>
            <DetailRow
              title="Course"
              value={`${
                detailData?.studentCourseDetail?.course?.courseName || '-'
              }`}
            />
            <DetailRow
              title="Course Level"
              value={`${
                detailData?.studentCourseDetail?.courseLevel?.courseLevelName ||
                '-'
              }`}
            />
          </>
        )}

        <Card>
          <Flex justify="space-between">
            <div className="detail-title">Current Class Detail</div>
            {/* <Button
              type="primary"
              disabled={isLoading}
              onClick={() =>
                navigate(`/student-registration/${params?.id}/change-class`, {
                  state: {
                    studentCourseDetail: detailData?.studentCourseDetail,
                    studentId: detailData?.student?.id,
                  },
                })
              }>
              Change Class
            </Button> */}
          </Flex>

          <Spacer margin="1rem auto" />

          {isLoading ? (
            <Flex justify="center">
              <Spin />
            </Flex>
          ) : (
            studentClassDetail?.length > 0 &&
            studentClassDetail?.map((item, idx) => {
              return (
                <div key={idx}>
                  <DetailRow
                    title="Class Day"
                    value={`${item?.courseClass?.classDay || '-'}`}
                  />
                  <DetailRow
                    title="Class Start Time - End Time"
                    value={`${item?.courseClass?.classStartTime || ''} - ${
                      item?.courseClass?.classEndTime || ''
                    }`}
                  />
                  <DetailRow
                    title="Class Teacher"
                    value={item?.courseClass?.classTeacher?.teacherName || '-'}
                  />
                  {idx === studentClassDetail?.length - 1 ? null : (
                    <Divider dashed />
                  )}
                </div>
              )
            })
          )}
        </Card>
      </Card>
    </Col>
  )

  const _onRenderCourseVoucherSection = detailData?.courseVoucher ? (
    <Col xs={24}>
      <Card>
        <Flex justify="space-between">
          <div className="detail-title">Course Voucher</div>
        </Flex>

        <Spacer margin="1rem auto" />

        {isLoading ? (
          <Flex justify="center">
            <Spin />
          </Flex>
        ) : (
          <>
            <DetailRow
              title="Voucher Number"
              value={detailData?.courseVoucher?.courseVoucherNumber || '-'}
            />

            <DetailRow
              title="Voucher Bundle Number"
              value={
                detailData?.courseVoucher?.courseVoucherBundle
                  ?.courseVoucherBundleNumber || '-'
              }
            />
          </>
        )}
      </Card>
    </Col>
  ) : null

  const _onRenderInvoiceSection = detailData?.invoice ? (
    <Col xs={24}>
      <Card>
        <Flex justify="space-between">
          <div className="detail-title">Registration Invoice</div>
        </Flex>

        <Spacer margin="1rem auto" />

        {isLoading ? (
          <Flex justify="center">
            <Spin />
          </Flex>
        ) : (
          <>
            <DetailRow
              title="Invoice Number"
              value={detailData?.invoice?.invoiceNumber || '-'}
              onClick={() => {
                navigate(`/sales-invoice/${detailData?.invoice?.invoiceNumber}`)
              }}
            />

            <DetailRow
              title="Invoice Status"
              renderValue={
                detailData?.invoice?.invoiceStatus ? (
                  <StatusBadge status={detailData?.invoice?.invoiceStatus} />
                ) : (
                  '-'
                )
              }
            />
          </>
        )}
      </Card>
    </Col>
  ) : null

  return (
    <>
      <Row gutter={[16, 16]}>
        {_onRenderStudentSection}

        {_onRenderParentSection}

        {_onRenderCourseDetailSection}

        {_onRenderCourseClassSection}

        {_onRenderCourseVoucherSection}

        {_onRenderInvoiceSection}
      </Row>

      <Spacer margin="1.5rem auto" />

      {isModalCourseLevelUpVisible ? (
        <ModalCourseLevelUp
          isVisible={isModalCourseLevelUpVisible}
          handleClose={handleModalCourseLevelUpVisibility}
          isSubmitted={isSubmitted}
          formErrorMsg={formErrorMsg}
          onHandleSubmit={handleSubmitCourseLevelUp}
          onSetFormErrorMsg={onSetFormErrorMsg}
          selectedData={detailData}
        />
      ) : null}

      {isModalCourseHistoryVisible ? (
        <ModalCourseHistory
          isVisible={isModalCourseHistoryVisible}
          handleClose={handleModalCourseHistoryVisibility}
          selectedData={detailData}
        />
      ) : null}
    </>
  )
}

export default StudentRegistrationDetail
