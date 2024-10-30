// @ts-nocheck
import { PDFDownloadLink } from '@react-pdf/renderer'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Col, Flex, Row, Select } from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { appColors } from 'src/assets/styles/styles'
import SearchInput from 'src/components/input/Search'
import Table from 'src/components/table/Table'
import TableHeader from 'src/components/table/TableHeader'
import CardStatistic from 'src/components/view/CardStatistic/CardStatistic'
import Spacer from 'src/components/view/Spacer'
import { useApp } from 'src/context/app.context'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import useToastError from 'src/hooks/useToastError'
import { ISalaryListPayload } from 'src/models/salary.model'
import { ITeacherTableData } from 'src/models/teacher.model'
import {
  fetchSalaryList,
  generatePayslip,
  updateSalaryPayment,
} from 'src/services/salary.service'
import ModalUpdatePayment from './components/ModalUpdateSalaryPayment'
import PayslipPdf from './components/PayslipPdf'
import SalaryCheckerModal from './components/SalaryCheckerModal'
import SalaryStatusBadge from './components/SalaryStatusBadge'

const APP_START_YEAR = 2023
const CUTOFF_DAY = 28
const MONTHS = Array.from({ length: 12 }).map((_, i) => ({
  value: moment().month(i).get('month') + 1,
  label: moment().month(i).format('MMMM'),
}))

const Salary: React.FC = () => {
  const [isOpenUpdatePayment, setIsOpenUpdatePayment] = useState(false)
  const [selectedTeacher, setSelectedTeacher] =
    useState<ITeacherTableData>(null)
  const [formErrorMsg, setFormErrorMsg] = useState('')

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const { onSetBreadcrumbs, notify } = useApp()
  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'Salary',
        path: '/salary',
      },
    ])
  }, [])

  const isThisMonthSalaryPayable = moment().day() >= CUTOFF_DAY
  const defaultFilterDate = isThisMonthSalaryPayable
    ? moment()
    : moment().subtract(1, 'months')

  const years = Array.from({
    length: new Date().getFullYear() - APP_START_YEAR,
  })
  const months = MONTHS.slice(0, defaultFilterDate.get('month') + 1)

  const [queryParams, setQueryParams] = useState<ISalaryListPayload>({
    page: 1,
    limit: 20,
    search: '',
    month: defaultFilterDate.get('month') + 1,
    year: defaultFilterDate.get('year'),
    status: 'all',
  })

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['salaries', queryParams],
    queryFn: () => fetchSalaryList(queryParams),
  })
  const salaries = data?.data

  const { mutate, isPending, error } = useMutation({
    mutationFn: generatePayslip,
    onSuccess: () => {
      refetch()
      setSelectedRowKeys([])
    },
  })
  useToastError(error, 'Failed to generate payslip')

  const [isOpenModal, setIsOpenModal] = useState(false)

  const getCurrentSalary = (record: ITeacherTableData) => {
    const salary = record.teacherSalaries.find(
      (salary) =>
        parseInt(salary.month) === queryParams.month &&
        parseInt(salary.year) === queryParams.year,
    )
    return salary
  }
  const TABLE_COLUMNS: ColumnsType<ITeacherTableData> = [
    {
      title: 'Number',
      dataIndex: 'teacherNumber',
      key: 'teacherNumber',
      render: (data) => data || '-',
    },
    {
      title: 'Email',
      dataIndex: 'teacherEmail',
      key: 'teacherEmail',
      render: (data) => data || '-',
    },
    {
      title: 'Phone Number',
      dataIndex: 'teacherPhoneNumber',
      key: 'teacherPhoneNumber',
      render: (data) => data || '-',
    },
    {
      title: 'Name',
      dataIndex: 'teacherName',
      key: 'teacherName',
      width: '250px',
      ellipsis: true,
      render: (data) => data || '-',
    },
    {
      title: 'Join Date',
      dataIndex: 'teacherJoinDate',
      key: 'teacherJoinDate',
      width: '250px',
      ellipsis: true,
      render: (data) =>
        data ? moment(data)?.format(DATETIME_FORMATTER_ENUM?.primary) : '-',
    },
    {
      title: 'Course',
      width: '250px',
      ellipsis: true,
      render: (text, record, index) => {
        return `${record?.teacherCourse?.courseName} - ${record?.teacherCourse?.courseLevelName}`
      },
    },
    {
      title: 'Education',
      render: (text, record, index) => {
        return `${record?.teacherEducation?.name}`
      },
    },
    {
      title: 'Base Salary',
      render: (text, record, index) => {
        const salary = getCurrentSalary(record)
        if (!salary) return '-'
        return (
          <div style={{ width: '125px' }}>
            {moneyFormatter(parseInt(salary?.base_salary))}
          </div>
        )
      },
    },
    {
      title: 'Commission',
      render: (text, record, index) => {
        const salary = getCurrentSalary(record)
        if (!salary) return '-'
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              width: '200px',
            }}>
            <span>{moneyFormatter(parseInt(salary?.commission))}</span>
            <span style={{ fontSize: '14px', color: appColors.neutral50 }}>
              Prev month students:{' '}
              {parseInt(salary?.prev_total_students + '' || '0') ?? 0}
              <br />
              Current total students:{' '}
              {parseInt(salary?.total_students + '' || '0') ?? 0}
            </span>
          </div>
        )
      },
    },
    {
      title: 'Salary Status',
      key: 'salaryStatus',
      render: (data, record) => {
        const salary = getCurrentSalary(record)
        let status = 'pending'
        if (salary) {
          status = 'confirmed'
          if (salary.subaccount_id) {
            status = 'paid'
          }
        }
        return <SalaryStatusBadge status={status} />
      },
    },
    {
      title: 'Confirmed At',
      width: '250px',
      ellipsis: true,
      render: (data, record) => {
        const salary = getCurrentSalary(record)
        if (!salary) return '-'
        return moment(salary?.created_at).format(
          DATETIME_FORMATTER_ENUM?.primary,
        )
      },
    },
    {
      title: 'Paid At',
      width: '250px',
      ellipsis: true,
      render: (data, record) => {
        const salary = getCurrentSalary(record)
        if (!salary || salary.updated_at === salary.created_at) return '-'
        return moment(salary?.updated_at).format(
          DATETIME_FORMATTER_ENUM?.primary,
        )
      },
    },
  ]

  const teachersThatJoinedThisMonth =
    salaries?.data.filter((teacher) => {
      return (
        moment(dayjs(teacher.teacherJoinDate).toDate()).month() + 1 ===
          queryParams.month &&
        selectedRowKeys.includes(teacher.teacherNumber as unknown as number)
      )
    }) || []

  const { mutate: updateSalaryPaymentStatus, isSuccess } = useMutation({
    mutationFn: updateSalaryPayment,
    onSuccess: () => {
      refetch()
      setSelectedRowKeys([])
      setIsOpenUpdatePayment(false)
    },
  })

  return (
    <>
      <SalaryCheckerModal
        isOpen={isOpenModal}
        close={() => setIsOpenModal(false)}
        onSuccess={(data) =>
          mutate({
            ids: selectedRowKeys.map((teacherNumber) =>
              parseInt(teacherNumber + ''),
            ),
            month: queryParams.month,
            year: queryParams.year,
            baseSalariesOverrides: data,
          })
        }
        teachers={teachersThatJoinedThisMonth}
      />
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'Total Teacher'}
            value={salaries?.meta?.totalData || 0}
            active={queryParams.status === 'all'}
            isLoading={isLoading}
            onClick={() => {
              setQueryParams((prev) => ({
                ...prev,
                page: 1,
                status: 'all',
              }))
            }}
          />
        </Col>
        <Col xs={24} sm={8}>
          <CardStatistic
            title={'New Teacher'}
            value={salaries?.meta?.newTeacherCount || 0}
            active={queryParams.status === 'new'}
            isLoading={isLoading}
            onClick={() => {
              setQueryParams((prev) => ({
                ...prev,
                page: 1,
                status: 'new',
              }))
            }}
          />
        </Col>
      </Row>

      <Spacer margin={'1rem auto'} />

      <TableHeader
        actions={[
          {
            key: 'search',
            children: (
              <SearchInput
                placeholder="Search by Teacher Number and Name "
                onSearch={async (e: string) => {
                  setQueryParams({ ...queryParams, search: e })
                }}
              />
            ),
            column: 8,
          },
          {
            key: 'month',
            children: (
              <Select
                options={years.map((year) => ({
                  value: year,
                  label: year,
                }))}
                loading={isLoading}
                value={queryParams.year}
                onChange={(value) => {
                  setQueryParams((prev) => ({
                    ...prev,
                    year: parseInt(value.toString()),
                  }))
                }}
                placeholder="Year"
              />
            ),
            column: 3,
          },
          {
            key: 'year',
            children: (
              <Select
                options={months}
                loading={isLoading}
                value={queryParams.month}
                onChange={(value) => {
                  setQueryParams((prev) => ({
                    ...prev,
                    month: parseInt(value.toString()),
                  }))
                }}
                placeholder="Month"
              />
            ),
            column: 3,
          },
          {
            key: 'add',
            children: (
              <Flex justify="flex-end">
                <Button
                  loading={isPending}
                  type={'primary'}
                  onClick={() => {
                    if (selectedRowKeys.length === 0) {
                      notify.error({
                        message: 'Error',
                        description: 'Please select at least one teacher.',
                        duration: 5,
                      })
                      return
                    }
                    if (teachersThatJoinedThisMonth.length > 0) {
                      setIsOpenModal(true)
                      return
                    }
                    mutate({
                      ids: selectedRowKeys.map((teacherNumber) =>
                        parseInt(teacherNumber + ''),
                      ),
                      month: queryParams.month,
                      year: queryParams.year,
                    })
                  }}>
                  + Generate Slip
                </Button>
              </Flex>
            ),
            column: 10,
          },
        ]}
        totalData={salaries?.meta?.currentTotalData || 0}
      />

      <Spacer margin={'.5rem auto'} />

      <Table
        loading={isLoading}
        columns={TABLE_COLUMNS}
        data={salaries?.data}
        isAction
        selectedRowKeys={selectedRowKeys}
        onChange={(e) => setSelectedRowKeys(e)}
        checkbox
        onRenderAction={(record: ITeacherTableData) => {
          const salary = getCurrentSalary(record)
          if (!salary) return '-'
          return (
            <div style={{ display: 'flex', gap: '4px' }}>
              {!salary.subaccount_id && (
                <Button
                  type="primary"
                  onClick={() => {
                    setIsOpenUpdatePayment(true)
                    setSelectedTeacher(record)
                  }}>
                  Pay
                </Button>
              )}
              <PDFDownloadLink
                document={<PayslipPdf salary={salary} teacher={record} />}
                fileName={`payslip-${record.teacherNumber}-${record.teacherName}-${queryParams.month}-${queryParams.year}.pdf`}>
                {({ blob, url, loading, error }) => (
                  <Button type={'default'} loading={loading}>
                    Download Payslip
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
          )
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              setSelectedRowKeys((prev) => {
                if (prev.includes(record.teacherNumber)) {
                  return prev.filter((e) => e !== record.teacherNumber)
                }
                return [...prev, record.teacherNumber]
              })
            },
          }
        }}
        rowKey={(data: ITeacherTableData) => data?.teacherNumber}
        identifier={'teacherNumber'}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        allowEdit={true}
      />
      {selectedTeacher && (
        <ModalUpdatePayment
          isVisible={isOpenUpdatePayment}
          handleClose={() => setIsOpenUpdatePayment(false)}
          salary={getCurrentSalary(selectedTeacher)}
          teacher={selectedTeacher}
          formErrorMsg={formErrorMsg}
          isSubmitted={isSuccess}
          onSetFormErrorMsg={setFormErrorMsg}
          onHandleSubmitPayment={(e) =>
            updateSalaryPaymentStatus({
              salaryId: getCurrentSalary(selectedTeacher).id,
              payload: e,
            })
          }
        />
      )}
    </>
  )
}

export default Salary
