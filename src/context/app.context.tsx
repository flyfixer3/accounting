// @ts-nocheck
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { notification } from 'antd'
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { NotificationInstance } from 'antd/es/notification/interface'
import { createContext, useContext, useState } from 'react'

interface IAppData {
  breadcrumbs?: []
  onSetBreadcrumbs?: (e: BreadcrumbItemType[]) => void
  notify?: NotificationInstance
}

export interface IAppProviderProps {
  children?: any
}

const AppContext = createContext<IAppData | undefined>(undefined)

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AuthProvider')
  }
  return context
}

export const AppProvider: React.FC<IAppProviderProps> = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<[]>([])
  const [notify, contextHolder] = notification.useNotification()
  const [queryClient] = useState(() => new QueryClient())

  const onSetBreadcrumbs = (list: []) => {
    setBreadcrumbs(list)
  }

  const appData: IAppData = {
    breadcrumbs,
    onSetBreadcrumbs,
    notify,
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={appData}>
        {contextHolder}
        {children}
      </AppContext.Provider>
    </QueryClientProvider>
  )
}
