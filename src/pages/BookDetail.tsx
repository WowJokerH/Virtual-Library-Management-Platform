import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { BookOpen, Calendar, User, Clock, Star, MessageCircle, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { RatingStars } from '@/components/RatingStars'
import { useBook } from '@/hooks/useBooks'
import { useReviews } from '@/hooks/useReviews'
import { useBorrowRecords } from '@/hooks/useBorrowRecords'
import { useAuthStore } from '@/hooks/useAuth'
import { formatDate, isOverdue, getDaysUntilDue } from '@/lib/utils'

export function BookDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const { book, loading: bookLoading } = useBook(id!)
  const { reviews, loading: reviewsLoading, addReview } = useReviews(id)
  const { records, borrowBook, renewBook, returnBook } = useBorrowRecords(user?.id)
  
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [showReviewForm, setShowReviewForm] = useState(false)

  if (bookLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-96 mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">图书不存在</div>
        <Link to="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          返回首页
        </Link>
      </div>
    )
  }

  const currentBorrowRecord = records.find(r => r.book_id === book.id && r.status === 'borrowed')
  const hasReviewed = reviews.some(r => r.user_id === user?.id)

  const handleBorrow = async () => {
    if (!user) {
      toast.error('请先登录')
      return
    }

    if (book.available <= 0) {
      toast.error('该图书暂无库存')
      return
    }

    const result = await borrowBook(book.id, user.id)
    if (result.success) {
      toast.success('借阅成功！')
    } else {
      toast.error(result.error || '借阅失败')
    }
  }

  const handleRenew = async () => {
    if (!currentBorrowRecord) return

    if (currentBorrowRecord.renew_count >= 2) {
      toast.error('每本书最多只能续借2次')
      return
    }

    const result = await renewBook(currentBorrowRecord.id)
    if (result.success) {
      toast.success('续借成功！')
    } else {
      toast.error(result.error || '续借失败')
    }
  }

  const handleReturn = async () => {
    if (!currentBorrowRecord) return

    const result = await returnBook(currentBorrowRecord.id, book.id)
    if (result.success) {
      toast.success('归还成功！')
    } else {
      toast.error(result.error || '归还失败')
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('请先登录')
      return
    }

    if (rating === 0) {
      toast.error('请选择评分')
      return
    }

    const result = await addReview(book.id, rating, comment)
    if (result.success) {
      toast.success('评价提交成功！')
      setRating(0)
      setComment('')
      setShowReviewForm(false)
    } else {
      toast.error(result.error || '评价提交失败')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        返回首页
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-gray-200 rounded-lg aspect-[3/4] flex items-center justify-center overflow-hidden">
            {book.cover_image ? (
              <img 
                src={book.cover_image} 
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <BookOpen className="w-24 h-24 text-gray-400" />
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-lg text-gray-600 mb-4">作者：{book.author}</p>
            
            <div className="flex items-center space-x-4 mb-4">
              <RatingStars rating={book.avg_rating} />
              <span className="text-sm text-gray-500">({book.review_count} 条评价)</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-400" />
                <span>出版社：{book.publisher || '未知'}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span>出版时间：{book.publish_date ? formatDate(book.publish_date) : '未知'}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                <span>分类：{book.category}</span>
              </div>
              <div className="flex items-center">
                <span className={`px-2 py-1 rounded text-xs ${
                  book.available > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {book.available > 0 ? `可借 ${book.available}/${book.stock} 本` : '暂无库存'}
                </span>
              </div>
            </div>
          </div>

          {book.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">图书简介</h3>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>
          )}

          <div className="space-y-4">
            {currentBorrowRecord ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">借阅信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>借阅日期：</span>
                    <span>{formatDate(currentBorrowRecord.borrow_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>到期日期：</span>
                    <span className={isOverdue(currentBorrowRecord.due_date) ? 'text-red-600' : ''}>
                      {formatDate(currentBorrowRecord.due_date)}
                      {isOverdue(currentBorrowRecord.due_date) && ' (已逾期)'}
                      {!isOverdue(currentBorrowRecord.due_date) && ` (${getDaysUntilDue(currentBorrowRecord.due_date)}天后到期)`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>续借次数：</span>
                    <span>{currentBorrowRecord.renew_count}/2</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Button
                    onClick={handleRenew}
                    disabled={currentBorrowRecord.renew_count >= 2}
                    size="sm"
                  >
                    续借
                  </Button>
                  <Button
                    onClick={handleReturn}
                    variant="outline"
                    size="sm"
                  >
                    归还
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleBorrow}
                disabled={book.available <= 0}
                className="w-full"
              >
                {book.available > 0 ? '借阅此书' : '暂无库存'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>读者评价</CardTitle>
            {user && !hasReviewed && !currentBorrowRecord && (
              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                size="sm"
              >
                写评价
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">评分</label>
                <RatingStars rating={rating} interactive onChange={setRating} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">评论</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="分享您的阅读体验..."
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" size="sm">
                  提交评价
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReviewForm(false)}
                >
                  取消
                </Button>
              </div>
            </form>
          )}

          {reviewsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暂无评价
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {review.user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{review.user?.name || '匿名用户'}</div>
                        <div className="text-xs text-gray-500">{formatDate(review.created_at)}</div>
                      </div>
                    </div>
                    <RatingStars rating={review.rating} size="sm" />
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 ml-11">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}