import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Button, DatePicker, Input, InputNumber, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import axios from 'axios'
import dayjs from 'dayjs'
import { Fragment, useMemo } from 'react'
import {
  Controller,
  useFieldArray,
  useForm,
  UseFormReturn,
} from 'react-hook-form'
import { FaRegTrashAlt } from 'react-icons/fa'
import FormWrapper from 'src/components/input/FormWrapper'
import { useApp } from 'src/context/app.context'
import { cn } from 'src/helpers/class-names'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import useToastError from 'src/hooks/useToastError'
import { BASE_URL } from 'src/services/api.service'
import { z } from 'zod'
import SubaccountSelect, {
  useSubaccounts,
} from '../components/SubaccountSelect'
import { AccountingTransaction } from '../types'
import { useNavigate } from 'react-router-dom'

const schema = z.object({
  id: z.number().optional(),
  date: z.date(),
  label: z.string().min(1),
  description: z.string(),
  details: z.array(
    z.object({
      id: z.number().optional(),
      subaccountId: z.number(),
      amount: z.number().gt(0),
      type: z.literal('debit').or(z.literal('credit')),
    }),
  ),
})

export default function AddTransactionsForm({
  transaction,
}: {
  transaction?: AccountingTransaction
}) {
  const navigate = useNavigate()
  const { notify } = useApp()
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: transaction?.date ? new Date(transaction?.date) : new Date(),
      label: transaction?.label ?? '',
      description: transaction?.description ?? '',
      details: transaction?.details.map((detail) => ({
        amount: detail.amount,
        subaccountId: detail.subaccount.id,
        type: detail.type,
        id: detail.id,
      })) ?? [
        { amount: 0, subaccountId: undefined as any, type: 'debit' },
        { amount: 0, subaccountId: undefined as any, type: 'credit' },
      ],
    },
  })

  const { data: subaccounts } = useSubaccounts()
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      await axios.post(`${BASE_URL}/accounting/transactions`, data)
    },
    onSuccess: () => {
      form.reset()
      notify?.success({
        message: 'Success',
        description: 'Transaction saved successfully',
        duration: 5,
      })
      navigate('/accounting/transactions')
    },
  })
  useToastError(error, 'Error adding transaction')

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        const debitAccounts = new Set<number>()
        const creditAccounts = new Set<number>()
        const duplicate = data.details.find((el) => {
          if (el.type === 'debit') {
            if (debitAccounts.has(el.subaccountId)) return true
            debitAccounts.add(el.subaccountId)
          } else if (el.type === 'credit') {
            if (creditAccounts.has(el.subaccountId)) return true
            creditAccounts.add(el.subaccountId)
          }
          return false
        })
        if (duplicate) {
          const duplicateSubaccount = subaccounts?.find(
            (el) => el.id === duplicate?.subaccountId,
          )
          notify?.error({
            message: 'Error',
            description: `Duplicate account ${`(${duplicateSubaccount?.account_number}-${duplicateSubaccount?.subaccount_number}) ${duplicateSubaccount?.subaccount_name}`} in ${duplicate?.type}`,
            duration: 5,
          })
        }

        let totalDebit = 0
        let totalCredit = 0
        data.details.forEach((el) => {
          if (el.type === 'debit') totalDebit += el.amount
          if (el.type === 'credit') totalCredit += el.amount
        })
        if (totalDebit !== totalCredit) {
          notify?.error({
            message: 'Error',
            description: 'Total debit and credit must be equal',
            duration: 5,
          })
          return
        }

        mutate({ ...data, id: transaction?.id })
      })}
      className={cn('flex flex-col gap-2')}>
      <Controller
        name="label"
        control={form.control}
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <FormWrapper label="Label" required error={fieldState.error?.message}>
            {({ id, status }) => <Input status={status} id={id} {...field} />}
          </FormWrapper>
        )}
      />
      <Controller
        name="description"
        control={form.control}
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <FormWrapper label="Description" error={fieldState.error?.message}>
            {({ id, status }) => (
              <TextArea status={status} id={id} {...field} />
            )}
          </FormWrapper>
        )}
      />
      <Controller
        name="date"
        control={form.control}
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <FormWrapper
            label="Transaction Date"
            required
            error={fieldState.error?.message}>
            {({ id, status }) => (
              <DatePicker
                showTime
                status={status}
                format={'YYYY-MM-DD, HH:mm'}
                id={id}
                name={field.name}
                disabled={field.disabled}
                value={dayjs(field.value)}
                onChange={(value) => field.onChange(value?.toDate())}
              />
            )}
          </FormWrapper>
        )}
      />
      <DetailsForm form={form} />
      <Button
        loading={isPending}
        type="primary"
        htmlType="submit"
        className="mt-6"
        size="large">
        Submit Transaction
      </Button>
    </form>
  )
}

function DetailsForm({
  form,
}: {
  form: UseFormReturn<z.infer<typeof schema>>
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'details',
  })

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, index) => (
        <div
          className="grid grid-cols-[3fr_1fr_1fr_max-content] items-center gap-2"
          key={field.id}>
          <Controller
            name={`details.${index}.subaccountId`}
            control={form.control}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <FormWrapper
                label="Account"
                required
                error={fieldState.error?.message}>
                {({ id, status }) => (
                  <SubaccountSelect status={status} id={id} {...field} />
                )}
              </FormWrapper>
            )}
          />
          <Controller
            name={`details.${index}.amount`}
            control={form.control}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <FormWrapper
                label="Amount"
                required
                error={fieldState.error?.message}>
                {({ id, status }) => (
                  <InputNumber
                    status={status}
                    className="w-full"
                    id={id}
                    {...field}
                  />
                )}
              </FormWrapper>
            )}
          />
          <Controller
            name={`details.${index}.type`}
            control={form.control}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <FormWrapper
                label="Type"
                required
                error={fieldState.error?.message}>
                {({ id, status }) => (
                  <Select
                    status={status}
                    options={[
                      { label: 'Debit', value: 'debit' },
                      { label: 'Credit', value: 'credit' },
                    ]}
                    id={id}
                    {...field}
                  />
                )}
              </FormWrapper>
            )}
          />
          <Button
            className="flex-shrink-0 !w-8 !h-8 relative top-1"
            onClick={() => remove(index)}
            icon={<FaRegTrashAlt />}
            shape="circle"
            danger
          />
        </div>
      ))}
      <Button
        type="dashed"
        className="mt-4"
        onClick={() =>
          append({
            amount: 0,
            subaccountId: undefined as any,
            type: undefined as any,
          })
        }>
        + Add more detail
      </Button>
      <div className="mt-4">
        <Preview form={form} />
      </div>
    </div>
  )
}

function Preview({ form }: { form: UseFormReturn<z.infer<typeof schema>> }) {
  const details = form.watch('details')
  const { data: subaccounts } = useSubaccounts()
  const subaccountMap = useMemo(() => {
    const map = new Map<number, string>()
    subaccounts?.forEach((el) => {
      map.set(el.id, `(${el.subaccount_number}) ${el.subaccount_name}`)
    })
    return map
  }, [subaccounts])

  let totalDebit = 0
  let totalCredit = 0

  return (
    <div className="flex flex-col gap-4">
      <span className="text-xl font-medium">Transaction Preview</span>
      <div className="grid grid-cols-[3fr_1fr_1fr]">
        <p className="font-medium">Account</p>
        <p className="font-medium">Debit</p>
        <p className="font-medium">Credit</p>
        {details.map((detail, index) => {
          if (detail.type === 'debit') totalDebit += detail.amount
          if (detail.type === 'credit') totalCredit += detail.amount
          return (
            <Fragment key={index}>
              <p>{subaccountMap.get(detail.subaccountId)}</p>
              {detail.type === 'debit' ? (
                <p>{moneyFormatter(detail.amount)}</p>
              ) : (
                <p />
              )}
              {detail.type === 'credit' ? (
                <p>{moneyFormatter(detail.amount)}</p>
              ) : (
                <p />
              )}
            </Fragment>
          )
        })}
        <p
          className={cn(
            'font-medium',
            totalDebit !== totalCredit && 'text-red-500',
          )}>
          Total
        </p>
        <p
          className={cn(
            'font-medium',
            totalDebit !== totalCredit && 'text-red-500',
          )}>
          {moneyFormatter(totalDebit)}
        </p>
        <p
          className={cn(
            'font-medium',
            totalDebit !== totalCredit && 'text-red-500',
          )}>
          {moneyFormatter(totalCredit)}
        </p>
      </div>
    </div>
  )
}
