import { useState } from 'react'
import { BookOpen, Edit, Trash2, Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { BookForm } from '@/components/BookForm'
import { useBooks } from '@/hooks/useBooks'
import type { Book } from '@/types'
import { deleteBookFromLocalDb } from '@/lib/localDatabase'

const PAGE_SIZE_OPTIONS = [10, 20, 30]

export function BookManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | undefined>()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { books, loading, refetch, total } = useBooks(
    { search: searchQuery },
    { page, limit: pageSize },
  )

  const totalCount = total ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  const handleAddBook = () => {
    setEditingBook(undefined)
    setShowForm(true)
  }

  const handleEditBook = (book: Book) => {
    setEditingBook(book)
    setShowForm(true)
  }

  const handleDeleteBook = async (bookId: string, title: string) => {
    if (!confirm(`确认要删除图书 "${title}" 吗？`)) {
      return
    }

    try {
      await deleteBookFromLocalDb(bookId)
      toast.success('图书删除成功！')
      refetch()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '删除失败')
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingBook(undefined)
    refetch()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingBook(undefined)
  }

  if (showForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{editingBook ? '编辑图书' : '新增图书'}</CardTitle>
        </CardHeader>
        <CardContent>
          <BookForm
            book={editingBook}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">图书管理</h2>
        <Button onClick={handleAddBook}>
          <Plus className="w-4 h-4 mr-2" />
          新增图书
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="搜索图书标题或作者..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>每页显示</span>
              <select
                className="border rounded px-2 py-1"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPage(1)
                }}
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span>条</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <div className="w-12 h-16 bg-gray-200 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <div className="text-gray-500">暂无图书数据</div>
            </div>
          ) : (
            <div className="space-y-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                    {book.cover_image ? (
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <BookOpen className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>ISBN: {book.isbn}</span>
                      <span>分类: {book.category}</span>
                      <span>
                        库存: {book.available}/{book.stock}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditBook(book)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteBook(book.id, book.title)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t text-sm text-gray-600">
            <span>
              共 {totalCount.toLocaleString()} 条记录，第 {page}/{totalPages} 页
            </span>
            <div className="space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1 || loading}
              >
                上一页
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page >= totalPages || loading}
              >
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
