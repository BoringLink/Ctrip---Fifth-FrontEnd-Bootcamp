# 易宿酒店预订平台 — 技术文档

## 项目目录结构

```
Ctrip---Fifth-FrontEnd-Bootcamp-main/
├── admin-web/                          # PC 管理端（商户 + 管理员）
├── mobile-web/                         # 移动端 H5（用户预订）
├── documents/                          # 项目文档
│   ├── PRD.md                          # 产品需求文档
│   └── FRONTEND.md                     # 本文档
└── Ctrip---Fifth-FrontEnd-Bootcamp-main/
    └── backend/                        # NestJS 后端（原始位置，注意嵌套路径）
```

> 注意：后端实际路径是 `Ctrip---Fifth-FrontEnd-Bootcamp-main/Ctrip---Fifth-FrontEnd-Bootcamp-main/backend/`，这是解压时产生的嵌套，不是 bug。

---

## 启动方式

```bash
# 1. 启动数据库（需要 Docker Desktop 已运行）
docker start hotel_pg

# 2. 启动后端
cd Ctrip---Fifth-FrontEnd-Bootcamp-main/backend
npm run start:dev   # http://localhost:3000

# 3. 启动 PC 管理端
cd admin-web
npm run dev         # http://localhost:5173

# 4. 启动移动端
cd mobile-web
npm run dev         # http://localhost:5174
                    # 手机预览：http://192.168.1.28:5174（同 WiFi）
```

---

## 后端（NestJS）

### 技术栈
- NestJS + TypeScript
- PostgreSQL + Prisma ORM
- JWT 认证（`@nestjs/jwt`）
- multer 文件上传（`@nestjs/platform-express`）
- Swagger API 文档：http://localhost:3000/api

### 目录结构
```
backend/src/
├── main.ts                     # 入口：CORS、静态文件、ValidationPipe、监听 0.0.0.0:3000
├── app.module.ts               # 根模块
├── app.controller.ts           # 文件上传接口 POST /upload
├── auth/                       # 认证模块
│   ├── auth.controller.ts      # POST /api/auth/register, /api/auth/login, GET /api/auth/profile
│   ├── auth.service.ts
│   ├── guards/auth.guard.ts    # JWT 路由守卫
│   └── dto/
├── hotels/                     # 酒店模块
│   ├── hotels.controller.ts    # 酒店 CRUD + 审核 + 上下线
│   ├── hotels.service.ts       # 业务逻辑（含价格筛选、分页）
│   └── dto/
│       ├── create-hotel.dto.ts # 含 rooms/facilities/images 嵌套 DTO
│       ├── update-hotel.dto.ts
│       └── query-hotels.dto.ts
├── reservations/               # 预订模块
│   ├── reservations.controller.ts
│   ├── reservations.service.ts
│   └── dto/create-reservation.dto.ts
├── tags/                       # 标签模块
├── guests/                     # 入住人员模块
└── prisma/schema.prisma        # 数据库模型
```

### 关键 API 路由
| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/auth/register | 注册 | 否 |
| POST | /api/auth/login | 登录，返回 JWT | 否 |
| GET | /api/auth/profile | 当前用户信息 | 是 |
| GET | /api/hotels | 搜索酒店（分页） | 否 |
| GET | /api/hotels/:id | 酒店详情 | 否 |
| POST | /api/hotels | 创建酒店 | 是（merchant） |
| PUT | /api/hotels/:id | 更新酒店 | 是（merchant） |
| GET | /api/hotels/merchant | 商户自己的酒店 | 是 |
| GET | /api/hotels/verification | 待审核酒店列表 | 是（admin） |
| PUT | /api/hotels/:id/approve | 审核通过 | 是（admin） |
| PUT | /api/hotels/:id/reject | 审核拒绝 | 是（admin） |
| PUT | /api/hotels/:id/offline | 下线 | 是（admin） |
| PUT | /api/hotels/:id/online | 上线 | 是（admin） |
| POST | /api/reservations | 创建预订 | 否 |
| GET | /api/reservations/:id | 预订详情 | 否 |
| GET | /api/reservations/hotel/:hotelId | 酒店预订列表 | 是 |
| PUT | /api/reservations/:id/check-in | 办理入住 | 是 |
| PUT | /api/reservations/:id/check-out | 办理退房 | 是 |
| GET | /api/tags | 标签列表 | 否 |
| POST | /upload | 上传图片，返回 `{ url: "/uploads/xxx.jpg" }` | 否 |

### 数据库配置
```env
# backend/.env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/hotel_db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
```

Docker 容器：`hotel_pg`，端口 5432，密码 `123456`

---

## admin-web（PC 管理端）

### 技术栈
React 18 + TypeScript + Vite + Ant Design 5 + React Router 6 + Zustand + Axios

### 目录结构
```
admin-web/src/
├── api/
│   ├── http.ts             # Axios 实例，baseURL=/api，自动注入 JWT，401 跳登录
│   ├── auth.ts             # register / login / profile
│   ├── hotels.ts           # 酒店 CRUD + 审核接口
│   ├── reservations.ts     # 预订管理接口
│   └── tags.ts             # 标签 CRUD
├── store/
│   └── auth.ts             # Zustand 状态（token + user），持久化到 localStorage
├── types/
│   └── index.ts            # 全局 TypeScript 类型
├── router/
│   ├── index.tsx           # 路由配置
│   └── RequireAuth.tsx     # 路由守卫（检查 token + role）
└── pages/
    ├── auth/
    │   ├── LoginPage.tsx
    │   └── RegisterPage.tsx
    ├── merchant/           # 商户角色页面
    │   ├── MerchantLayout.tsx      # 侧边栏布局
    │   ├── HotelListPage.tsx       # 酒店列表（含状态标签）
    │   ├── HotelFormPage.tsx       # 创建/编辑酒店（房型、设施、拖拽上传图片）
    │   ├── HotelDetailPage.tsx     # 酒店详情（含拒绝原因提示）
    │   └── ReservationsPage.tsx    # 预订管理（入住/退房/取消）
    └── admin/              # 管理员角色页面
        ├── AdminLayout.tsx
        ├── ReviewListPage.tsx      # 待审核酒店列表
        ├── ReviewDetailPage.tsx    # 审核详情（通过/拒绝/下线）
        └── TagsPage.tsx            # 标签 CRUD
```

### 路由
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

### Vite 代理
```ts
proxy: {
  '/api':     { target: 'http://localhost:3000' },  // API 请求
  '/uploads': { target: 'http://localhost:3000' },  // 图片访问
  '/upload':  { target: 'http://localhost:3000' },  // 图片上传
}
```

---

## mobile-web（移动端 H5）

### 技术栈
React 18 + TypeScript + Vite + antd-mobile 5 + React Router 6 + Axios

> 注意：UI 库是 **antd-mobile**（React），不是 Vant（Vant 是 Vue 专用）

### 目录结构
```
mobile-web/src/
├── api/
│   ├── http.ts             # Axios 实例，baseURL=/api
│   ├── hotels.ts           # 搜索（解析分页响应）、详情、标签
│   └── reservations.ts     # 创建预订、查询预订
├── types/
│   └── index.ts
├── router/
│   └── index.tsx
└── pages/
    ├── home/
    │   └── HomePage.tsx            # 首页（搜索栏 + 标签 + 推荐酒店）
    ├── search/
    │   └── SearchPage.tsx          # 搜索结果（关键词 + 星级筛选）
    ├── hotel/
    │   └── HotelDetailPage.tsx     # 酒店详情（图片/设施/景点/优惠/房型选择）
    └── booking/
        ├── BookingPage.tsx         # 预订填写（DatePicker + 联系人）
        └── ConfirmPage.tsx         # 预订确认
```

### 路由
```
/                                   首页
/search?keyword=xx&tag=xx           搜索结果
/hotel/:id                          酒店详情
/booking/:hotelId/:roomId           预订填写
/booking/confirm/:reservationId     预订确认
```

### Vite 代理
```ts
proxy: {
  '/api':     { target: 'http://localhost:3000' },
  '/uploads': { target: 'http://localhost:3000' },
}
```

---

## 认证流程

```
注册/登录 → 后端返回 JWT token
→ 存入 Zustand store + localStorage（持久化）
→ Axios 拦截器自动在请求头加 Authorization: Bearer <token>
→ 收到 401 → 自动清除状态并跳转 /login
```

---

## 图片上传流程

```
商户拖拽图片到 HotelFormPage
→ 前端 Upload.Dragger 发送 POST /upload（multipart/form-data）
→ 后端 multer 保存到 backend/uploads/ 目录
→ 返回 { url: "/uploads/xxx.jpg" }
→ 提交表单时将 url 数组随酒店数据一起保存到数据库
→ 移动端通过 /uploads/xxx.jpg 访问图片（Vite proxy 转发）
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
