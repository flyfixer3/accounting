// @ts-nocheck
import { IStudentRegistrationDetailResponse } from 'src/models/student-registration.model'
import React, { useEffect } from 'react'
import Modal from 'antd/es/modal/Modal'
import Table from 'src/components/table/Table'
import { ColumnsType } from 'antd/es/table'
import { ICourseLevelUpHistoryResponse } from 'src/models/course.model'
import StatusBadge from 'src/components/view/StatusBadge'
import useStudentCourseHistoryController from '../controller/useStudentCourseHistoryController'

interface IModalCourseHistoryProps {
  isVisible: boolean
  handleClose: () => void
  selectedData: IStudentRegistrationDetailResponse
}

const TABLE_COLUMNS: ColumnsType<ICourseLevelUpHistoryResponse> = [
  {
    title: 'Course',
    render: (text, record, index) => record?.course?.courseName || '-',
  },
  {
    title: 'Course Level',
    render: (text, record, index) =>
      record?.courseLevel?.courseLevelName || '-',
  },
  {
    title: 'Score',
    key: 'score',
    dataIndex: 'score',
    render: (data) => data || '-',
  },
  {
    title: 'Status',
    render: (text, record, index) => {
      return <StatusBadge status={record?.status} />
    },
    align: 'center',
  },
]

const ModalCourseHistory: React.FC<IModalCourseHistoryProps> = ({
  isVisible,
  handleClose,
  selectedData,
}) => {
  const { data, isLoading, onRefetch } = useStudentCourseHistoryController()

  useEffect(() => {
    if (selectedData) {
      onRefetch(
        selectedData?.student?.id,
        selectedData?.studentCourseDetail?.course?.id,
      )
    }
  }, [selectedData])

  return (
    <>
      <Modal
        open={isVisible}
        onCancel={handleClose}
        maskClosable={false}
        footer={null}
        width={500}
        title={'Course History'}>
        <Table
          data={data}
          loading={isLoading}
          columns={TABLE_COLUMNS}
          pagination={null}
          rowKey={(data: ICourseLevelUpHistoryResponse) => data?.id}
          identifier={'id'}
          checkbox={false}
          isAction={false}
        />
      </Modal>
    </>
  )
}

export default ModalCourseHistory
