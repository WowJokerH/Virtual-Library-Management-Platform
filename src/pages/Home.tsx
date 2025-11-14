import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, TrendingUp, Clock, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { SearchBar } from '@/components/SearchBar'
import { BookCard } from '@/components/BookCard'
import { useBooks } from '@/hooks/useBooks'

export function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const { books: popularBooks, loading } = useBooks({ sort: 'avg_rating', order: 'desc' }, { page: 1, limit: 8 })
  const { books: newBooks } = useBooks({ sort: 'publish_date', order: 'desc' }, { page: 1, limit: 8 })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          欢迎来到智慧图书馆
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          发现知识的海洋，开启阅读之旅。我们为您提供丰富的图书资源和便捷的借阅服务。
        </p>
        
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            placeholder="搜索图书标题、作者或关键词..."
          />
        </form>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
            热门图书
          </h2>
          <Link to="/search?sort=avg_rating&order=desc" className="text-blue-600 hover:text-blue-800 font-medium">
            查看更多 →
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-green-600" />
            新书上架
          </h2>
          <Link to="/search?sort=created_at&order=desc" className="text-blue-600 hover:text-blue-800 font-medium">
            查看更多 →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Star className="w-6 h-6 mr-2 text-yellow-500" />
          图书分类
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['文学', '历史', '哲学', '经济', '管理', '计算机', '艺术', '教育'].map((category) => (
            <Link
              key={category}
              to={`/search?category=${encodeURIComponent(category)}`}
              className="p-4 text-center border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <div className="text-lg font-medium text-gray-900">{category}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}