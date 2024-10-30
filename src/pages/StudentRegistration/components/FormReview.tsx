// @ts-nocheck
import React from 'react'
import useReviewFormController from '../controller/useReviewFormController'
import { Button, Col, Row } from 'antd'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import Title from 'antd/es/typography/Title'
import dayjs from 'dayjs'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import Spacer from 'src/components/view/Spacer'

const FormReview = () => {
  const {
    formStep,
    formErrorMsg,
    isSubmitting,
    studentDataPayload,
    parentDataPayload,
    courseClassDataPayload,
    courseDetailDataPayload,
    handleBackBtn,
    handleSubmit,
  } = useReviewFormController()

  if (formStep?.step !== 4) return

  return (
    <>
      <Row>
        <Col xs={24}>
          <Title level={3}>Review Student Registration</Title>
        </Col>
      </Row>

      <Row>
        <Col xs={24}>
          <Title level={4}>Student Data</Title>
        </Col>
      </Row>
      <DetailRow
        title="Student Name"
        value={studentDataPayload?.studentName || '-'}
      />
      <DetailRow
        title="Student Email"
        value={studentDataPayload?.studentEmail || '-'}
      />
      <DetailRow
        title="Student Phone Number"
        value={studentDataPayload?.studentPhoneNumber || '-'}
      />
      <DetailRow
        title="Student Gender"
        value={studentDataPayload?.gender || '-'}
      />
      <DetailRow
        title="Student Place of Birth"
        value={studentDataPayload?.studentPlaceOfBirth || '-'}
      />
      <DetailRow
        title="Student Date of Birth"
        value={
          studentDataPayload?.studentDateOfBirth
            ? dayjs(studentDataPayload?.studentDateOfBirth).format(
                DATETIME_FORMATTER_ENUM?.primary,
              )
            : '-'
        }
      />
      <DetailRow
        title="Student Address"
        value={studentDataPayload?.studentAddress || '-'}
      />
      <DetailRow
        title="Student City"
        value={studentDataPayload?.studentCity || '-'}
      />

      <Row>
        <Col xs={24}>
          <Title level={4}>Parent Data</Title>
        </Col>
      </Row>
      <DetailRow
        title="Parent Name"
        value={parentDataPayload?.parentName || '-'}
      />
      <DetailRow
        title="Parent Email"
        value={parentDataPayload?.parentEmail || '-'}
      />
      <DetailRow
        title="Parent Phone Number"
        value={parentDataPayload?.parentPhone || '-'}
      />

      <Row>
        <Col xs={24}>
          <Title level={4}>Course Detail</Title>
        </Col>
      </Row>

      <DetailRow
        title="Course - Course Level"
        value={`${
          courseDetailDataPayload?.selectedCourseObj?.courseName || ''
        } - ${
          courseDetailDataPayload?.selectedCourseLevelObj?.courseLevelName || ''
        }`}
      />

      <DetailRow
        title="Book"
        value={`${courseDetailDataPayload?.selectedBookObj?.bookName} - ${courseDetailDataPayload?.selectedBookObj?.bookNumber}`}
      />

      <DetailRow
        title={'Course Registration Fee'}
        value={
          courseDetailDataPayload?.selectedCourseObj?.courseRegistrationFee
            ? `${moneyFormatter(
                parseInt(
                  courseDetailDataPayload?.selectedCourseObj
                    ?.courseRegistrationFee,
                ),
              )}`
            : '-'
        }
      />

      <DetailRow
        title={'Course Level Monthly Fee'}
        value={
          courseDetailDataPayload?.selectedCourseLevelObj?.courseLevelMonthlyFee
            ? `${moneyFormatter(
                parseInt(
                  courseDetailDataPayload?.selectedCourseLevelObj
                    ?.courseLevelMonthlyFee,
                ),
              )}`
            : '-'
        }
      />

      <Row>
        <Col xs={24}>
          <Title level={4}>Course Class</Title>
        </Col>
      </Row>

      {courseClassDataPayload?.courseClassIdObj?.length > 0 &&
        courseClassDataPayload?.courseClassIdObj?.map((item, idx) => {
          return (
            <>
              <DetailRow
                title="Class Day (Start Time - End Time)"
                value={`${item?.classDay || '-'} (${
                  item?.classStartTime || ''
                } - ${item?.classEndTime || ''})`}
              />
              <DetailRow
                title="Class Teacher"
                value={item?.classTeacher?.teacherName || '-'}
              />
            </>
          )
        })}

      <Spacer margin={'1rem 0'} />

      {formErrorMsg ? (
        <>
          <Row>
            <Col xs={24}>
              <div className="font-error text-center">{formErrorMsg}</div>
            </Col>
          </Row>
          <Spacer margin={'4px auto'} />
        </>
      ) : null}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={4}>
          <Button
            type="primary"
            block
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}>
            Save
          </Button>
        </Col>
        <Col xs={24} sm={4}>
          <Button
            type="primary"
            ghost
            block
            onClick={handleBackBtn}
            loading={isSubmitting}
            disabled={isSubmitting}>
            Back
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default FormReview
