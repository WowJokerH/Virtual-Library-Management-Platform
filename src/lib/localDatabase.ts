import { v4 as uuidv4 } from 'uuid'
import type {
  AdminDashboardData,
  Book,
  BookFilters,
  BorrowRecord,
  LibraryStats,
  LoginCredentials,
  PaginationParams,
  RecentActivity,
  RegisterData,
  Review,
  User,
} from '@/types'

type StoredUser = User & { password: string }
type StoredBorrowRecord = Omit<BorrowRecord, 'book' | 'user'>
type StoredReview = Omit<Review, 'user'>

interface LibraryDB {
  users: StoredUser[]
  books: Book[]
  borrowRecords: StoredBorrowRecord[]
  reviews: StoredReview[]
}

const STORAGE_KEY = 'library-local-db'
const MIN_BOOK_COUNT = 50
const BORROW_DURATION_DAYS = 30
const DAY_MS = 24 * 60 * 60 * 1000

const daysAgo = (days: number) => new Date(Date.now() - days * DAY_MS).toISOString()
const daysFromNow = (days: number) => new Date(Date.now() + days * DAY_MS).toISOString()
const toDateString = (iso: string) => iso.split('T')[0]

const sampleCategories = [
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
]

const sampleAuthors = [
  '林晓雨',
  '赵青川',
  '陈南山',
  '郭远航',
  '王语桐',
  '周可欣',
  '刘航宇',
  '苏奕辰',
  '张恬然',
  '李越泽',
  '何一帆',
  '宋岚溪',
]

const samplePublishers = [
  '人民文学出版社',
  '中信出版社',
  '机械工业出版社',
  '电子工业出版社',
  '北京大学出版社',
  '复旦大学出版社',
  '上海译文出版社',
]

const sampleDescriptions = [
  '通过真实案例串联理论与实践，帮助读者建立系统知识框架。',
  '以深入浅出的语言讲述复杂概念，适合作为进阶学习读物。',
  '围绕现实问题展开分析，引导读者思考与应用。',
  '兼顾历史脉络与当代视角，内容充实且信息量丰富。',
  '提供清晰结构与图表，帮助快速掌握重点。',
]

const sampleCoverImages = [
  'https://images.unsplash.com/photo-1455885666463-1ea8f31b79aa?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=400&q=80',
]

const createExtraBooks = (count: number): Book[] => {
  return Array.from({ length: count }, (_, index) => {
    const category = sampleCategories[index % sampleCategories.length]
    const author = sampleAuthors[index % sampleAuthors.length]
    const publisher = samplePublishers[index % samplePublishers.length]
    const stock = 4 + (index % 6)
    const available = Math.max(1, stock - (index % 4))
    const ratingBase = 3.2 + ((index % 10) * 0.2)
    const avgRating = Math.min(5, Number(ratingBase.toFixed(1)))
    const reviewCount = 6 + ((index * 3) % 35)

    return {
      id: `book-extra-${index + 1}`,
      title: `${category}精选读本 ${index + 1}`,
      author,
      isbn: String(9780000000000 + index),
      publisher,
      publish_date: toDateString(daysAgo(30 + index * 3)),
      category,
      description: sampleDescriptions[index % sampleDescriptions.length],
      stock,
      available,
      cover_image: sampleCoverImages[index % sampleCoverImages.length],
      avg_rating: avgRating,
      review_count: 0,
      created_at: daysAgo(120 - (index % 40)),
      updated_at: daysAgo(20 - (index % 10)),
    }
  })
}

const seedUsers: StoredUser[] = [
  {
    id: 'user-admin',
    email: 'admin@library.local',
    name: '系统管理员',
    role: 'admin',
    created_at: daysAgo(220),
    updated_at: daysAgo(5),
    password: 'admin123',
  },
  {
    id: 'user-reader',
    email: 'reader@library.local',
    name: '普通读者',
    role: 'user',
    created_at: daysAgo(150),
    updated_at: daysAgo(2),
    password: 'reader123',
  },
  {
    id: 'user-guest',
    email: 'guest@library.local',
    name: '体验读者',
    role: 'user',
    created_at: daysAgo(90),
    updated_at: daysAgo(1),
    password: 'guest123',
  },
]

const baseBooks: Book[] = [
  {
    id: 'book-ai',
    title: '人工智能导论',
    author: '李明',
    isbn: '9787302486325',
    publisher: '清华大学出版社',
    publish_date: '2023-01-15',
    category: '计算机',
    description: '全面介绍人工智能发展历史、核心算法和典型应用的入门教材。',
    stock: 5,
    available: 3,
    cover_image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=400&q=80',
    avg_rating: 4.5,
    review_count: 2,
    created_at: daysAgo(180),
    updated_at: daysAgo(3),
  },
  {
    id: 'book-algorithm',
    title: '数据结构与算法精要',
    author: '王华',
    isbn: '9787111593350',
    publisher: '机械工业出版社',
    publish_date: '2022-08-20',
    category: '计算机',
    description: '通过直观示例讲解常用数据结构与算法设计的经典教材。',
    stock: 8,
    available: 6,
    cover_image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=400&q=80',
    avg_rating: 0,
    review_count: 0,
    created_at: daysAgo(200),
    updated_at: daysAgo(7),
  },
  {
    id: 'book-ml',
    title: '机器学习实战',
    author: '张三',
    isbn: '9787111613522',
    publisher: '机械工业出版社',
    publish_date: '2023-03-10',
    category: '计算机',
    description: '以项目驱动的方式实践监督与无监督学习算法。',
    stock: 6,
    available: 4,
    cover_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80',
    avg_rating: 4.5,
    review_count: 2,
    created_at: daysAgo(120),
    updated_at: daysAgo(4),
  },
  {
    id: 'book-prince',
    title: '小王子',
    author: '安托万·德·圣埃克苏佩里',
    isbn: '9787544270878',
    publisher: '南海出版公司',
    publish_date: '2022-12-15',
    category: '文学',
    description: '温柔而哲理的童话，探讨爱与责任。',
    stock: 15,
    available: 12,
    cover_image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=400&q=80',
    avg_rating: 5,
    review_count: 2,
    created_at: daysAgo(160),
    updated_at: daysAgo(12),
  },
  {
    id: 'book-human',
    title: '人类简史',
    author: '尤瓦尔·赫拉利',
    isbn: '9787508647357',
    publisher: '中信出版社',
    publish_date: '2023-02-08',
    category: '历史',
    description: '跨学科视角梳理人类文明进程的畅销著作。',
    stock: 6,
    available: 5,
    cover_image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=400&q=80',
    avg_rating: 4,
    review_count: 1,
    created_at: daysAgo(140),
    updated_at: daysAgo(9),
  },
  {
    id: 'book-live',
    title: '活着',
    author: '余华',
    isbn: '9787506365437',
    publisher: '作家出版社',
    publish_date: '2022-09-12',
    category: '文学',
    description: '普通人在历史巨变中顽强求生的感人故事。',
    stock: 6,
    available: 5,
    cover_image: 'https://images.unsplash.com/photo-1496104679561-38d3afc06c05?auto=format&fit=crop&w=400&q=80',
    avg_rating: 5,
    review_count: 1,
    created_at: daysAgo(210),
    updated_at: daysAgo(15),
  },
]

const extraBooks = createExtraBooks(44)

const extraReviews: StoredReview[] = extraBooks.flatMap((book, idx) => {
  const reviewTotal = 6 + ((idx * 3) % 35)

  return Array.from({ length: reviewTotal }, (_, reviewIdx) => {
    const userId = reviewIdx % 2 === 0 ? 'user-reader' : 'user-guest'
    const rating = 3 + (reviewIdx % 3)
    const commentSample = reviewIdx % 4
    const comment =
      commentSample === 0
        ? '内容详实，帮助我建立了系统认识。'
        : commentSample === 1
          ? '案例部分非常精彩，贴近实践。'
          : commentSample === 2
            ? '结构清晰，可读性强，值得推荐。'
            : '希望后续版本加入更多拓展阅读。'

    return {
      id: `review-extra-${idx}-${reviewIdx}`,
      user_id: userId,
      book_id: book.id,
      rating,
      comment,
      created_at: daysAgo(5 + ((idx + reviewIdx) % 20)),
    }
  })
})

const seedBooks: Book[] = [...baseBooks, ...extraBooks].map((book) => {
  if (!book.id.startsWith('book-extra-')) {
    return book
  }

  const reviews = extraReviews.filter((review) => review.book_id === book.id)
  const avg =
    reviews.reduce((sum, review) => sum + review.rating, 0) /
    (reviews.length || 1)

  return {
    ...book,
    avg_rating: reviews.length ? parseFloat(avg.toFixed(2)) : book.avg_rating,
    review_count: reviews.length,
  }
})

const seedBorrowRecords: StoredBorrowRecord[] = [
  {
    id: 'borrow-1',
    user_id: 'user-reader',
    book_id: 'book-ai',
    borrow_date: daysAgo(10),
    due_date: daysFromNow(20),
    status: 'borrowed',
    renew_count: 1,
    created_at: daysAgo(10),
  },
  {
    id: 'borrow-2',
    user_id: 'user-reader',
    book_id: 'book-live',
    borrow_date: daysAgo(50),
    due_date: daysAgo(20),
    return_date: daysAgo(15),
    status: 'returned',
    renew_count: 0,
    created_at: daysAgo(50),
  },
  {
    id: 'borrow-3',
    user_id: 'user-guest',
    book_id: 'book-human',
    borrow_date: daysAgo(40),
    due_date: daysAgo(5),
    status: 'overdue',
    renew_count: 2,
    created_at: daysAgo(40),
  },
]

const seedReviews: StoredReview[] = [
  {
    id: 'review-1',
    user_id: 'user-reader',
    book_id: 'book-ai',
    rating: 5,
    comment: '内容循序渐进，案例贴近实际项目。',
    created_at: daysAgo(6),
  },
  {
    id: 'review-2',
    user_id: 'user-guest',
    book_id: 'book-ai',
    rating: 4,
    comment: '理论部分稍显枯燥，但整体质量很高。',
    created_at: daysAgo(4),
  },
  {
    id: 'review-3',
    user_id: 'user-reader',
    book_id: 'book-prince',
    rating: 5,
    comment: '读完之后久久不能平静，非常治愈。',
    created_at: daysAgo(12),
  },
  {
    id: 'review-4',
    user_id: 'user-guest',
    book_id: 'book-prince',
    rating: 5,
    comment: '带孩子一起读，体会到了成长的意义。',
    created_at: daysAgo(11),
  },
  {
    id: 'review-5',
    user_id: 'user-reader',
    book_id: 'book-ml',
    rating: 5,
    comment: '任务驱动的讲解方式非常适合入门机器学习。',
    created_at: daysAgo(8),
  },
  {
    id: 'review-6',
    user_id: 'user-guest',
    book_id: 'book-ml',
    rating: 4,
    comment: '希望新增更多深度学习章节。',
    created_at: daysAgo(7),
  },
  {
    id: 'review-7',
    user_id: 'user-reader',
    book_id: 'book-human',
    rating: 4,
    comment: '宏观视角下的人类发展史，很震撼。',
    created_at: daysAgo(14),
  },
  {
    id: 'review-8',
    user_id: 'user-guest',
    book_id: 'book-live',
    rating: 5,
    comment: '文字质朴却力量十足，值得反复阅读。',
    created_at: daysAgo(13),
  },
  ...extraReviews,
]

const seedDatabase: LibraryDB = {
  users: seedUsers,
  books: seedBooks,
  borrowRecords: seedBorrowRecords,
  reviews: seedReviews,
}

const hasWindow = typeof window !== 'undefined'
let cachedDB: LibraryDB | null = null

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

const ensureSeeded = (db: LibraryDB | null): LibraryDB => {
  if (!db || !Array.isArray(db.books) || db.books.length < MIN_BOOK_COUNT) {
    return clone(seedDatabase)
  }
  return db
}

const loadDatabase = (): LibraryDB => {
  if (!cachedDB) {
    if (hasWindow) {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        cachedDB = ensureSeeded(JSON.parse(raw) as LibraryDB)
      } else {
        cachedDB = clone(seedDatabase)
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedDB))
      }
    } else {
      cachedDB = clone(seedDatabase)
    }

    if (cachedDB.books.length < MIN_BOOK_COUNT) {
      cachedDB = clone(seedDatabase)
      if (hasWindow) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedDB))
      }
    }
  }

  return clone(cachedDB)
}

const saveDatabase = (db: LibraryDB) => {
  cachedDB = clone(db)

  if (hasWindow) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedDB))
  }
}

const sanitizeUser = (user?: StoredUser | null): User | null => {
  if (!user) return null
  const { password, ...rest } = user
  return rest
}

const normalizeBookAvailability = (available: number, stock: number) => Math.min(Math.max(available, 0), Math.max(stock, 0))

const ensureBookExists = (db: LibraryDB, bookId: string) => {
  const book = db.books.find((item) => item.id === bookId)
  if (!book) {
    throw new Error('图书不存在')
  }
  return book
}

const ensureUserExists = (db: LibraryDB, userId: string) => {
  const user = db.users.find((item) => item.id === userId)
  if (!user) {
    throw new Error('用户不存在')
  }
  return user
}

const addDays = (dateIso: string, days: number) => {
  const base = new Date(dateIso)
  base.setDate(base.getDate() + days)
  return base.toISOString()
}

export const initializeLocalDatabase = () => {
  loadDatabase()
}

export const getLibraryStatsFromLocalDb = async (): Promise<LibraryStats> => {
  const db = loadDatabase()
  const totalTitles = db.books.length
  const totalCopies = db.books.reduce((sum, book) => sum + (book.stock || 0), 0)
  const registeredUsers = db.users.length
  const activeBorrowRecords = db.books.reduce(
    (sum, book) => sum + Math.max(book.stock - (book.available || 0), 0),
    0,
  )
  const ratingAggregate = db.books.reduce(
    (acc, book) => {
      if (book.review_count > 0) {
        acc.weightedScore += book.avg_rating * book.review_count
        acc.reviewCount += book.review_count
      }
      acc.totalAverage += book.avg_rating
      return acc
    },
    { weightedScore: 0, reviewCount: 0, totalAverage: 0 },
  )
  const rawAverage =
    ratingAggregate.reviewCount > 0
      ? ratingAggregate.weightedScore / ratingAggregate.reviewCount
      : totalTitles > 0
        ? ratingAggregate.totalAverage / totalTitles
        : 0
  const averageRating = parseFloat(rawAverage.toFixed(2))

  return {
    totalTitles,
    totalCopies,
    registeredUsers,
    activeBorrowRecords,
    averageRating,
  }
}

export const getAdminDashboardDataFromLocalDb =
  async (): Promise<AdminDashboardData> => {
    const db = loadDatabase()
    const now = new Date()

    const monthBuckets = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        label: `${date.getMonth() + 1}月`,
        borrowed: 0,
        returned: 0,
      }
    })

    const bucketMap = new Map(
      monthBuckets.map((bucket) => [bucket.key, bucket]),
    )

    db.borrowRecords.forEach((record) => {
      const borrowDate = new Date(record.borrow_date)
      const borrowKey = `${borrowDate.getFullYear()}-${borrowDate.getMonth()}`
      const borrowBucket = bucketMap.get(borrowKey)
      if (borrowBucket) {
        borrowBucket.borrowed += 1
      }

      if (record.return_date) {
        const returnDate = new Date(record.return_date)
        const returnKey = `${returnDate.getFullYear()}-${returnDate.getMonth()}`
        const returnBucket = bucketMap.get(returnKey)
        if (returnBucket) {
          returnBucket.returned += 1
        }
      }
    })

    const recentActivities = db.borrowRecords
      .flatMap((record) => {
        const user = sanitizeUser(
          db.users.find((user) => user.id === record.user_id),
        )
        const book = db.books.find((book) => book.id === record.book_id)
        const activities: RecentActivity[] = [
          {
            id: `${record.id}-borrow`,
            action: 'borrow' as const,
            userName: user?.name || '未知用户',
            bookTitle: book?.title || '未知图书',
            timestamp: record.borrow_date,
          },
        ]

        if (record.return_date) {
          activities.push({
            id: `${record.id}-return`,
            action: 'return' as const,
            userName: user?.name || '未知用户',
            bookTitle: book?.title || '未知图书',
            timestamp: record.return_date,
          })
        }

        return activities
      })
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 6)

    const borrowTrend = monthBuckets.map(({ label, borrowed, returned }) => ({
      label,
      borrowed,
      returned,
    }))

    const categoryDistributionMap = new Map<string, number>()
    db.books.forEach((book) => {
      const categoryName =
        book.category && book.category.trim().length > 0
          ? book.category.trim()
          : '未分类'

      categoryDistributionMap.set(
        categoryName,
        (categoryDistributionMap.get(categoryName) ?? 0) + 1,
      )
    })

    const categoryDistribution = Array.from(categoryDistributionMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    return {
      borrowTrend,
      recentActivities,
      categoryDistribution,
    }
  }

export const getBooksFromLocalDb = async (
  filters?: BookFilters,
  pagination?: PaginationParams,
) => {
  const db = loadDatabase()
  let results = [...db.books]

  if (filters?.search) {
    const keyword = filters.search.trim().toLowerCase()
    results = results.filter(
      (book) =>
        book.title.toLowerCase().includes(keyword) ||
        book.author.toLowerCase().includes(keyword),
    )
  }

  if (filters?.category) {
    results = results.filter((book) => book.category === filters.category)
  }

  if (filters?.sort) {
    const key = filters.sort
    const ascending = filters.order !== 'desc'
    results.sort((a, b) => {
      const dir = ascending ? 1 : -1
      const getValue = (book: Book) => {
        switch (key) {
          case 'avg_rating':
          case 'review_count':
            return book[key]
          case 'publish_date':
            return book.publish_date ? new Date(book.publish_date).getTime() : 0
          case 'title':
          case 'author':
            return book[key].localeCompare ? book[key] : ''
          default:
            return 0
        }
      }

      const valueA = getValue(a)
      const valueB = getValue(b)

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return dir * valueA.localeCompare(valueB, 'zh-CN')
      }

      return dir * ((valueA as number) - (valueB as number))
    })
  } else {
    results.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )
  }

  const total = results.length
  let paged = results

  if (pagination) {
    const from = (pagination.page - 1) * pagination.limit
    const to = from + pagination.limit
    paged = results.slice(from, to)
  }

  return { books: paged, total }
}

export const getBookByIdFromLocalDb = async (id: string) => {
  const db = loadDatabase()
  return db.books.find((book) => book.id === id) || null
}

export interface BookPayload {
  title: string
  author: string
  isbn: string
  publisher?: string
  publish_date?: string
  category: string
  description?: string
  stock: number
  available: number
  cover_image?: string
}

export const createBookInLocalDb = async (payload: BookPayload) => {
  const db = loadDatabase()
  const timestamp = new Date().toISOString()
  const available = normalizeBookAvailability(payload.available, payload.stock)

  const newBook: Book = {
    id: uuidv4(),
    title: payload.title,
    author: payload.author,
    isbn: payload.isbn,
    publisher: payload.publisher,
    publish_date: payload.publish_date,
    category: payload.category,
    description: payload.description,
    stock: payload.stock,
    available,
    cover_image: payload.cover_image,
    avg_rating: 0,
    review_count: 0,
    created_at: timestamp,
    updated_at: timestamp,
  }

  db.books.push(newBook)
  saveDatabase(db)
  return newBook
}

export const updateBookInLocalDb = async (id: string, payload: BookPayload) => {
  const db = loadDatabase()
  const book = ensureBookExists(db, id)
  const timestamp = new Date().toISOString()
  const available = normalizeBookAvailability(payload.available, payload.stock)

  Object.assign(book, {
    title: payload.title,
    author: payload.author,
    isbn: payload.isbn,
    publisher: payload.publisher,
    publish_date: payload.publish_date,
    category: payload.category,
    description: payload.description,
    stock: payload.stock,
    available,
    cover_image: payload.cover_image,
    updated_at: timestamp,
  })

  saveDatabase(db)
  return book
}

export const deleteBookFromLocalDb = async (id: string) => {
  const db = loadDatabase()
  const bookCount = db.books.length
  db.books = db.books.filter((book) => book.id !== id)

  if (bookCount === db.books.length) {
    throw new Error('图书不存在')
  }

  db.reviews = db.reviews.filter((review) => review.book_id !== id)
  db.borrowRecords = db.borrowRecords.filter(
    (record) => record.book_id !== id,
  )

  saveDatabase(db)
}

export const getBorrowRecordsFromLocalDb = async (userId?: string) => {
  const db = loadDatabase()
  const now = Date.now()
  let shouldPersist = false

  db.borrowRecords.forEach((record) => {
    if (
      record.status === 'borrowed' &&
      !record.return_date &&
      new Date(record.due_date).getTime() < now
    ) {
      record.status = 'overdue'
      shouldPersist = true
    }
  })

  if (shouldPersist) {
    saveDatabase(db)
  }

  let records = [...db.borrowRecords]

  if (userId) {
    records = records.filter((record) => record.user_id === userId)
  }

  return records
    .map((record) => ({
      ...record,
      book: db.books.find((book) => book.id === record.book_id) || undefined,
      user: sanitizeUser(
        db.users.find((user) => user.id === record.user_id),
      ) || undefined,
    }))
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
}

export const borrowBookInLocalDb = async (bookId: string, userId: string) => {
  const db = loadDatabase()
  const book = ensureBookExists(db, bookId)
  ensureUserExists(db, userId)

  if (book.available <= 0) {
    throw new Error('该图书暂无库存')
  }

  const timestamp = new Date().toISOString()
  const record: StoredBorrowRecord = {
    id: uuidv4(),
    user_id: userId,
    book_id: bookId,
    borrow_date: timestamp,
    due_date: daysFromNow(BORROW_DURATION_DAYS),
    status: 'borrowed',
    renew_count: 0,
    created_at: timestamp,
  }

  book.available = Math.max(book.available - 1, 0)
  db.borrowRecords.unshift(record)
  saveDatabase(db)

  return record
}

export const renewBorrowRecordInLocalDb = async (recordId: string) => {
  const db = loadDatabase()
  const record = db.borrowRecords.find((item) => item.id === recordId)

  if (!record) {
    throw new Error('借阅记录不存在')
  }

  if (record.renew_count >= 2) {
    throw new Error('最多可续借两次')
  }

  if (record.status !== 'borrowed' && record.status !== 'overdue') {
    throw new Error('该记录无法续借')
  }

  record.due_date = daysFromNow(BORROW_DURATION_DAYS)
  record.renew_count += 1
  record.status = 'borrowed'
  saveDatabase(db)
}

export const returnBorrowRecordInLocalDb = async (
  recordId: string,
  bookId: string,
) => {
  const db = loadDatabase()
  const record = db.borrowRecords.find((item) => item.id === recordId)

  if (!record) {
    throw new Error('借阅记录不存在')
  }

  if (record.status === 'returned') {
    throw new Error('该图书已归还')
  }

  const book = ensureBookExists(db, bookId)
  record.return_date = new Date().toISOString()
  record.status = 'returned'
  book.available = normalizeBookAvailability(book.available + 1, book.stock)

  saveDatabase(db)
}

export const getReviewsForBookFromLocalDb = async (bookId?: string) => {
  if (!bookId) return []
  const db = loadDatabase()

  return db.reviews
    .filter((review) => review.book_id === bookId)
    .map((review) => ({
      ...review,
      user: sanitizeUser(
        db.users.find((user) => user.id === review.user_id),
      ) || undefined,
    }))
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
}

export const addReviewToLocalDb = async (
  bookId: string,
  userId: string,
  rating: number,
  comment?: string,
) => {
  const db = loadDatabase()
  ensureBookExists(db, bookId)
  ensureUserExists(db, userId)

  const review: StoredReview = {
    id: uuidv4(),
    user_id: userId,
    book_id: bookId,
    rating,
    comment,
    created_at: new Date().toISOString(),
  }

  db.reviews.unshift(review)

  const relatedReviews = db.reviews.filter((item) => item.book_id === bookId)
  const avg =
    relatedReviews.reduce((sum, item) => sum + item.rating, 0) /
    relatedReviews.length

  const book = ensureBookExists(db, bookId)
  book.avg_rating = parseFloat(avg.toFixed(2))
  book.review_count = relatedReviews.length

  saveDatabase(db)
}

export const loginWithLocalDb = async (credentials: LoginCredentials) => {
  const db = loadDatabase()
  const user = db.users.find(
    (item) => item.email.toLowerCase() === credentials.email.toLowerCase(),
  )

  if (!user || user.password !== credentials.password) {
    throw new Error('邮箱或密码错误')
  }

  return sanitizeUser(user)
}

export const registerWithLocalDb = async (data: RegisterData) => {
  const db = loadDatabase()
  const existing = db.users.find(
    (user) => user.email.toLowerCase() === data.email.toLowerCase(),
  )

  if (existing) {
    throw new Error('该邮箱已注册')
  }

  const timestamp = new Date().toISOString()
  const newUser: StoredUser = {
    id: uuidv4(),
    email: data.email,
    name: data.name,
    role: 'user',
    created_at: timestamp,
    updated_at: timestamp,
    password: data.password,
  }

  db.users.push(newUser)
  saveDatabase(db)

  return sanitizeUser(newUser)
}

export const getUserByIdFromLocalDb = async (id: string) => {
  const db = loadDatabase()
  return sanitizeUser(db.users.find((user) => user.id === id))
}

export const resetLocalDatabase = () => {
  cachedDB = clone(seedDatabase)
  if (hasWindow) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedDB))
  }
}
