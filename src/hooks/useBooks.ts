import { useState, useEffect } from 'react'
import type { Book, BookFilters, PaginationParams } from '@/types'
import { getBookByIdFromLocalDb, getBooksFromLocalDb } from '@/lib/localDatabase'

export function useBooks(filters?: BookFilters, pagination?: PaginationParams) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const filtersKey = JSON.stringify(filters || {})
  const paginationKey = JSON.stringify(pagination || {})

  useEffect(() => {
    fetchBooks(filters, pagination)
  }, [filtersKey, paginationKey])

  const fetchBooks = async (
    currentFilters: BookFilters | undefined = filters,
    currentPagination: PaginationParams | undefined = pagination
  ) => {
    try {
      setLoading(true)
      setError(null)

      const { books, total } = await getBooksFromLocalDb(
        currentFilters,
        currentPagination
      )
      setBooks(books)
      setTotal(total)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取图书失败')
    } finally {
      setLoading(false)
    }
  }

  return { books, loading, error, total, refetch: fetchBooks }
}

export function useBook(id: string) {
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBook()
  }, [id])

  const fetchBook = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getBookByIdFromLocalDb(id)
      setBook(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取图书详情失败')
    } finally {
      setLoading(false)
    }
  }

  return { book, loading, error, refetch: fetchBook }
}
