import { useState, useEffect } from 'react'
import type { Review } from '@/types'
import { addReviewToLocalDb, getReviewsForBookFromLocalDb } from '@/lib/localDatabase'
import { useAuthStore } from './useAuth'

export function useReviews(bookId?: string) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (bookId) {
      fetchReviews()
    }
  }, [bookId])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getReviewsForBookFromLocalDb(bookId)
      setReviews(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取评价失败')
    } finally {
      setLoading(false)
    }
  }

  const addReview = async (bookId: string, rating: number, comment?: string) => {
    try {
      const currentUser = useAuthStore.getState().user
      if (!currentUser) throw new Error('请先登录')

      await addReviewToLocalDb(bookId, currentUser.id, rating, comment)
      await fetchReviews()
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : '添加评价失败' }
    }
  }

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews,
    addReview,
  }
}
