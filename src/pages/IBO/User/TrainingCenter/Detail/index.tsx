// @ts-nocheck
import { Button, Col, Flex, Row } from 'antd'
import Card from 'antd/es/card/Card'
import useTrainingCenterUserController from '../controller/useTrainingCenterController'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import Spacer from 'src/components/view/Spacer'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import moment from 'moment'
import { DATETIME_FORMATTER_ENUM } from 'src/enums/enums'
import { useApp } from 'src/context/app.context'
import tableStyles from 'src/components/table/index.module.scss'
import { appColors } from 'src/assets/styles/styles'
import { RiLockPasswordLine } from 'react-icons/ri'
import { FiEdit } from 'react-icons/fi'
import ModalChangePassword from '../components/ModalChangePassword'
import { ColumnsType } from 'antd/es/table'
import { IUserTrainingCenterUserListData } from 'src/models/user.model'
import Table from 'src/components/table/Table'
import useTrainingCenterUserListController from '../controller/useTrainingCenterUserListController'

const TABLE_COLUMNS: ColumnsType<IUserTrainingCenterUserListData> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (data) => data || '-',
  },
  {
    title: 'User Name',
    dataIndex: 'username',
    key: 'username',
    render: (data) => data || '-',
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '250px',
    ellipsis: true,
    render: (data) =>
      moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime),
  },
  {
    title: 'Edited At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: '250px',
    ellipsis: true,
    render: (data) =>
      moment(data).format(DATETIME_FORMATTER_ENUM?.primaryWithTime),
  },
]

const TrainingCenterUserDetail = () => {
  const params = useParams()
  const navigate = useNavigate()

  const { onSetBreadcrumbs } = useApp()

  const { detailData, onRefetchDetail } = useTrainingCenterUserController()

  const {
    isSubmitted,
    onRefetchUserList,
    usersData,
    isLoadingUserList,
    userListQueryParams,
    setUserListQueryParams,
    setIsFetch,
    isFetch,
    formErrorMsg,
    onSetFormErrorMsg,
    isModalUpdatePasswordVisible,
    handleModalUpdatePasswordVisibility,
    onSetSelectedData,
    onHandleSubmitChangePassword,
  } = useTrainingCenterUserListController()

  useEffect(() => {
    if (isFetch) onRefetchUserList(params?.id)
  }, [isFetch])

  useEffect(() => {
    onSetBreadcrumbs([
      { title: 'Training Center Users', path: '/user/training-center' },
      {
        title: 'Training Center User Detail',
        path: `/user/training-center/${params?.id}`,
      },
    ])
    onRefetchDetail(params?.id)
    onRefetchUserList(params?.id)
  }, [params?.id])

  const _onRenderActionTableBtn = (record: IUserTrainingCenterUserListData) => {
    return (
      <Button
        onClick={() => {
          onSetSelectedData(record)
          handleModalUpdatePasswordVisibility()
        }}
        block
        className={tableStyles.actionColumnDetailBtn}>
        <Flex align="center" justify="center">
          <RiLockPasswordLine size={16} color={appColors?.blue70} />
          <Spacer margin="auto 2px" />
          <div className={tableStyles?.actionColumnDetailTxt}>
            Change Password
          </div>
        </Flex>
      </Button>
    )
  }

  return (
    <>
      <Row>
        <Col xs={24}>
          <Card>
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={18}>
                <div className={'detail-title'}>
                  {detailData?.trainingCenterName || '-'}
                </div>
              </Col>
              <Col xs={24} sm={6}>
                <Flex justify="end">
                  <Button
                    onClick={() => {
                      navigate(`/user/training-center/edit/${params?.id}`)
                    }}
                    block
                    className={tableStyles.actionColumnDetailBtn}>
                    <Flex align="center" justify="center">
                      <FiEdit size={16} color={appColors?.blue70} />
                      <Spacer margin="auto 2px" />
                      <div className={tableStyles?.actionColumnDetailTxt}>
                        Edit
                      </div>
                    </Flex>
                  </Button>
                </Flex>
              </Col>
            </Row>
            <Spacer margin={'1rem'} />

            <DetailRow
              title={'Training Center Number'}
              value={detailData?.trainingCenterNumber || '-'}
            />

            <DetailRow
              title={'Training Center Owner'}
              value={detailData?.trainingCenterOwnerName || '-'}
            />
            <DetailRow
              title={'Training Center Email'}
              value={detailData?.trainingCenterEmail || '-'}
            />

            <DetailRow
              title={'Training Center Phone Number'}
              value={detailData?.trainingCenterPhoneNumber || '-'}
            />

            <DetailRow
              title={'Training Center Address'}
              value={detailData?.trainingCenterAddress || '-'}
            />

            <DetailRow
              title={'Created At'}
              value={
                detailData?.createdAt
                  ? moment(detailData?.createdAt)?.format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />

            <DetailRow
              title={'Edited At'}
              value={
                detailData?.updatedAt
                  ? moment(detailData?.updatedAt)?.format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />
          </Card>
        </Col>
      </Row>

      <Spacer margin={'1rem auto'} />

      <Table
        loading={isLoadingUserList}
        columns={TABLE_COLUMNS}
        data={usersData?.data}
        isAction
        onRenderAction={(record: IUserTrainingCenterUserListData) =>
          _onRenderActionTableBtn(record)
        }
        rowKey={(data: IUserTrainingCenterUserListData) => data?.id}
        identifier={'id'}
        queryParams={userListQueryParams}
        setQueryParams={setUserListQueryParams}
        setIsFetch={setIsFetch}
        allowEdit={true}
      />

      {isModalUpdatePasswordVisible ? (
        <ModalChangePassword
          isVisible={isModalUpdatePasswordVisible}
          handleClose={handleModalUpdatePasswordVisibility}
          isSubmitted={isSubmitted}
          formErrorMsg={formErrorMsg}
          onSetFormErrorMsg={onSetFormErrorMsg}
          onSubmit={onHandleSubmitChangePassword}
        />
      ) : null}
    </>
  )
}

export default TrainingCenterUserDetail
