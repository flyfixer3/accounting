// @ts-nocheck
import useCourseDetailController from '../controller/useCourseDetailController'
import { Button, Col, Flex, Row } from 'antd'
import Card from 'antd/es/card/Card'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import Spacer from 'src/components/view/Spacer'
import { useEffect } from 'react'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import moment from 'moment'
import { DATETIME_FORMATTER_ENUM, USER_ROLE_ENUM } from 'src/enums/enums'
import StatusBadge from 'src/components/view/StatusBadge'
import { ColumnsType } from 'antd/es/table'
import { ICourseTableData } from 'src/models/course.model'
import Table from 'src/components/table/Table'
import ModalCreateCourseLevel from '../components/ModalCreateCourseLevel'
import { useAuth } from 'src/context/auth.context'

const TABLE_COLUMNS: ColumnsType<ICourseTableData> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (data) => data || '-',
  },
  {
    title: 'Name',
    dataIndex: 'courseLevelName',
    key: 'courseLevelName',
    render: (data) => data || '-',
  },

  {
    title: 'Monthly Fee',
    dataIndex: 'courseLevelMonthlyFee',
    key: 'courseLevelMonthlyFee',
    render: (text, record, index) => {
      return `${moneyFormatter(text)}` || `Rp0`
    },
    align: 'center',
  },

  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (data) =>
      moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime),
  },
]

const CourseDetail = () => {
  const {
    onRefetch,
    isLoading,
    courseDetailData,
    courseLevelData,
    queryParams,
    setQueryParams,
    handleClickAction,
    editCourseLevel,
    isModalCreateCourseLevelVisible,
    setIsModalCreateCourseLevelVisible,
    handleSubmitCourseLevelForm,
    isSubmitting,
    formErrorMsg,
    setIsFetch,
    isCourseLevelLoading,
  } = useCourseDetailController()

  const { getUserRole } = useAuth()

  useEffect(() => {
    onRefetch()
  }, [])

  return (
    <>
      <Row>
        <Col xs={24}>
          <Card loading={isLoading}>
            <Row>
              <Col xs={24}>
                <div className={'detail-title'}>
                  {courseDetailData?.courseName || '-'}
                </div>
              </Col>
            </Row>

            <Spacer margin={'.5rem'} />

            <DetailRow
              title={'Course Number'}
              value={courseDetailData?.courseNumber}
            />

            <DetailRow
              title={'Course Registration Fee'}
              value={`${moneyFormatter(
                parseInt(courseDetailData?.courseRegistrationFee),
              )}`}
            />

            <DetailRow
              title={'Status'}
              renderValue={
                courseDetailData?.status ? (
                  <StatusBadge status={courseDetailData?.status} />
                ) : (
                  '-'
                )
              }
            />

            <DetailRow
              title={'Created At'}
              value={
                courseDetailData?.createdAt
                  ? moment(courseDetailData?.createdAt)?.format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />

            <DetailRow
              title={'Edited At'}
              value={
                courseDetailData?.updatedAt
                  ? moment(courseDetailData?.updatedAt)?.format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />

            <DetailRow
              title={'Deleted At'}
              value={
                courseDetailData?.deletedAt
                  ? moment(courseDetailData?.deletedAt)?.format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />
          </Card>
        </Col>
      </Row>

      <Spacer margin={'1rem'} />

      <Row>
        <Col xs={24}>
          <Card>
            <Row>
              <Col xs={24} sm={12}>
                <div className={'detail-title'}>
                  {courseDetailData?.courseName || '-'} Course Level
                </div>
              </Col>

              {getUserRole === USER_ROLE_ENUM?.ibo ? (
                <Col xs={24} sm={12}>
                  <Flex justify="flex-end">
                    <Button
                      type={'primary'}
                      onClick={() => setIsModalCreateCourseLevelVisible()}>
                      + Add Course Level
                    </Button>
                  </Flex>
                </Col>
              ) : null}
            </Row>

            <Spacer margin={'.5rem'} />

            {courseLevelData && courseLevelData?.data?.length > 0 ? (
              <Table
                loading={isCourseLevelLoading}
                columns={TABLE_COLUMNS}
                data={courseLevelData.data}
                isAction
                onEdit={(e: string, record: any) =>
                  handleClickAction('edit', e, record)
                }
                rowKey={(data: ICourseTableData) => data?.id}
                identifier={'id'}
                queryParams={queryParams}
                setQueryParams={setQueryParams}
                setIsFetch={setIsFetch}
                allowEdit={getUserRole === USER_ROLE_ENUM?.ibo}
              />
            ) : null}
          </Card>
        </Col>
      </Row>

      <Spacer margin={'1rem'} />

      {isModalCreateCourseLevelVisible ? (
        <ModalCreateCourseLevel
          isVisible={isModalCreateCourseLevelVisible}
          handleClose={() => {
            setIsModalCreateCourseLevelVisible()
          }}
          title={
            editCourseLevel
              ? `Edit Course Level ${editCourseLevel?.courseLevelName}`
              : 'Create New Course Level'
          }
          editedData={editCourseLevel}
          handleSubmitForm={handleSubmitCourseLevelForm}
          isSubmitting={isSubmitting}
          formErrorMsg={formErrorMsg}
        />
      ) : null}
    </>
  )
}

export default CourseDetail
