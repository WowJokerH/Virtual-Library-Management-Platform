import { Outlet, Link, useLocation } from 'react-router-dom'
import { BookOpen, User, Search, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuthActions'
import { useAuthStore } from '@/hooks/useAuth'

export function Layout() {
  const location = useLocation()
  const { logout } = useAuth()
  const { user, isAuthenticated } = useAuthStore()

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <span className="font-semibold text-lg">智慧图书馆</span>
              </Link>
              
              <div className="hidden md:flex space-x-6">
                <Link
                  to="/"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>首页</span>
                </Link>
                
                <Link
                  to="/search"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/search') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>搜索</span>
                </Link>
                
                {isAuthenticated && (
                  <Link
                    to="/profile"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/profile') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>个人中心</span>
                  </Link>
                )}
                
                {isAuthenticated && user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/admin') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>管理面板</span>
                  </Link>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600">欢迎，{user?.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>退出</span>
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      登录
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm">
                      注册
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}