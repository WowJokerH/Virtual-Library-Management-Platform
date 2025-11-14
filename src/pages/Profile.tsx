import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/hooks/useAuth'
import { useBorrowRecords } from '@/hooks/useBorrowRecords'
import { formatDate, isOverdue, bookStatuses } from '@/lib/utils'
import type { BorrowRecord } from '@/types'
import { BookOpen, Clock, Calendar, User } from 'lucide-react'

export function Profile() {
  const { user } = useAuthStore()
  const { records, loading, renewBook, returnBook } = useBorrowRecords(user?.id)
  const [actionState, setActionState] = useState<{
    id: string
    type: 'renew' | 'return'
  } | null>(null)

  const activeBorrows = records.filter(
    (r) => r.status === 'borrowed' || r.status === 'overdue',
  )
  const returnedBorrows = records.filter(r => r.status === 'returned')
  const overdueBorrows = records.filter(r => r.status === 'overdue')

  const isProcessing = (recordId: string, type: 'renew' | 'return') =>
    actionState?.id === recordId && actionState.type === type

  const handleRenew = async (record: BorrowRecord) => {
    if (record.renew_count >= 2) {
      toast.error('每本书最多续借2次')
      return
    }

    setActionState({ id: record.id, type: 'renew' })
    const result = await renewBook(record.id)
    setActionState(null)

    if (result.success) {
      toast.success('续借成功')
    } else {
      toast.error(result.error || '续借失败')
    }
  }

  const handleReturn = async (record: BorrowRecord) => {
    setActionState({ id: record.id, type: 'return' })
    const result = await returnBook(record.id, record.book_id)
    setActionState(null)

    if (result.success) {
      toast.success('归还成功')
    } else {
      toast.error(result.error || '归还失败')
    }
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">请先登录</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>个人信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
                <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                  user.role === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role === 'admin' ? '管理员' : '读者'}
                </span>
              </div>
              
              <div className="border-t pt-4">
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between mb-2">
                    <span>注册时间：</span>
                    <span>{formatDate(user.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>借阅统计</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{activeBorrows.length}</div>
                <div className="text-sm text-green-800">当前借阅</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{returnedBorrows.length}</div>
                <div className="text-sm text-blue-800">已归还</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{overdueBorrows.length}</div>
                <div className="text-sm text-red-800">逾期记录</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            当前借阅
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-16 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeBorrows.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <div>暂无借阅记录</div>
            </div>
          ) : (
            <div className="space-y-4">
              {activeBorrows.map((record) => (
                <div key={record.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{record.book?.title}</h4>
                    <p className="text-sm text-gray-600">{record.book?.author}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        借阅：{formatDate(record.borrow_date)}
                      </span>
                      <span className={`flex items-center ${
                        isOverdue(record.due_date) ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        <Clock className="w-4 h-4 mr-1" />
                        到期：{formatDate(record.due_date)}
                        {isOverdue(record.due_date) && ' (已逾期)'}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          record.status === 'overdue'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {bookStatuses[record.status]}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-2">
                      续借 {record.renew_count}/2
                    </div>
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        onClick={() => handleRenew(record)}
                        disabled={record.renew_count >= 2 || isProcessing(record.id, 'renew')}
                      >
                        {isProcessing(record.id, 'renew') ? '续借中...' : '续借'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReturn(record)}
                        disabled={isProcessing(record.id, 'return')}
                      >
                        {isProcessing(record.id, 'return') ? '归还中...' : '归还'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            借阅历史
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : returnedBorrows.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <div>暂无借阅历史</div>
            </div>
          ) : (
            <div className="space-y-3">
              {returnedBorrows.slice(0, 10).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{record.book?.title}</h4>
                    <p className="text-sm text-gray-600">{record.book?.author}</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>借阅：{formatDate(record.borrow_date)}</div>
                    <div>归还：{formatDate(record.return_date!)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
