import { useCallback, useEffect, useState } from 'react'
import type { AdminDashboardData } from '@/types'
import { getAdminDashboardDataFromLocalDb } from '@/lib/localDatabase'

export function useAdminDashboardData() {
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const metrics = await getAdminDashboardDataFromLocalDb()
      setData(metrics)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取仪表盘数据失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}
