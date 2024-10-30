import { InputProps } from 'antd'
import React, { useId } from 'react'
import { cn } from 'src/helpers/class-names'

export default function FormWrapper({
  className,
  label,
  children,
  required,
  error,
}: {
  className?: string
  children: (props: {
    id: string
    status: InputProps['status']
  }) => React.ReactNode
  label: string
  required?: boolean
  error?: string
}) {
  const id = useId()
  return (
    <div className={cn('flex flex-col', className)}>
      <label htmlFor={id} className="text-sm mb-2">
        {required ? (
          <span
            className="text-red-500"
            style={{ fontFamily: 'SimSun,sans-serif' }}>
            *
          </span>
        ) : (
          ''
        )}{' '}
        {label}
      </label>
      {children({ id, status: error ? 'error' : undefined })}
      {error ? (
        <span className="text-xs text-red-500 mt-0.5">{error}</span>
      ) : (
        <span className="pointer-events-none opacity-0 text-xs mt-0.5">
          helper text
        </span>
      )}
    </div>
  )
}
