# 易宿酒店预订平台

## 项目概述

易宿酒店预订平台是一个面向现代旅游出行场景的综合服务体系，旨在为酒店商家与终端消费者之间搭建高效、便捷的信息交互桥梁。本项目分为两个核心模块：

- **管理酒店信息系统（PC 端）**：供酒店商家录入管理酒店信息，管理员审核发布酒店信息
- **酒店预订流程（移动端 H5）**：供用户查询、浏览和预订酒店

---

## 技术栈

### 后端

| 技术 | 版本 | 选择理由 |
|------|------|----------|
| Node.js + NestJS | 10+ | 模块化架构、TypeScript 支持、依赖注入，适合构建可维护的企业级应用 |
| PostgreSQL | 12+ | 强大的关系型数据库，支持复杂查询和事务，适合存储酒店预订等结构化数据 |
| Prisma | 5+ | TypeScript ORM，提供类型安全的数据库操作，简化数据库交互 |
| JWT | - | 无状态认证，便于水平扩展，适合前后端分离架构 |
| bcrypt | - | 安全的密码哈希算法，保护用户密码安全 |
| multer | - | 处理 multipart/form-data，支持图片文件上传 |
| Swagger | - | 自动生成交互式 API 文档 |

### 前端（PC 管理端 admin-web）

| 技术 | 选择理由 |
|------|----------|
| React 18 + TypeScript | 组件化开发，类型安全 |
| Vite | 极速开发构建工具 |
| Ant Design 5 | 企业级 PC UI 组件库 |
| React Router 6 | 客户端路由管理 |
| Zustand | 轻量级状态管理，持久化 token |
| Axios | HTTP 请求，自动注入 JWT |

### 前端（移动端 mobile-web）

| 技术 | 选择理由 |
|------|----------|
| React 18 + TypeScript | 组件化开发，类型安全 |
| Vite | 极速开发构建工具 |
| antd-mobile 5 | 移动端 H5 UI 组件库（非 Vant，Vant 是 Vue 专用） |
| React Router 6 | 客户端路由管理 |
| Axios | HTTP 请求 |

---

## 项目结构

```
Ctrip---Fifth-FrontEnd-Bootcamp-main/
├── admin-web/                          # PC 管理端（商户 + 管理员）
│   ├── src/
│   │   ├── api/                        # Axios 请求封装
│   │   │   ├── http.ts                 # Axios 实例，baseURL=/api，自动注入 JWT，401 跳登录
│   │   │   ├── auth.ts                 # register / login / profile
│   │   │   ├── hotels.ts               # 酒店 CRUD + 审核接口
│   │   │   ├── reservations.ts         # 预订管理接口
│   │   │   └── tags.ts                 # 标签 CRUD
│   │   ├── store/
│   │   │   └── auth.ts                 # Zustand 状态（token + user），持久化到 localStorage
│   │   ├── types/
│   │   │   └── index.ts                # 全局 TypeScript 类型
│   │   ├── router/
│   │   │   ├── index.tsx               # 路由配置
│   │   │   └── RequireAuth.tsx         # 路由守卫（检查 token + role）
│   │   └── pages/
│   │       ├── auth/
│   │       │   ├── LoginPage.tsx
│   │       │   └── RegisterPage.tsx
│   │       ├── merchant/               # 商户角色页面
│   │       │   ├── MerchantLayout.tsx  # 侧边栏布局
│   │       │   ├── HotelListPage.tsx   # 酒店列表（含状态标签）
│   │       │   ├── HotelFormPage.tsx   # 创建/编辑酒店（房型、设施、拖拽上传图片）
│   │       │   ├── HotelDetailPage.tsx # 酒店详情（含拒绝原因提示）
│   │       │   └── ReservationsPage.tsx# 预订管理（入住/退房/取消）
│   │       └── admin/                  # 管理员角色页面
│   │           ├── AdminLayout.tsx
│   │           ├── ReviewListPage.tsx  # 待审核酒店列表
│   │           ├── ReviewDetailPage.tsx# 审核详情（通过/拒绝/下线）
│   │           └── TagsPage.tsx        # 标签 CRUD
│   └── vite.config.ts
├── mobile-web/                         # 移动端 H5（用户预订）
│   ├── src/
│   │   ├── api/
│   │   │   ├── http.ts                 # Axios 实例，baseURL=/api
│   │   │   ├── hotels.ts               # 搜索（解析分页响应）、详情、标签
│   │   │   └── reservations.ts         # 创建预订、查询预订
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── router/
│   │   │   └── index.tsx
│   │   └── pages/
│   │       ├── home/
│   │       │   └── HomePage.tsx        # 首页（搜索栏 + 标签 + 推荐酒店）
│   │       ├── search/
│   │       │   └── SearchPage.tsx      # 搜索结果（关键词 + 星级筛选）
│   │       ├── hotel/
│   │       │   └── HotelDetailPage.tsx # 酒店详情（图片/设施/景点/优惠/房型选择）
│   │       └── booking/
│   │           ├── BookingPage.tsx     # 预订填写（DatePicker + 联系人）
│   │           └── ConfirmPage.tsx     # 预订确认
│   └── vite.config.ts
├── Ctrip---Fifth-FrontEnd-Bootcamp-main/
│   └── backend/                        # NestJS 后端（注意：解压产生的嵌套路径）
│       ├── prisma/
│       │   └── schema.prisma           # 数据库模型定义
│       ├── src/
│       │   ├── main.ts                 # 入口：CORS、静态文件、ValidationPipe、监听 0.0.0.0:3000
│       │   ├── app.module.ts           # 根模块
│       │   ├── app.controller.ts       # 文件上传接口 POST /upload
│       │   ├── auth/                   # 认证模块
│       │   │   ├── dto/
│       │   │   ├── guards/auth.guard.ts# JWT 路由守卫
│       │   │   ├── auth.controller.ts  # POST /api/auth/register, /login, GET /profile
│       │   │   ├── auth.module.ts
│       │   │   └── auth.service.ts
│       │   ├── hotels/                 # 酒店管理模块
│       │   │   ├── dto/
│       │   │   │   ├── create-hotel.dto.ts  # 含 rooms/facilities/images 嵌套 DTO
│       │   │   │   ├── update-hotel.dto.ts
│       │   │   │   └── query-hotels.dto.ts
│       │   │   ├── hotels.controller.ts
│       │   │   ├── hotels.module.ts
│       │   │   └── hotels.service.ts
│       │   ├── reservations/           # 预订模块
│       │   │   ├── dto/create-reservation.dto.ts
│       │   │   ├── reservations.controller.ts
│       │   │   └── reservations.service.ts
│       │   ├── tags/                   # 标签模块
│       │   ├── guests/                 # 入住人员模块
│       │   └── prisma/                 # Prisma 服务
│       ├── package.json
│       └── tsconfig.json
└── documents/
    ├── PRD.md                          # 产品需求文档
    └── FRONTEND.md                     # 前端技术文档
```

> 注意：后端实际路径是 `Ctrip---Fifth-FrontEnd-Bootcamp-main/Ctrip---Fifth-FrontEnd-Bootcamp-main/backend/`，这是解压时产生的嵌套，不是 bug。

---

## 快速启动

### 前置条件

- Node.js 16+
- Docker Desktop（运行 PostgreSQL 容器）

### 1. 启动数据库

```bash
docker start hotel_pg
```

Docker 容器：`hotel_pg`，端口 5432，密码 `123456`

### 2. 启动后端

```bash
cd Ctrip---Fifth-FrontEnd-Bootcamp-main/backend
npm install
npm run start:dev   # http://localhost:3000
```

### 3. 启动 PC 管理端

```bash
cd admin-web
npm install
npm run dev         # http://localhost:5173
```

### 4. 启动移动端

```bash
cd mobile-web
npm install
npm run dev         # http://localhost:5174
                    # 手机预览：http://<本机IP>:5174（同 WiFi）
```

### 环境变量

创建 `backend/.env`：

```env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/hotel_db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
```

### 数据库迁移

```bash
cd Ctrip---Fifth-FrontEnd-Bootcamp-main/backend
npx prisma migrate dev --name init
```

---

## 路由结构

### PC 管理端（admin-web，端口 5173）

```
/login                      登录
/register                   注册（选择角色：merchant / admin）
/merchant/hotels            商户酒店列表        [需要 merchant 角色]
/merchant/hotels/new        创建酒店
/merchant/hotels/:id        酒店详情
/merchant/hotels/:id/edit   编辑酒店
/merchant/reservations      预订管理
/admin/review               待审核列表          [需要 admin 角色]
/admin/review/:id           审核详情
/admin/tags                 标签管理
```

### 移动端（mobile-web，端口 5174）

```
/                                   首页
/search?keyword=xx&tag=xx           搜索结果
/hotel/:id                          酒店详情
/booking/:hotelId/:roomId           预订填写
/booking/confirm/:reservationId     预订确认
```

---

## API 接口

Swagger 文档：启动后端后访问 `http://localhost:3000/api`

### 认证

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/auth/register | 注册（merchant / admin） | 否 |
| POST | /api/auth/login | 登录，返回 JWT | 否 |
| GET | /api/auth/profile | 当前用户信息 | 是 |

### 酒店

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/hotels | 搜索酒店（分页、关键词、星级、价格筛选） | 否 |
| GET | /api/hotels/:id | 酒店详情 | 否 |
| POST | /api/hotels | 创建酒店 | 是（merchant） |
| PUT | /api/hotels/:id | 更新酒店 | 是（merchant） |
| GET | /api/hotels/merchant | 商户自己的酒店列表 | 是 |
| GET | /api/hotels/verification | 待审核酒店列表 | 是（admin） |
| PUT | /api/hotels/:id/approve | 审核通过 | 是（admin） |
| PUT | /api/hotels/:id/reject | 审核拒绝 | 是（admin） |
| PUT | /api/hotels/:id/offline | 下线 | 是（admin） |
| PUT | /api/hotels/:id/online | 上线 | 是（admin） |

### 预订

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/reservations | 创建预订 | 否 |
| GET | /api/reservations/:id | 预订详情 | 否 |
| GET | /api/reservations/hotel/:hotelId | 酒店预订列表 | 是 |
| PUT | /api/reservations/:id/check-in | 办理入住 | 是 |
| PUT | /api/reservations/:id/check-out | 办理退房 | 是 |

### 其他

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/tags | 标签列表 | 否 |
| POST | /upload | 上传图片，返回 `{ url: "/uploads/xxx.jpg" }` | 否 |

---

## 数据库设计

### 数据模型

**User（用户表）**

| 字段 | 类型 | 约束 | 描述 |
|------|------|------|------|
| id | String | @id @default(cuid()) | 用户 ID |
| email | String | @unique | 邮箱 |
| password | String | - | 密码（bcrypt 加密） |
| name | String | - | 用户名 |
| role | UserRole | - | 角色（merchant / admin） |
| createdAt | DateTime | @default(now()) | 创建时间 |
| updatedAt | DateTime | @updatedAt | 更新时间 |

**Hotel（酒店表）**

| 字段 | 类型 | 约束 | 描述 |
|------|------|------|------|
| id | String | @id | 酒店 ID |
| nameZh | String | - | 酒店中文名 |
| nameEn | String | - | 酒店英文名 |
| address | String | - | 酒店地址 |
| starRating | Int | - | 酒店星级（1-5） |
| openingDate | DateTime | - | 开业时间 |
| description | String? | - | 酒店描述 |
| status | HotelStatus | - | 状态（pending/approved/rejected/offline） |
| rejectionReason | String? | - | 拒绝原因 |
| merchantId | String | - | 商户 ID（外键） |

**HotelRoom（酒店房型表）**

| 字段 | 类型 | 描述 |
|------|------|------|
| id | String | 房型 ID |
| hotelId | String | 酒店 ID（外键） |
| name | String | 房型名称 |
| description | String? | 房型描述 |
| price | Decimal(10,2) | 价格 |
| capacity | Int | 容纳人数 |
| quantity | Int | 房间数量 |

**Reservation（预订表）**

| 字段 | 类型 | 描述 |
|------|------|------|
| id | String | 预订 ID |
| hotelId | String | 酒店 ID（外键） |
| roomId | String | 房型 ID（外键） |
| checkInDate | DateTime | 入住日期 |
| checkOutDate | DateTime | 离店日期 |
| guestName | String | 客人姓名 |
| guestPhone | String | 客人电话 |
| guestEmail | String | 客人邮箱 |
| status | ReservationStatus | 状态（confirmed/check_in/check_out/cancelled） |
| totalPrice | Decimal(10,2) | 总价格 |

**其他数据模型**

- `HotelFacility`：酒店设施（name, category）
- `HotelImage`：酒店图片（url, description, isMain）
- `HotelPromotion`：酒店优惠（name, discountType, discountValue, startDate, endDate）
- `HotelNearbyAttraction`：附近景点（name, type, distance）
- `HotelTag` / `HotelTagRelation`：标签及酒店-标签多对多关联
- `Guest` / `ReservationGuest`：入住人员及预订-人员多对多关联

### 枚举类型

```
UserRole:           merchant | admin
HotelStatus:        pending | approved | rejected | offline
ReservationStatus:  confirmed | check_in | check_out | cancelled
DiscountType:       percentage | fixed | package
AttractionType:     attraction | transportation | shopping
IdType:             id_card | passport | other
```

---

## 核心业务流程

### 认证流程

```
注册/登录 → 后端返回 JWT token
→ 存入 Zustand store + localStorage（持久化）
→ Axios 拦截器自动在请求头加 Authorization: Bearer <token>
→ 收到 401 → 自动清除状态并跳转 /login
```

### 酒店上线流程

```
商户创建酒店（status: pending）
→ 管理员在待审核列表查看
→ 审核通过（status: approved）或拒绝（status: rejected，填写原因）
→ 通过后酒店在移动端可见
→ 管理员可随时下线（status: offline）/ 重新上线
```

### 图片上传流程

```
商户拖拽图片到 HotelFormPage
→ Upload.Dragger 发送 POST /upload（multipart/form-data）
→ 后端 multer 保存到 backend/uploads/ 目录
→ 返回 { url: "/uploads/xxx.jpg" }
→ 提交表单时将 url 数组随酒店数据一起保存到数据库
→ 移动端通过 /uploads/xxx.jpg 访问图片（Vite proxy 转发）
```

### 预订流程

```
移动端用户浏览酒店详情
→ 选择房型 → 跳转预订填写页
→ 填写入住/离店日期、联系人信息
→ 提交 POST /api/reservations
→ 跳转预订确认页（GET /api/reservations/:id）
→ 商户在管理端办理入住（check_in）/ 退房（check_out）
```

---

## Vite 代理配置

两个前端项目均通过 Vite 代理将请求转发到后端（端口 3000）：

```ts
proxy: {
  '/api':     { target: 'http://localhost:3000', changeOrigin: true },
  '/uploads': { target: 'http://localhost:3000', changeOrigin: true },
  '/upload':  { target: 'http://localhost:3000', changeOrigin: true },  // admin-web only
}
```

---

## 已知问题与修复记录

| 问题 | 根因 | 修复 |
|------|------|------|
| 移动端搜索无结果 | ValidationPipe 缺少 `transform: true`，query 参数字符串被 `@IsNumber()` 拒绝 | main.ts 加 `transform: true, enableImplicitConversion: true` |
| 管理员看不到待审核酒店 | controller 缺少 `/verification` 路由，且路由顺序错误（`:id` 在前） | 添加路由并调整顺序 |
| 移动端酒店详情报错 | `GET /api/hotels/:id` 有 `@UseGuards(AuthGuard)`，未登录用户 401 | 移除该路由的认证守卫 |
| 预订日期选择器不显示 | `DatePicker` 套在 `Popup` 里导致渲染问题 | 改用 `DatePicker` 自带的 `visible` 属性 |
| 创建预订 400 报错 | DTO 缺少 `@Type(() => Date)`，`@IsDecimal()` 不接受数字 | 加 `@Type(() => Date)`，改为 `@IsNumber()` |
| 图片上传 404 | `POST /api/upload` 被 Swagger 的 `/api` 路径拦截 | 改为 `POST /upload` |
| 房型为空 | `createHotel` service 未保存 rooms/facilities/images | DTO 和 service 均添加嵌套数据支持 |

---

## 开发规范

### 代码规范

- TypeScript：所有代码使用 TypeScript，确保类型安全
- ESLint + Prettier：统一代码风格
- Git 提交：语义化提交信息，格式为 `type(scope): description`

### API 规范

- RESTful 设计，使用合适的 HTTP 方法和状态码
- 统一错误响应格式，包含错误码和错误信息
- JWT 认证，设置合理的过期时间（默认 7d）

### 安全规范

- 密码使用 bcrypt 加密存储
- 所有用户输入通过 ValidationPipe 验证
- Prisma 参数化查询防止 SQL 注入
- CORS 已启用，生产环境应限制允许的域名

---

## 部署

### 后端

```bash
cd Ctrip---Fifth-FrontEnd-Bootcamp-main/backend
npm run build
npm run start:prod
```

### 前端

```bash
# PC 管理端
cd admin-web && npm run build   # 产物在 dist/

# 移动端
cd mobile-web && npm run build  # 产物在 dist/
```

---

## 待优化方向

| 优先级 | 功能 |
|--------|------|
| P1 | 移动端用户登录，支持查看历史预订 |
| P1 | 商户端预订管理按酒店筛选 |
| P2 | 首页骨架屏 loading 效果 |
| P2 | 搜索页价格区间筛选 |
| P2 | 管理员端数据统计 Dashboard |
| P3 | 代码分割（admin-web 打包体积较大） |
| P3 | 移动端 PWA 支持 |
| P3 | Redis 缓存热点酒店数据 |

---

## 项目创新性

- **完整的审核流程**：商户上传酒店信息后，管理员审核通过才能上线，确保信息质量
- **多维度筛选**：支持按星级、价格、设施、标签等多维度筛选酒店
- **拖拽图片上传**：商户端支持拖拽上传酒店图片，体验友好
- **响应式双端设计**：PC 管理端 + 移动端 H5，覆盖不同使用场景
- **模块化架构**：前后端分离，NestJS 模块化设计，便于维护和扩展
- **灵活的优惠系统**：支持折扣、固定金额、套餐等多种优惠类型

---

> 携程 - 第五期前端训练营大作业
