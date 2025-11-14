# 智慧图书馆管理系统

基于 React、TypeScript 与 Vite 的单页应用，使用内置本地数据库（localStorage）模拟真实后端，覆盖读者借阅与管理员运维的完整流程。

## 功能亮点
- **双角色体系**：邮箱注册/登录，区分管理员与普通读者，路由守卫确保只访问有权限的页面。
- **图书目录**：关键词模糊搜索、分类筛选、评分/出版时间排序与分页浏览，内置 50+ 示例图书。
- **借阅闭环**：借阅、续借（最多 2 次）、归还、逾期提醒一条龙；个人中心展示当前/历史记录。
- **读者互动**：详情页可评分与评论，自动累计平均分与评论数量。
- **管理面板**：仪表盘展示总册数、注册用户、当前借阅、借阅趋势、最近操作，并提供图书增删改 UI。

## 技术栈
- **框架**：React 18 · TypeScript · Vite
- **样式/交互**：Tailwind CSS · Lucide 图标 · Sonner 通知
- **状态管理**：Zustand（认证、图书、借阅数据）
- **图表**：Recharts
- **数据层**：`src/lib/localDatabase.ts` 读写 `localStorage`，集中封装用户/图书/借阅/评论逻辑

## 快速开始
```bash
git clone <repository-url>
cd library
npm install
npm run dev
```

构建 / 预览：
```bash
npm run build
npm run preview
```

> 首次启动会写入演示数据（localStorage 键名 `library-local-db`）。删除该键即可重置。

## 常用脚本
| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 产出生产构建 |
| `npm run preview` | 预览构建结果 |
| `npm run lint` | ESLint 检查 |
| `npm run check` | TypeScript 严格校验 |

## 内置账号
| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | `admin@library.local` | `admin123` |
| 读者示例 | `user1@library.local` | `password123` |

## 项目结构
```
src/
├── components/        # 可复用 UI、BookManagement、BookForm 等
├── hooks/             # 认证、图书、借阅、仪表盘等自定义 hooks
├── lib/
│   ├── localDatabase.ts  # 本地数据库封装与种子数据
│   └── utils.ts          # 日期、状态等工具函数
├── pages/             # Home / Search / BookDetail / Profile / Admin …
├── types/             # TypeScript 类型定义
├── App.tsx            # 路由与布局
└── main.tsx           # 应用入口
```

## 本地数据库说明
- `initializeLocalDatabase` 确保至少 50 本示例图书与默认账户。
- `getBooksFromLocalDb` 支持搜索、分类、排序、分页；借阅操作会实时影响库存与统计。
- `getLibraryStatsFromLocalDb` 与 `getAdminDashboardDataFromLocalDb` 为仪表盘提供实时统计。
- 数据存储在浏览器 `localStorage`，便于本地演示，也方便替换为真实后端。

## 后续规划
- 图书批量导入/导出
- 借阅审批、通知提醒
- 推荐算法与阅读画像
- 国际化与移动端优化

## 许可证
MIT License
