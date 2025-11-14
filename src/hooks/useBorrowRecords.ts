import { useState, useEffect } from 'react'
import type { BorrowRecord } from '@/types'
import {
  borrowBookInLocalDb,
  getBorrowRecordsFromLocalDb,
  renewBorrowRecordInLocalDb,
  returnBorrowRecordInLocalDb,
} from '@/lib/localDatabase'

export function useBorrowRecords(userId?: string) {
  const [records, setRecords] = useState<BorrowRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBorrowRecords()
  }, [userId])

  const fetchBorrowRecords = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getBorrowRecordsFromLocalDb(userId)
      setRecords(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取借阅记录失败')
    } finally {
      setLoading(false)
    }
  }

  const borrowBook = async (bookId: string, userId: string) => {
    try {
      await borrowBookInLocalDb(bookId, userId)
      await fetchBorrowRecords()
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : '借阅失败' }
    }
  }

  const renewBook = async (recordId: string) => {
    try {
      await renewBorrowRecordInLocalDb(recordId)
      await fetchBorrowRecords()
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : '续借失败' }
    }
  }

  const returnBook = async (recordId: string, bookId: string) => {
    try {
      await returnBorrowRecordInLocalDb(recordId, bookId)
      await fetchBorrowRecords()
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : '归还失败' }
    }
  }

  return {
    records,
    loading,
    error,
    refetch: fetchBorrowRecords,
    borrowBook,
    renewBook,
    returnBook,
  }
}
