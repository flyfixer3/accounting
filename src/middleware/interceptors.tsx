// @ts-nocheck
import { notification } from 'antd'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { NavigateFunction } from 'react-router-dom'

export const requestInterceptors = async (getUserData) => {
  axios.defaults.withCredentials = true
  axios.defaults.withXSRFToken = true
  await axios.interceptors.request.use(
    (config) => {
      // const token = getUserData()?.token
      const token: string = getUserData()?.token
      if (token !== undefined && token !== null && token !== '') {
        config.headers.Authorization = `Bearer ${token}`
      }
      config.headers['Content-Type'] = 'application/json'
      return config
    },
    (err) => Promise.reject(err),
  )
}

export const responseInterceptor = ({
  doLogout,
  navigate,
  // notification,
}: {
  doLogout?: () => void
  navigate: NavigateFunction
  // notification?: (val: string) => void
}) => {
  axios.interceptors.response.use(
    (response): AxiosResponse => response,
    (err: any) => {
      if (axios.isCancel(err)) {
        return
      }
      if (!err.response || err.message === 'Network Error') {
        notification.error({
          message: 'Terjadi Masalah Koneksi',
          description:
            'Koneksi internet Anda terputus, silahkan periksa kembali koneksi Anda atau memuat ulang halaman ini.',
          duration: 5,
        })

        return false
      }

      if (err.response.status === 401) {
        localStorage.clear()

        navigate(0)
        return
      }

      return Promise.reject(err)
    },
  )
}
