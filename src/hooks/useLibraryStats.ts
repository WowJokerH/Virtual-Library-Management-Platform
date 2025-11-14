import { useCallback, useEffect, useState } from 'react'
import type { LibraryStats } from '@/types'
import { getLibraryStatsFromLocalDb } from '@/lib/localDatabase'

export function useLibraryStats() {
  const [stats, setStats] = useState<LibraryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getLibraryStatsFromLocalDb()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取统计数据失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}
