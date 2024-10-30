// @ts-nocheck
import { Table as ANTDTable, Col, Row } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import SpinFC from 'antd/es/spin'
import { ColumnsType, TableProps } from 'antd/es/table'
import React, { ReactNode, useMemo } from 'react'
import useWrapInRef from 'src/hooks/useWrapInRef'
import ActionColumn from './ActionColumn'

interface ITableProps extends Pick<TableProps, 'expandable'> {
  data: any
  columns: ColumnsType<any>
  onSelectAll?: (e: boolean, selectedRows: any[]) => void
  onSelect?: (record: any, selected: any, selectedRows: any) => void
  onChange?: (e: number[], selectedRows: any[]) => void
  onRow?: (record: any) => {
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
    onDoubleClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
    // Add other row-related properties as needed
  }
  selectedRowKeys?: string[] | number[]
  loading: boolean
  queryParams?: { page: number; limit: number; totalData?: number }
  setQueryParams?: any
  refetch?: () => {}
  pagination?: any
  checkbox?: boolean
  rowClassName?: (record: any, index: number) => string
  rowKey: (record: any) => number | string
  getCheckboxProps?: (record: any) => {}
  scrollToFirstRowOnChange?: boolean
  onDetail?: (e: number | string, record: any) => void
  onEdit?: (e: number | string, record: any) => void
  onDelete?: (e: number | string, record: any) => void
  onPurchase?: (e: number | string, record: any) => void
  onStockDetail?: (e: number | string, record: any) => void
  isAction?: boolean
  identifier: string
  allowEdit?: boolean
  allowDelete?: boolean
  allowPurchase?: boolean
  onEditDisabled?: (record: any) => boolean
  onDeleteDisabled?: (record: any) => boolean
  onDetailDisabled?: (record: any) => boolean
  onPurchaseDisabled?: (record: any) => boolean
  actionWidth?: number
  onRenderAction?: (record: any) => ReactNode
  setIsFetch?: () => void
  showHeader?: boolean
  size?: SizeType
}

const Table: React.FC<ITableProps> = ({
  data,
  columns,
  onSelectAll,
  onSelect,
  onChange,
  onRow,
  selectedRowKeys,
  loading,
  queryParams,
  setQueryParams,
  refetch,
  pagination = {},
  checkbox = false,
  rowClassName,
  rowKey,
  getCheckboxProps,
  scrollToFirstRowOnChange,
  onDetail,
  onEdit,
  onDelete,
  onPurchase,
  onStockDetail,
  isAction,
  identifier,
  allowEdit,
  allowDelete,
  allowPurchase,
  onEditDisabled,
  onDeleteDisabled,
  onDetailDisabled,
  onPurchaseDisabled,
  actionWidth,
  onRenderAction,
  setIsFetch,
  showHeader,
  size = 'large',
  expandable,
}) => {
  const onEditRef = useWrapInRef(onEdit)
  const tableColumns = useMemo(() => {
    const newColumns = [...columns]
    if (
      isAction &&
      (allowEdit || allowDelete || onDetail || onPurchase || onRenderAction)
    ) {
      newColumns.push({
        title: 'Action',
        width: actionWidth,
        render: onRenderAction
          ? (text: string, record: any) => onRenderAction(record)
          : (text: string, record: any) => {
              let isEditDisabled: boolean = false
              let isDeleteDisabled: boolean = false
              let isDetailDisabled: boolean = false
              let isPurchaseDisabled: boolean = false

              if (onEditDisabled) {
                const handleEditDisabled = (): boolean => {
                  return onEditDisabled(record)
                }
                isEditDisabled = handleEditDisabled()
              }

              if (onDeleteDisabled) {
                const handleDeleteDisabled = (): boolean => {
                  return onDeleteDisabled(record)
                }
                isDeleteDisabled = handleDeleteDisabled()
              }

              if (onDetailDisabled) {
                const handleDetailDisabled = (): boolean => {
                  return onDetailDisabled(record)
                }
                isDetailDisabled = handleDetailDisabled()
              }

              if (onPurchaseDisabled) {
                const handlePurchaseDisabled = (): boolean => {
                  return onPurchaseDisabled(record)
                }
                isPurchaseDisabled = handlePurchaseDisabled()
              }

              return (
                <ActionColumn
                  record={record}
                  onDetail={onDetail}
                  onDelete={onDelete}
                  onEdit={(...params) => onEditRef.current(...params)}
                  onPurchase={onPurchase}
                  onStockDetail={onStockDetail}
                  identifier={identifier}
                  allowEdit={allowEdit}
                  allowDelete={allowDelete}
                  allowPurchase={allowPurchase}
                  editDisabled={isEditDisabled}
                  deleteDisabled={isDeleteDisabled}
                  detailDisabled={isDetailDisabled}
                  purchaseDisabled={isPurchaseDisabled}
                />
              )
            },
      })
    }
    return newColumns
  }, [columns, identifier, allowDelete, allowEdit])

  const paginationOptions = {
    total: queryParams?.totalData || 0,
    defaultPageSize: 20,
    pageSizeOptions: [20, 30, 50, 100],
    showSizeChanger: false,
    current: queryParams?.page || 1,
    onChange: (page: number, pageSize: number) => {
      setQueryParams({ ...queryParams, page: page, limit: pageSize })
      setIsFetch && setIsFetch()
    },
  }

  const rowSelection = {
    selectedRowKeys,
    onChange,
    onSelectAll,
    onSelect,
    preserveSelectedRowKeys: true,
    getCheckboxProps,
  }

  const loadingIndicator = {
    spinning: loading,
    indicator: <SpinFC size={'default'} />,
  }

  const scrollIndicator = {
    scrollToFirstRowOnChange,
  }

  const getRowKey = (data?: any) => {
    return data?.id
  }

  return (
    <Row>
      <Col xs={24}>
        <ANTDTable
          expandable={expandable}
          size={size}
          showHeader={showHeader}
          loading={loadingIndicator}
          rowSelection={checkbox && rowSelection}
          columns={tableColumns}
          dataSource={data}
          rowKey={rowKey ? rowKey : getRowKey}
          pagination={
            pagination ? { ...paginationOptions, ...pagination } : false
          }
          onRow={onRow}
          rowClassName={rowClassName}
          scroll={scrollIndicator}
          tableLayout="auto"
        />
      </Col>
    </Row>
  )
}

export default Table
