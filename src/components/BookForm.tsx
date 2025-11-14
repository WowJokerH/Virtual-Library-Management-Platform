import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Book } from '@/types'
import { createBookInLocalDb, updateBookInLocalDb } from '@/lib/localDatabase'

interface BookFormProps {
  book?: Book
  onSuccess?: () => void
  onCancel?: () => void
}

const CATEGORY_OPTIONS = [
  '文学',
  '历史',
  '哲学',
  '经济',
  '管理',
  '计算机',
  '数学',
  '心理学',
  '教育',
  '艺术',
  '工程',
  '医学',
  '旅行',
  '社会科学',
  '科普',
  '其他',
]

export function BookForm({ book, onSuccess, onCancel }: BookFormProps) {
  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    isbn: book?.isbn || '',
    publisher: book?.publisher || '',
    publish_date: book?.publish_date || '',
    category: book?.category || '',
    description: book?.description || '',
    stock: book?.stock || 1,
    available: book?.available || 1,
    cover_image: book?.cover_image || '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      setLoading(true)

      if (book) {
        await updateBookInLocalDb(book.id, {
          title: formData.title,
          author: formData.author,
          isbn: formData.isbn,
          publisher: formData.publisher,
          publish_date: formData.publish_date,
          category: formData.category,
          description: formData.description,
          stock: formData.stock,
          available: formData.available,
          cover_image: formData.cover_image,
        })
        toast.success('图书信息更新成功！')
      } else {
        await createBookInLocalDb({
          title: formData.title,
          author: formData.author,
          isbn: formData.isbn,
          publisher: formData.publisher,
          publish_date: formData.publish_date,
          category: formData.category,
          description: formData.description,
          stock: formData.stock,
          available: formData.available,
          cover_image: formData.cover_image,
        })
        toast.success('图书添加成功！')
      }

      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '操作失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="图书名称 *"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          placeholder="请输入图书名称"
        />

        <Input
          label="作者 *"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          required
          placeholder="请输入作者姓名"
        />

        <Input
          label="ISBN *"
          value={formData.isbn}
          onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
          required
          placeholder="请输入 ISBN 编号"
        />

        <Input
          label="出版社"
          value={formData.publisher}
          onChange={(e) =>
            setFormData({ ...formData, publisher: e.target.value })
          }
          placeholder="请输入出版社"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            分类 *
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">请选择分类</option>
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="出版日期"
          type="date"
          value={formData.publish_date}
          onChange={(e) =>
            setFormData({ ...formData, publish_date: e.target.value })
          }
        />

        <Input
          label="总册数 *"
          type="number"
          min="1"
          value={formData.stock}
          onChange={(e) =>
            setFormData({
              ...formData,
              stock: Number(e.target.value) || 1,
            })
          }
          required
        />

        <Input
          label="可借数量 *"
          type="number"
          min="0"
          value={formData.available}
          onChange={(e) =>
            setFormData({
              ...formData,
              available: Number(e.target.value) || 0,
            })
          }
          required
        />
      </div>

      <Input
        label="封面图片 URL"
        value={formData.cover_image}
        onChange={(e) =>
          setFormData({ ...formData, cover_image: e.target.value })
        }
        placeholder="请输入图书封面链接"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          简介
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="请输入图书简介"
        />
      </div>

      <div className="flex space-x-3">
        <Button type="submit" loading={loading}>
          {book ? '保存' : '创建'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            取消
          </Button>
        )}
      </div>
    </form>
  )
}
