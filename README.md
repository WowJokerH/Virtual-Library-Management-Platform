# 智慧图书馆管理系统

基于 React 18 + TypeScript + Vite 构建的现代化图书馆管理单页应用，使用 localStorage 作为本地数据库，实现完整的图书借阅与管理功能，无需后端服务器即可独立运行。

## 核心特性

### 📚 完整的图书管理
- **图书浏览**：首页展示热门图书（按评分排序）和新书上架（按出版时间排序）
- **高级搜索**：支持标题、作者、ISBN 等关键词模糊搜索
- **多维筛选**：15+ 分类筛选（文学、历史、哲学、计算机等）
- **灵活排序**：按标题、作者、评分、评论数、出版日期排序，支持升序/降序
- **分页浏览**：可自定义每页显示 10/20/30 条记录
- **双视图模式**：网格视图和列表视图自由切换

### 👥 双角色权限体系
- **用户认证**：邮箱注册/登录，JWT 风格的会话管理（基于 Zustand）
- **角色区分**：管理员（admin）和普通读者（user）
- **权限控制**：路由守卫确保管理功能仅管理员可访问
- **个人中心**：查看个人信息、当前借阅、历史记录

### 🔄 完善的借阅流程
- **借阅管理**：一键借阅，自动更新图书库存和可用数量
- **智能续借**：支持续借功能，每本书最多续借 2 次
- **归还处理**：归还图书后自动恢复库存
- **状态追踪**：实时显示借阅中、已逾期、已归还等状态
- **逾期提醒**：自动标识逾期图书（30天借期）
- **借阅历史**：完整记录用户的所有借阅行为

### ⭐ 读者互动系统
- **图书评分**：5 星评分系统
- **评论功能**：用户可发表图书评论
- **实时统计**：自动计算平均评分和评论数量
- **详情展示**：图书详情页显示所有评论和评分

### 📊 管理员仪表盘
- **核心指标**：总图书数、注册用户、当前借阅、平均评分
- **借阅趋势**：柱状图展示近 6 个月的借阅/归还趋势
- **分类分布**：饼图展示图书分类占比
- **最近操作**：实时显示最近的借阅和归还活动
- **图书管理**：完整的图书增删改查功能



## 界面预览


![登录界面](pictures/image1.png)
![仪表盘统计](pictures/image2.png)
![图书管理界面](pictures/image3.png)
![借阅记录](pictures/image4.png)
![图书详情页](pictures/image5.png)
![数据统计](pictures/image6.png)

## 技术栈

### 前端框架
- **React 18**：采用 Hooks 和函数式组件
- **TypeScript**：完整的类型定义，提供开发时类型检查
- **Vite**：极速的开发服务器和构建工具

### UI 与样式
- **Tailwind CSS 3**：实用优先的 CSS 框架
- **Lucide React**：美观的 React 图标库
- **自定义组件**：Card、Button、Input 等基础 UI 组件

### 状态管理
- **Zustand**：轻量级状态管理，用于全局认证状态

### 数据可视化
- **Recharts**：基于 React 的图表库，用于仪表盘数据展示

### 路由
- **React Router v7**：单页应用路由管理，支持受保护路由

### 通知系统
- **Sonner**：优雅的 Toast 通知组件

### 工具库
- **uuid**：生成唯一标识符
- **clsx + tailwind-merge**：动态 className 管理

## 快速开始

### 环境要求
- Node.js >= 16
- npm 或 pnpm

### 安装依赖
```bash
git clone <repository-url>
cd library
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 `http://localhost:5173` 即可使用应用。

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

> **首次启动说明**：应用会自动在 localStorage 中初始化演示数据（键名：`library-local-db`），包含 50+ 本示例图书和默认账户。删除该键可重置所有数据。

## 可用脚本
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
- 借阅管理与用户管理

## 许可证
MIT License
