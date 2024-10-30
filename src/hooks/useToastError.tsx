import { useEffect } from 'react'
import { useApp } from 'src/context/app.context'

export default function useToastError(error: unknown, errorTitle: string) {
  const { notify } = useApp()
  useEffect(() => {
    if (error) {
      notify?.error({
        message: errorTitle,
        description: (error as any).message,
      })
    }
  }, [error, errorTitle])
}
