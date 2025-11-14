import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('zh-CN')
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('zh-CN')
}

export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date()
}

export function getDaysUntilDue(dueDate: string): number {
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export const categories = [
  '文学', '历史', '哲学', '经济', '管理', '计算机', '数学', '物理', 
  '化学', '生物', '医学', '工程', '艺术', '教育', '心理学', '法律'
]

export const bookStatuses = {
  borrowed: '已借出',
  returned: '已归还',
  overdue: '已逾期'
} as const