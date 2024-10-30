// @ts-nocheck
import Search from 'antd/es/input/Search'
import React, { ReactNode } from 'react'

interface ISearchProps {
  allowClear?: boolean
  placeholder?: string
  onSearch: (e: any) => void
  style?: any
  enterButton?: boolean | ReactNode
  loading?: boolean
}

const SearchInput = ({
  allowClear = true,
  placeholder,
  onSearch,
  style,
  enterButton,
  loading = false,
}: ISearchProps) => {
  return (
    <Search
      allowClear={allowClear}
      enterButton={enterButton}
      placeholder={placeholder}
      onSearch={onSearch}
      style={style}
      className="antd-custom-input"
      loading={loading}
    />
  )
}

export default SearchInput
