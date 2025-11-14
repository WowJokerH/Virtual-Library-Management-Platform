import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { BookManagement } from '@/components/BookManagement'
import { BookOpen, Users, Clock, Star, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useLibraryStats } from '@/hooks/useLibraryStats'
import { useAdminDashboardData } from '@/hooks/useAdminDashboardData'
import { formatDateTime } from '@/lib/utils'

const CATEGORY_COLOR_PALETTE = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#6366F1',
  '#14B8A6',
  '#F472B6',
]

export function Admin() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'books' | 'borrows' | 'users'
  >('dashboard')

  const tabs = [
    { id: 'dashboard', name: '仪表盘', icon: TrendingUp },
    { id: 'books', name: '图书管理', icon: BookOpen },
    { id: 'borrows', name: '借阅管理', icon: Clock },
    { id: 'users', name: '用户管理', icon: Users },
  ]

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'books' && <BookManagement />}
      {activeTab === 'borrows' && <BorrowManagement />}
      {activeTab === 'users' && <UserManagement />}
    </div>
  )
}

function Dashboard() {
  const { stats, loading } = useLibraryStats()
  const { data: adminData, loading: dashboardLoading } = useAdminDashboardData()
  const formatStat = (value?: number) => {
    if (loading || !stats) {
      return '--'
    }

    return (value ?? 0).toLocaleString('zh-CN')
  }
  const formatRating = (value?: number) => {
    if (loading || !stats) {
      return '--'
    }
    if (value == null) {
      return '0.0'
    }
    return value.toFixed(1)
  }

  const borrowTrend = adminData?.borrowTrend ?? []
  const recentActivities = adminData?.recentActivities ?? []
  const categoryDistribution = adminData?.categoryDistribution ?? []
  const activityActionLabel = {
    borrow: '借阅',
    return: '归还',
  } as const

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">总图书数</p>
                <p className="text-3xl font-bold">{formatStat(stats?.totalCopies)}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">注册用户</p>
                <p className="text-3xl font-bold">{formatStat(stats?.registeredUsers)}</p>
              </div>
              <Users className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">当前借阅</p>
                <p className="text-3xl font-bold">
                  {formatStat(stats?.activeBorrowRecords)}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">平均评分</p>
                <p className="text-3xl font-bold">{formatRating(stats?.averageRating)}</p>
              </div>
              <Star className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              借阅趋势
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                加载中...
              </div>
            ) : borrowTrend.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                暂无借阅数据
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={borrowTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="borrowed" fill="#3B82F6" name="借阅" />
                  <Bar dataKey="returned" fill="#10B981" name="归还" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              图书分类分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                数据加载中...
              </div>
            ) : categoryDistribution.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                暂无分类数据
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={
                          CATEGORY_COLOR_PALETTE[
                            index % CATEGORY_COLOR_PALETTE.length
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>最近操作</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
                    <div className="h-4 bg-gray-200 rounded w-32" />
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-24" />
                </div>
              ))}
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="text-center py-6 text-gray-500">暂无操作记录</div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {activity.userName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">{activity.userName}</span>
                      <span className="mx-2 text-gray-500">
                        {activityActionLabel[activity.action]}
                      </span>
                      <span>{activity.bookTitle}</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDateTime(activity.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function BorrowManagement() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">借阅管理</h2>
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <div>借阅管理功能开发中...</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function UserManagement() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">用户管理</h2>
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <div>用户管理功能开发中...</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}