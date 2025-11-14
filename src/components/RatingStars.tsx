import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
}

export function RatingStars({ 
  rating, 
  size = 'md', 
  interactive = false, 
  onChange 
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const handleClick = (newRating: number) => {
    if (interactive && onChange) {
      onChange(newRating)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300',
            interactive && 'cursor-pointer hover:text-yellow-400'
          )}
          onClick={() => handleClick(star)}
        />
      ))}
      <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  )
}