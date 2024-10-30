// @ts-nocheck
import { IAuthData, IAuthProviderProps } from 'src/models/auth.model'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ILoggedInUser } from '@src/models/user.model'
import { useNavigate } from 'react-router-dom'
import {
  requestInterceptors,
  responseInterceptor,
} from 'src/middleware/interceptors'
import { AxiosError, AxiosResponse } from 'axios'
import { ILogoutResponse } from 'src/models/login.model'
import { doRequestLogout } from 'src/services/auth.service'
import { useApp } from './app.context'
import useToggle from 'src/hooks/useToggle'

const AuthContext = createContext<IAuthData | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const navigate = useNavigate()
  const { notify } = useApp()

  const [user, setUser] = useState<ILoggedInUser>()
  const [token, setToken] = useState<String>('')

  const [isModalChangePasswordVisible, setIsModalChangePasswordVisible] =
    useToggle(false)

  const _onRequestLogout = useCallback(async () => {
    try {
      const res: AxiosResponse<ILogoutResponse> = await doRequestLogout()

      if (res?.data?.message) {
        notify.success({
          message: 'Success',
          description: res?.data?.message,
          duration: 5,
        })

        localStorage.clear()

        navigate(0)
      }
    } catch (err) {
      const { message }: AxiosError = err?.response?.data

      notify.error({
        message: 'Error',
        description: message,
        duration: 5,
      })
    }
  }, [])

  const doLogin = () => {
    let user: ILoggedInUser
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (userData) {
      user = JSON.parse(userData)
    }
    if (user && token) {
      setToken(token)
      setUser(user)
    }
  }

  const doLogout = () => {
    _onRequestLogout()
  }

  const getUserData = () => {
    let userDataString = localStorage.getItem('user')
    let token = localStorage.getItem('token')

    let userData: ILoggedInUser | null = null

    if (userDataString) {
      userData = JSON.parse(userDataString)
    }

    if (token) token = JSON.parse(token)

    return {
      user: userData,
      role: userData?.role,
      token,
    }
  }

  const _handleModalChangePasswordVisibility = () => {
    setIsModalChangePasswordVisible()
  }

  const isUserAuthenticated = useMemo(() => {
    if (!token) {
      let token = localStorage.getItem('token')
      if (!token) {
        return false
      }
      localStorage.setItem('token', token)
    }
    return true
  }, [token])

  const getUserRole = useMemo(() => {
    return getUserData()?.user?.role
  }, [getUserData])

  useEffect(() => {
    requestInterceptors(getUserData)
    responseInterceptor({ navigate })
  }, [])

  const authData: IAuthData = {
    isAuthenticated: isUserAuthenticated,
    doLogin: doLogin,
    doLogout: doLogout,
    user,
    token,
    getUserData,
    getUserRole,
    isModalChangePasswordVisible,
    handleModalChangePasswordVisibility: _handleModalChangePasswordVisibility,
  }

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  )
}
