import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuthActions'

export function Register() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('两次输入的密码不一致')
      return
    }

    if (formData.password.length < 6) {
      toast.error('密码长度至少为6位')
      return
    }
    
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    })
    
    if (result.success) {
      toast.success('注册成功！')
      navigate('/')
    } else {
      toast.error(result.error || '注册失败')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">注册智慧图书馆</h2>
          <p className="mt-2 text-sm text-gray-600">
            已有账号？{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              立即登录
            </Link>
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>用户注册</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="姓名"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="请输入姓名"
              />
              
              <Input
                label="邮箱地址"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="请输入邮箱地址"
              />
              
              <Input
                label="密码"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="请输入密码（至少6位）"
              />
              
              <Input
                label="确认密码"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                placeholder="请再次输入密码"
              />
              
              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                注册
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}