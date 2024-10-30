// @ts-nocheck
import { Button, Col, Row } from 'antd'
import Spacer from 'src/components/view/Spacer'
import { useEffect, useMemo } from 'react'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import Table from 'src/components/table/Table'
import { ColumnsType } from 'antd/es/table'
import { IClassData } from 'src/models/class.model'
import useCourseClassFormController from '../controller/useCourseClassFormController'
import SelectDayName from 'src/components/select/SelectDaysOfWeek'
import { STATUS_ENUM } from 'src/enums/enums'
import useClassByCourseLevelController from 'src/pages/Class/controller/useClassByCourseLevelController'
import useStudentRegistrationUpdateClassController from '../controller/useStudentRegistrationUpdateClass'
import { useLocation, useNavigate } from 'react-router-dom'

const TABLE_COLUMNS: ColumnsType<IClassData> = [
  {
    title: 'Day',
    dataIndex: 'classDay',
    key: 'classDay',
    render: (data) => data || '-',
  },
  {
    title: 'Start Time - End Time',
    render: (text, record, index) => {
      return `${record?.classStartTime} - ${record?.classEndTime}`
    },
  },
  {
    title: 'Teacher',
    render: (text, record, index) => {
      return record?.classTeacher?.teacherName || '-'
    },
  },
]

const FormUpdateClass = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    onRefetch,
    classData,
    isLoading,
    queryParams,
    isFetch,
    setQueryParams,
    handleChangeFilterDay,
    setIsFetch,
  } = useClassByCourseLevelController()

  const {
    isSubmitting,
    formErrorMsg,
    onSelectAll,
    onChange,
    selectedClassIds,
    selectedClassObj,
    onHandleSubmitUpdateClass,
    onRefetchClassDetailByStudentId,
    onSelectExistingData,
  } = useStudentRegistrationUpdateClassController()

  const handleFinishForm = () => {
    onHandleSubmitUpdateClass(
      location?.state?.studentId,
      location?.state?.studentCourseDetail?.course,
      location?.state?.studentCourseDetail?.courseLevel,
    )
  }

  const isValidate = () => {
    const isSelected = selectedClassIds?.length > 0

    if (!isSelected) {
      return false
    }
    return true
  }

  useEffect(() => {
    if (isFetch)
      onRefetch(location?.state?.studentCourseDetail?.courseLevel?.id)
  }, [isFetch])

  useEffect(() => {
    if (location?.state?.studentCourseDetail && location?.state?.studentId) {
      onRefetch(location?.state?.studentCourseDetail?.courseLevel?.id)
      onRefetchClassDetailByStudentId(
        location?.state?.studentId,
        location?.state?.studentCourseDetail?.course?.id,
      )
    }
  }, [location.state.studentCourseDetail, location?.state?.studentId])

  useEffect(() => {
    if (classData?.data?.length > 0 && !isLoading) {
      onSelectExistingData()
    }
  }, [classData?.data, isLoading])

  const _onRenderTable = useMemo(() => {
    if (
      classData?.data?.length === 0 &&
      selectedClassIds &&
      selectedClassIds?.length === 0
    )
      return null

    return (
      <Table
        columns={TABLE_COLUMNS}
        data={classData?.data}
        rowKey={(data: IClassData) => data?.id}
        identifier={'id'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        loading={isLoading}
        checkbox
        selectedRowKeys={selectedClassIds}
        onSelectAll={onSelectAll}
        onChange={onChange}
        setIsFetch={setIsFetch}
      />
    )
  }, [
    classData?.data,
    selectedClassIds,
    isLoading,
    onChange,
    setIsFetch,
    queryParams,
    setQueryParams,
    TABLE_COLUMNS,
  ])

  return (
    <>
      <Spacer margin={'1rem auto'} />

      <DetailRow
        title="Course"
        value={location?.state?.studentCourseDetail?.course?.courseName || '-'}
      />
      <DetailRow
        title="Course Level"
        value={
          location?.state?.studentCourseDetail?.courseLevel?.courseLevelName ||
          '-'
        }
      />
      <Spacer margin={'1rem auto'} />

      <Row>
        <Col xs={10}>
          <SelectDayName handleChange={handleChangeFilterDay} withAll />
        </Col>
      </Row>

      <Spacer margin={'1rem auto'} />
      {_onRenderTable}

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

      <Row gutter={[16, 8]}>
        <Col xs={24}>
          <Button
            type="primary"
            block
            onClick={handleFinishForm}
            disabled={!isValidate() || isSubmitting}
            loading={isSubmitting}>
            Save
          </Button>
        </Col>
        <Col xs={24}>
          <Button
            type="primary"
            block
            ghost
            onClick={() => {
              navigate(-1)
            }}>
            Back
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default FormUpdateClass
