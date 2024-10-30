// @ts-nocheck
import { Button, Col, Row } from 'antd'
import Spacer from 'src/components/view/Spacer'
import { useEffect } from 'react'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import Table from 'src/components/table/Table'
import { ColumnsType } from 'antd/es/table'
import { IClassData } from 'src/models/class.model'
import useCourseClassFormController from '../controller/useCourseClassFormController'
import SelectDayName from 'src/components/select/SelectDaysOfWeek'
import { STATUS_ENUM } from 'src/enums/enums'
import useClassByCourseLevelController from 'src/pages/Class/controller/useClassByCourseLevelController'

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

const FormStepCourseClass = () => {
  const {
    onRefetch,
    classData,
    isLoading,
    queryParams,
    isFetch,
    setQueryParams,
    handleChangeFilterDay,
    handleChangeStatus,
    setIsFetch,
  } = useClassByCourseLevelController()

  const {
    isSubmitting,
    formErrorMsg,
    formStep,
    courseDetailDataPayload,
    handleBackBtn,
    onSelectAll,
    onChange,
    selectedClassIds,
    onHandleValidate,
  } = useCourseClassFormController()

  const handleFinishForm = () => {
    onHandleValidate()
  }

  const isValidate = () => {
    const isSelected = selectedClassIds?.length > 0

    if (!isSelected) {
      return false
    }
    return true
  }

  useEffect(() => {
    if (isFetch) onRefetch(courseDetailDataPayload?.selectedCourseLevelObj?.id)
  }, [isFetch])

  useEffect(() => {
    if (formStep?.step === 3) {
      onRefetch(courseDetailDataPayload?.selectedCourseLevelObj?.id)
    }
  }, [formStep?.step])

  if (formStep?.step !== 3) return

  return (
    <>
      <Spacer margin={'1rem auto'} />

      <DetailRow
        title="Course"
        value={courseDetailDataPayload?.selectedCourseObj?.courseName || '-'}
      />
      <DetailRow
        title="Course Level"
        value={
          courseDetailDataPayload?.selectedCourseLevelObj?.courseLevelName ||
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
      <Table
        columns={TABLE_COLUMNS}
        data={classData?.data}
        rowKey={(data: IClassData) => data?.id}
        identifier={'id'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        loading={isLoading}
        checkbox
        onSelectAll={onSelectAll}
        onChange={onChange}
        setIsFetch={setIsFetch}
      />

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
          <Button type="primary" block ghost onClick={handleBackBtn}>
            Back
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default FormStepCourseClass
