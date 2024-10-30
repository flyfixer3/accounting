// @ts-nocheck
import { useApp } from 'src/context/app.context'

const useBooksAddController = () => {
  const { onSetBreadcrumbs } = useApp()
  return {
    onSetBreadcrumbs,
  }
}

export default useBooksAddController
