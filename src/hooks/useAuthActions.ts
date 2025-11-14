import { useState } from 'react'
import { useAuthStore } from './useAuth'
import type { LoginCredentials, RegisterData } from '@/types'
import {
  getUserByIdFromLocalDb,
  loginWithLocalDb,
  registerWithLocalDb,
} from '@/lib/localDatabase'

export function useAuth() {
  const { user, setUser, setIsLoading, logout: storeLogout } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true)
      setError(null)

      const user = await loginWithLocalDb(credentials)
      if (user) {
        setUser(user)
      }

      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : '登录失败'
      setError(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (registerData: RegisterData) => {
    try {
      setIsLoading(true)
      setError(null)

      const user = await registerWithLocalDb(registerData)
      if (user) {
        setUser(user)
      }

      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : '注册失败'
      setError(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      storeLogout()
    } catch (err) {
      console.error('登出失败:', err)
    }
  }

  const checkAuth = async () => {
    try {
      const current = useAuthStore.getState().user
      if (!current) return

      const freshUser = await getUserByIdFromLocalDb(current.id)
      if (freshUser) {
        setUser(freshUser)
      } else {
        storeLogout()
      }
    } catch (err) {
      console.error('检查认证状态失败:', err)
    }
  }

  return {
    user,
    isAuthenticated: !!user,
    isLoading: useAuthStore.getState().isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
  }
}
