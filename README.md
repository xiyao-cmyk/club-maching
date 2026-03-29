# 社团招新智能匹配平台

高校社团招新智能匹配平台，帮助新生快速发现并加入适合的社团。

## 项目结构

```
club-matching-platform/
├── backend/          # NestJS + TypeORM 后端
├── frontend/         # Vue 3 + Element Plus 前端
├── database/         # 数据库初始化脚本
└── docker-compose.yml
```

## 角色说明

| 角色 | 说明 |
|------|------|
| 新生（student） | 完成问卷 → 获取推荐 → 查看社团 → 在线报名 → 追踪状态 |
| 社团管理员（club_admin） | 维护社团主页 → 配置招新 → 筛选候选人 → 录取 |
| 校方管理员（admin） | 审核社团 → 管理批次 → 查看全局数据 |

## 技术栈

- **前端**：Vue 3 + Vite + TypeScript + Element Plus + Pinia + Vue Router
- **后端**：NestJS + TypeORM + MySQL + Redis + JWT
- **部署**：Docker + Nginx

## 快速启动

### 前置依赖

- Node.js 18+
- MySQL 8.0+
- Redis 6+ (可选，不启动时关闭缓存)

### 数据库初始化

```bash
mysql -u root -p < database/schema.sql
```

### 后端启动

```bash
cd backend
cp .env.example .env
# 编辑 .env 填写数据库连接信息
npm install
npm run start:dev
```

后端默认运行在 http://localhost:3000

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

前端默认运行在 http://localhost:5173

### Docker 一键启动

```bash
docker-compose up -d
```

## 默认账号

初始化脚本会创建以下测试账号：

| 账号 | 密码 | 角色 |
|------|------|------|
| admin@test.com | Admin123! | 校方管理员 |
| club@test.com | Admin123! | 社团管理员 |
| student@test.com | Admin123! | 新生 |

## API 文档

后端启动后访问：http://localhost:3000/api/docs

## 核心功能

### 智能推荐算法

推荐分 = 兴趣匹配(40%) + 时间投入匹配(20%) + 技能匹配(20%) + 目标诉求(15%) + 热度修正(5%)

每个推荐项均提供可解释的推荐理由。

### 兴趣问卷

5 个维度、12 道题，覆盖：兴趣方向、可投入时间、技能特长、性格偏好、参加目标。

### 报名流程

在线报名 → 社团初筛 → 面试通知 → 录取/淘汰 → 入群通知
