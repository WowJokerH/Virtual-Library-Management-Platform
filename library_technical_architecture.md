## 1. 架构概览

```mermaid
graph TD
  A[浏览器] --> B[React 单页应用]
  B --> C[Zustand Store]
  B --> D[localDatabase 服务]
  D --> E[localStorage (library-local-db)]
```

- **前端单体**：所有界面、逻辑均在客户端完成，适合 PoC、培训或离线演示。
- **localDatabase 服务层**：`src/lib/localDatabase.ts` 负责生成种子数据、读写 localStorage，并提供与后端等价的接口。
- **Hooks 调度**：`useBooks`、`useBorrowRecords`、`useAdminDashboardData` 等自定义 hooks 调用服务层并管理 loading / error / cache。

## 2. 关键技术
| 模块 | 技术/库 | 说明 |
|------|---------|------|
| 构建 | Vite + TypeScript | 极速开发、内置 TS 校验 |
| UI | React 18 + Tailwind CSS + Lucide | 组件化开发与现代化样式 |
| 状态 | Zustand | 管理认证信息及共享状态 |
| 数据/图表 | localStorage + Recharts | 本地持久化、图表展示 |
| 提示 | Sonner | 操作反馈 |

## 3. 路由设计
| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | `Home` | 推荐图书与搜索入口 |
| `/search` | `Search` | 图书搜索及过滤页 |
| `/book/:id` | `BookDetail` | 图书详情、借阅与评价 |
| `/profile` | `Profile` | 个人信息、借阅记录（需登录） |
| `/admin` | `Admin` | 仪表盘 & 管理（需管理员身份） |
| `/login` | `Login` | 登录 |
| `/register` | `Register` | 注册 |

路由由 `React Router` 在 `App.tsx` 中定义，并在 `ProtectedRoute` 中注入权限校验。

## 4. 本地服务层（模拟 API）

`src/lib/localDatabase.ts` 等同于前端的轻量“仓储”层，导出的函数即视为 API：

| 函数 | 作用 |
|------|------|
| `initializeLocalDatabase` | 初始化 localStorage，补齐示例数据 |
| `getBooksFromLocalDb(filters, pagination)` | 搜索/分类/排序/分页查询图书 |
| `createBookInLocalDb / updateBookInLocalDb / deleteBookFromLocalDb` | 图书 CRUD |
| `getBookByIdFromLocalDb` | 查询单本图书 |
| `borrowBookInLocalDb / renewBorrowRecordInLocalDb / returnBorrowRecordInLocalDb` | 借阅生命周期 |
| `getBorrowRecordsFromLocalDb` | 获取用户或全部借阅记录 |
| `getReviewsForBookFromLocalDb / addReviewToLocalDb` | 评论模块 |
| `loginWithLocalDb / registerWithLocalDb / getUserByIdFromLocalDb` | 认证、用户信息 |
| `getLibraryStatsFromLocalDb` | 总册数、注册用户、当前借阅统计 |
| `getAdminDashboardDataFromLocalDb` | 借阅趋势、最近操作等仪表盘数据 |

所有方法均返回 Promise，以模拟真实异步 API，方便未来替换成服务器接口。

## 5. 数据模型
核心类型定义在 `src/types/index.ts`，主要字段如下：

- `User`：`id`，`email`，`name`，`role`，`created_at`，`updated_at`
- `Book`：`title`，`author`，`isbn`，`category`，`stock`，`available`，`avg_rating`，`review_count`...
- `BorrowRecord`：`user_id`，`book_id`，`borrow_date`，`due_date`，`return_date`，`status`，`renew_count`
- `Review`：`rating`，`comment`，`created_at`
- `LibraryStats` / `AdminDashboardData`：仪表盘指标对象

localDatabase 中的 `LibraryDB` 接口直接使用这些类型，并扩展出存储层所需的 `password` 字段等。

## 6. 状态与 Hooks
| Hook | 描述 |
|------|------|
| `useAuth` / `useAuthActions` | 管理当前用户、登录/注册/登出逻辑 |
| `useBooks` | 处理图书查询、loading 状态与分页 |
| `useBook` | 单本图书详情 |
| `useBorrowRecords` | 借阅记录列表及借阅/续借/归还动作 |
| `useReviews` | 书评列表与新增 |
| `useLibraryStats` | 仪表盘 KPI（总册数等） |
| `useAdminDashboardData` | 借阅趋势、最近操作 |

Hooks 将 UI 与数据层解耦，使得未来替换真实 API 时代码改动集中在服务层内部。

## 7. 构建与质量
- **TypeScript**：通过 `npm run check` 执行增量编译，保证无类型错误。
- **ESLint**：`npm run lint` 遵循官方 `eslint@9` + React Hooks & Refresh 规则。
- **Tailwind**：集中在 `src/index.css` 与 `tailwind.config.js`。
- **打包**：`npm run build` 生成 `dist/`，可通过 `npm run preview` 进行本地预览。

## 8. 扩展建议
- 将 `localDatabase` 替换为真实 REST/GraphQL 接口，仅需在 hooks 中统一处理。
- 可在 Zustand 中增加模块化切片，以满足更复杂的跨页面状态共享。
- 管理员“借阅管理/用户管理”标签页可逐步引入审批、角色管理等高级场景。
