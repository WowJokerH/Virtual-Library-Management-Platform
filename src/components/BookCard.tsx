import { Book as BookType } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/Card'
import { RatingStars } from '@/components/RatingStars'
import type { Book } from '@/types'

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link to={`/book/${book.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
            {book.cover_image ? (
              <img 
                src={book.cover_image} 
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <BookType className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{book.author}</p>
          <div className="flex items-center justify-between">
            <RatingStars rating={book.avg_rating} size="sm" />
            <span className="text-xs text-gray-500">{book.review_count} 评价</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {book.category}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${
              book.available > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {book.available > 0 ? `可借 ${book.available} 本` : '暂无库存'}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}