// @ts-nocheck
import { Button, Flex, MenuProps } from 'antd'
import Dropdown from 'antd/es/dropdown/dropdown'
import {
  FiEdit,
  FiEye,
  FiMoreHorizontal,
  FiShoppingBag,
  FiTrash2,
} from 'react-icons/fi'
import { appColors } from 'src/assets/styles/styles'

import 'src/assets/styles/styles'
import Spacer from '../view/Spacer'
import styles from './index.module.scss'

interface IActionColumn {
  record: any
  onDetail?: (e: string, record: any) => void
  onEdit?: (e: string, record: any) => void
  onDelete?: (e: string, record: any) => void
  onPurchase?: (e: string, record: any) => void
  onStockDetail?: (e: string, record: any) => void
  identifier: string
  allowEdit: boolean
  allowDelete: boolean
  allowPurchase: boolean
  editDisabled?: boolean
  deleteDisabled?: boolean
  detailDisabled?: boolean
  purchaseDisabled?: boolean
}

const ActionColumn = ({
  record,
  onDetail,
  onEdit,
  onDelete,
  onPurchase,
  onStockDetail,
  identifier,
  allowDelete = false,
  allowEdit = false,
  allowPurchase = false,
  editDisabled = false,
  deleteDisabled = false,
  detailDisabled = false,
  purchaseDisabled = false,
}: IActionColumn) => {
  const dropdownMenuItems: MenuProps['items'] = []

  if (onEdit && allowEdit) {
    dropdownMenuItems.push({
      style: { backgroundColor: editDisabled ? appColors?.neutral20 : '' },
      label: (
        <Flex
          onClick={() =>
            editDisabled ? {} : onEdit(record[identifier], record)
          }
          align="center"
          className={styles.actionColumnDetailWrapper}>
          <FiEdit
            size={14}
            color={editDisabled ? appColors?.neutral50 : appColors?.blue70}
          />
          <div
            className={[
              styles?.actionColumnDetailTxt,
              editDisabled ? styles?.actionColumnDetailTxtDisabled : '',
            ].join(' ')}>
            Edit
          </div>
        </Flex>
      ),
      disabled: editDisabled,
      key: 'edit',
    })
  }

  if (onDelete && allowDelete) {
    dropdownMenuItems.push({
      style: { backgroundColor: deleteDisabled ? appColors?.neutral20 : '' },
      label: (
        <Flex
          align="center"
          onClick={() =>
            deleteDisabled ? {} : onDelete(record[identifier], record)
          }>
          <FiTrash2
            size={14}
            color={deleteDisabled ? appColors?.neutral50 : appColors?.red70}
          />
          <div
            className={[
              styles?.actionColumnDetailTxt,
              'text-color-error',
              deleteDisabled ? styles?.actionColumnDetailTxtDisabled : '',
            ].join(' ')}>
            Delete
          </div>
        </Flex>
      ),
      disabled: deleteDisabled,
      key: 'delete',
    })
  }

  return (
    <>
      <Flex>
        {onDetail ? (
          <Button
            className={[
              styles?.actionColumnDetailBtn,
              detailDisabled ? styles?.actionColumnDetailBtnDisabled : '',
            ].join(' ')}
            onClick={() =>
              detailDisabled ? {} : onDetail(record[identifier], record)
            }
            disabled={detailDisabled}>
            <Flex align="center" justify="center">
              <FiEye
                size={16}
                color={
                  detailDisabled ? appColors?.neutral40 : appColors?.blue70
                }
              />
              <Spacer margin="auto 2px" />
              <div
                className={[
                  styles?.actionColumnDetailTxt,
                  detailDisabled ? styles?.actionColumnDetailTxtDisabled : '',
                ].join('')}>
                Detail
              </div>
            </Flex>
          </Button>
        ) : null}

        {onStockDetail ? (
          <Button
            style={{ marginLeft: '0.5rem' }}
            className={[styles?.actionColumnDetailBtn].join(' ')}
            onClick={() => onStockDetail(record[identifier], record)}
            disabled={detailDisabled}>
            <Flex align="center" justify="center">
              <FiEye size={16} color={appColors?.blue70} />
              <Spacer margin="auto 2px" />
              <div className={[styles?.actionColumnDetailTxt].join('')}>
                Stock History
              </div>
            </Flex>
          </Button>
        ) : null}

        {onPurchase ? (
          <Button
            className={[
              styles?.actionColumnDetailBtn,
              purchaseDisabled ? styles?.actionColumnDetailBtnDisabled : '',
            ].join(' ')}
            style={{ marginLeft: '0.5rem' }}
            onClick={() =>
              purchaseDisabled ? {} : onPurchase(record[identifier], record)
            }
            disabled={purchaseDisabled}>
            <Flex align="center" justify="center">
              <FiShoppingBag
                size={16}
                color={
                  purchaseDisabled ? appColors?.neutral40 : appColors?.blue70
                }
              />
              <Spacer margin="auto 2px" />
              <div
                className={[
                  styles?.actionColumnDetailTxt,
                  purchaseDisabled ? styles?.actionColumnDetailTxtDisabled : '',
                ].join('')}>
                Purchase
              </div>
            </Flex>
          </Button>
        ) : null}

        {(onEdit && allowEdit) || (onDelete && allowDelete) ? (
          <Dropdown placement="bottomRight" menu={{ items: dropdownMenuItems }}>
            <div className={styles?.moreActionWrapper}>
              <FiMoreHorizontal color={appColors?.blue70} />
            </div>
          </Dropdown>
        ) : null}
      </Flex>
    </>
  )
}
export default ActionColumn
