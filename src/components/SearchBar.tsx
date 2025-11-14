import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder = '搜索图书标题或作者...',
  className 
}: SearchBarProps) {
  return (
    <div className={className}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-4"
        />
      </div>
    </div>
  )
}