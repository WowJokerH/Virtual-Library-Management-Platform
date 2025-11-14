import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Filter, Grid, List } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SearchBar } from '@/components/SearchBar'
import { BookCard } from '@/components/BookCard'
import { RatingStars } from '@/components/RatingStars'
import { useBooks } from '@/hooks/useBooks'
import { categories } from '@/lib/utils'

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const searchQuery = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || 'title'
  const order = searchParams.get('order') || 'asc'
  const page = parseInt(searchParams.get('page') || '1')
  
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [showFilters, setShowFilters] = useState(false)

  const { books, loading, total } = useBooks(
    { search: searchQuery, category, sort: sort as any, order: order as any },
    { page, limit: 12 }
  )

  const totalPages = Math.ceil(total / 12)

  const handleSearch = (query: string) => {
    setLocalSearch(query)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newParams = new URLSearchParams(searchParams)
    if (localSearch.trim()) {
      newParams.set('search', localSearch)
    } else {
      newParams.delete('search')
    }
    newParams.set('page', '1')
    setSearchParams(newParams)
  }

  const updateParams = (updates: Record<string, string | null | undefined>) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })
    newParams.set('page', '1')
    setSearchParams(newParams)
  }

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', newPage.toString())
    setSearchParams(newParams)
    window.scrollTo(0, 0)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="mb-4">
          <SearchBar
            value={localSearch}
            onChange={handleSearch}
            placeholder="搜索图书标题、作者或关键词..."
          />
        </form>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>筛选</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            共找到 {total} 本图书
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                <select
                  value={category}
                  onChange={(e) => updateParams({ category: e.target.value || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全部分类</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">排序</label>
                <select
                  value={`${sort}|${order}`}
                  onChange={(e) => {
                    const [newSort, newOrder] = e.target.value.split('|')
                    updateParams({
                      sort: newSort,
                      order: newOrder,
                    })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="title|asc">标题 A-Z</option>
                  <option value="title|desc">标题 Z-A</option>
                  <option value="avg_rating|desc">评分最高</option>
                  <option value="avg_rating|asc">评分最低</option>
                  <option value="review_count|desc">评价最多</option>
                  <option value="publish_date|desc">最新出版</option>
                  <option value="publish_date|asc">最早出版</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">没有找到相关图书</div>
          <div className="text-gray-400">试试其他关键词或调整筛选条件</div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {books.map((book) => (
            <Link key={book.id} to={`/book/${book.id}`}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-32 shrink-0">
                    <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                      {book.cover_image ? (
                        <img
                          src={book.cover_image}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-500 text-sm">无封面</div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                        <p className="text-sm text-gray-600">{book.author}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RatingStars rating={book.avg_rating} size="sm" />
                        <span className="text-xs text-gray-500">{book.review_count} 评价</span>
                      </div>
                    </div>
                    {book.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{book.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2 py-1 rounded bg-blue-100 text-blue-800">{book.category}</span>
                      <span
                        className={`px-2 py-1 rounded ${
                          book.available > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {book.available > 0 ? `可借 ${book.available} 本` : '暂无库存'}
                      </span>
                      {book.publish_date && (
                        <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">
                          出版：{book.publish_date}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            上一页
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            下一页
          </Button>
        </div>
      )}
    </div>
  )
}
