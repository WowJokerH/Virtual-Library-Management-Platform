export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher?: string;
  publish_date?: string;
  category: string;
  description?: string;
  stock: number;
  available: number;
  cover_image?: string;
  avg_rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface BorrowRecord {
  id: string;
  user_id: string;
  book_id: string;
  borrow_date: string;
  due_date: string;
  return_date?: string;
  status: 'borrowed' | 'returned' | 'overdue';
  renew_count: number;
  created_at: string;
  book?: Book;
  user?: User;
}

export interface Review {
  id: string;
  user_id: string;
  book_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface BookFilters {
  search?: string;
  category?: string;
  sort?: 'title' | 'author' | 'avg_rating' | 'review_count' | 'publish_date';
  order?: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface LibraryStats {
  totalTitles: number;
  totalCopies: number;
  registeredUsers: number;
  activeBorrowRecords: number;
  averageRating: number;
}

export interface BorrowTrendPoint {
  label: string;
  borrowed: number;
  returned: number;
}

export type RecentActivityAction = 'borrow' | 'return';

export interface RecentActivity {
  id: string;
  userName: string;
  action: RecentActivityAction;
  bookTitle: string;
  timestamp: string;
}

export interface CategoryDistributionItem {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface AdminDashboardData {
  borrowTrend: BorrowTrendPoint[];
  recentActivities: RecentActivity[];
  categoryDistribution: CategoryDistributionItem[];
}
