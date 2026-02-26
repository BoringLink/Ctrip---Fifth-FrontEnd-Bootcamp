# 易宿酒店预订平台

## 项目概述

易宿酒店预订平台是一个面向现代旅游出行场景的综合服务体系，旨在为酒店商家与终端消费者之间搭建高效、便捷的信息交互桥梁。本项目分为两个核心模块：

- **管理酒店信息系统** (PC站点)：供酒店商家录入管理酒店信息，管理员审核发布酒店信息
- **酒店预订流程** (移动端)：供用户查询、浏览和预订酒店

## 技术栈选择

### 后端技术栈

| 技术 | 选择理由 |
|------|----------|
| Node.js + NestJS | 模块化架构、TypeScript 支持、依赖注入系统，适合构建可维护的企业级应用 |
| PostgreSQL | 强大的关系型数据库，支持复杂查询和事务，适合存储酒店预订等结构化数据 |
| Prisma | TypeScript ORM，提供类型安全的数据库操作，简化数据库交互 |
| JWT | 无状态认证，便于水平扩展，适合前后端分离架构 |
| bcrypt | 安全的密码哈希算法，保护用户密码安全 |
| Multer | 用于处理酒店图片上传 |
| Swagger | 自动生成交互式 API 文档 |

### 前端技术栈

#### PC 管理端（yisu-hotel-pc）

| 技术 | 选择理由 |
|------|----------|
| Next.js（React 框架） | 服务端渲染、文件路由、API 路由，提升开发效率和 SEO |
| TypeScript | 静态类型检查，提高代码质量和可维护性 |
| Ant Design | 企业级 UI 组件库，提供丰富的高质量组件，快速搭建后台系统 |
| Axios | 基于 Promise 的 HTTP 客户端，支持拦截器，简化 API 调用 |
| Day.js | 轻量级日期处理库，用于日期格式化与转换 |

#### PC 管理端（admin-web）

| 技术 | 选择理由 |
|------|----------|
| React 18 + TypeScript | 组件化开发，类型安全 |
| Vite | 极速开发构建工具 |
| Ant Design 5 | 企业级 PC UI 组件库 |
| React Router 6 | 客户端路由管理 |
| Zustand | 轻量级状态管理，持久化 token |
| Axios | HTTP 请求，自动注入 JWT |

#### 移动端 App（mobile-app）

| 技术 | 选择理由 |
|------|----------|
| React Native + Expo | 跨平台原生移动端开发，一套代码同时运行 Android 和 iOS |
| React Navigation | Stack + BottomTab 混合导航 |
| react-native-webview + Leaflet.js | 地图展示（高德瓦片 + MarkerCluster） |
| expo-location | GPS 定位 |
| Axios | HTTP 请求 |

#### 移动端 H5（mobile-web）

| 技术 | 选择理由 |
|------|----------|
| React 18 + TypeScript | 组件化开发，类型安全 |
| Vite | 极速开发构建工具 |
| antd-mobile 5 | 移动端 H5 UI 组件库 |
| React Router 6 | 客户端路由管理 |
| Axios | HTTP 请求 |

---

## 项目结构

```
Ctrip---Fifth-FrontEnd-Bootcamp-main/
├── backend/                  # 后端项目
│   ├── prisma/               # Prisma 配置和数据模型
│   │   └── schema.prisma     # 数据库模型定义
│   ├── src/                  # 后端源码
│   │   ├── auth/             # 认证模块
│   │   │   ├── dto/          # 数据传输对象
│   │   │   ├── guards/       # 认证守卫
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   └── auth.service.ts
│   │   ├── hotels/           # 酒店管理模块
│   │   │   ├── dto/
│   │   │   ├── hotels.controller.ts
│   │   │   ├── hotels.module.ts
│   │   │   └── hotels.service.ts
│   │   ├── reservations/     # 预订模块
│   │   ├── guests/           # 入住人员模块
│   │   ├── tags/             # 酒店标签模块
│   │   └── app.module.ts     # 应用主模块
│   ├── uploads/              # 酒店图片存储目录
│   ├── package.json
│   └── tsconfig.json
├── yisu-hotel-pc/            # PC 管理端（Next.js 版）
│   ├── src/
│   │   ├── components/
│   │   │   ├── HotelDetailModal.tsx    # 酒店详情弹窗
│   │   │   ├── HotelForm.tsx           # 酒店表单
│   │   │   ├── Layout.tsx              # 主布局
│   │   │   └── RequireAuth.tsx         # 路由权限控制
│   │   ├── lib/
│   │   │   ├── api.ts                  # API 请求封装
│   │   │   └── auth.ts                 # 认证相关
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── audits/index.tsx    # 待审核酒店列表
│   │   │   │   └── hotels/index.tsx   # 所有酒店管理（上线/下线）
│   │   │   ├── merchant/
│   │   │   │   └── hotels/
│   │   │   │       ├── [id]/edit.tsx  # 编辑酒店
│   │   │   │       ├── index.tsx      # 我的酒店列表
│   │   │   │       └── new.tsx        # 新建酒店
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   ├── styles/
│   │   └── types/
│   └── package.json
├── admin-web/                # PC 管理端（React + Vite 版）
├── mobile-app/               # React Native + Expo 移动端 App
│   ├── src/
│   │   ├── screens/
│   │   │   ├── HomeScreen.tsx          # 首页（搜索 + 日历 + 推荐酒店轮播）
│   │   │   ├── MapScreen.tsx           # 地图找房（Leaflet + 高德 POI + 省市区选择）
│   │   │   ├── SearchScreen.tsx        # 搜索结果（关键词 + 星级筛选）
│   │   │   ├── HotelDetailScreen.tsx   # 酒店详情
│   │   │   ├── BookingScreen.tsx       # 预订填写
│   │   │   └── ConfirmScreen.tsx       # 预订确认
│   │   ├── api/
│   │   │   ├── http.ts                 # Axios 实例
│   │   │   └── hotels.ts              # 酒店接口
│   │   ├── types/index.ts
│   │   └── Navigation.tsx             # Stack + BottomTab 导航
│   └── app.json
├── mobile-web/               # 移动端 H5（React + Vite）
├── documents/                # 项目文档
│   ├── PRD.md
│   └── FRONTEND.md
└── README.md
```

---

## 后端架构设计

### 模块划分与职责

- **Auth 模块**：负责用户注册、登录和认证，包含 JWT 令牌生成和验证
- **Hotels 模块**：负责酒店信息管理、查询和审核，支持商户录入和管理员审核
- **Reservations 模块**：负责酒店预订管理，处理预订创建和状态更新
- **Guests 模块**：负责入住人员信息管理
- **Tags 模块**：负责酒店标签管理

### 数据模型

- `User`：用户表（商户和管理员）
- `Hotel`：酒店表
- `HotelRoom`：酒店房型表
- `HotelFacility`：酒店设施表
- `HotelImage`：酒店图片表
- `HotelPromotion`：酒店优惠表
- `HotelNearbyAttraction`：酒店附近景点表
- `HotelTag` / `HotelTagRelation`：标签及多对多关联
- `Reservation`：预订表
- `Guest` / `ReservationGuest`：入住人员及多对多关联

---

## API 接口设计

### 认证接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/auth/register | 用户注册（支持 merchant / admin 角色） | 否 |
| POST | /api/auth/login | 用户登录，返回 JWT | 否 |
| GET | /api/auth/profile | 获取当前用户信息 | 是 |

### 酒店接口（商户端）

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/hotels | 创建酒店 | 是 |
| GET | /api/hotels/merchant | 获取商户的酒店列表 | 是 |
| GET | /api/hotels/:id | 获取酒店详情 | 否 |
| PUT | /api/hotels/:id | 更新酒店信息（状态重置为 pending） | 是 |
| DELETE | /api/hotels/:id | 删除酒店 | 是 |
| POST | /api/hotels/:id/images | 上传酒店图片 | 是 |

### 酒店接口（公开查询）

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/hotels | 搜索酒店（分页、关键词、星级、价格筛选） | 否 |

### 酒店接口（管理员端）

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/admin/hotels/pending | 获取待审核酒店列表 | 是 |
| POST | /api/admin/hotels/:id/approve | 审核通过 | 是 |
| POST | /api/admin/hotels/:id/reject | 拒绝（填写原因） | 是 |
| POST | /api/admin/hotels/:id/offline | 下线酒店 | 是 |
| POST | /api/admin/hotels/:id/online | 上线酒店 | 是 |
| GET | /api/admin/hotels | 获取所有酒店列表 | 是 |

### 预订接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/reservations | 创建预订 | 否 |
| GET | /api/reservations/:id | 预订详情 | 否 |
| GET | /api/reservations/hotel/:hotelId | 酒店预订列表 | 是 |
| PUT | /api/reservations/:id/check-in | 办理入住 | 是 |
| PUT | /api/reservations/:id/check-out | 办理退房 | 是 |

### 其他接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/tags | 标签列表 | 否 |
| POST | /api/tags | 创建标签 | 是 |
| POST | /upload | 上传图片，返回 `{ url: "/uploads/xxx.jpg" }` | 否 |

> Swagger 文档：启动后端后访问 `http://localhost:3000/api`

---

## 前端框架设计

### PC 管理端页面结构

面向商户和管理员两类用户，通过路由权限控制区分访问权限。

**商户端**
- `/merchant/hotels`：我的酒店列表，支持查看、编辑、删除
- `/merchant/hotels/new`：新增酒店（基本信息、房型、促销、设施、景点、标签、图片）
- `/merchant/hotels/[id]/edit`：编辑酒店信息

**管理员端**
- `/admin/audits`：待审核酒店列表，可通过或拒绝（需填写原因）
- `/admin/hotels`：所有酒店管理，支持上线/下线操作

**公共页面**
- `/login`：用户登录页
- `/register`：注册页（可选择商户或管理员角色）

### 移动端 App 页面结构

| 页面 | 功能 |
|------|------|
| HomeScreen | 首页：搜索栏 + 日历选房 + 推荐酒店轮播 |
| MapScreen | 地图找房：省→市→区三级选择 + Leaflet 地图 + 高德 POI 价格标注 + GPS/IP 定位 |
| SearchScreen | 搜索结果：关键词 + 星级筛选 + 排序 |
| HotelDetailScreen | 酒店详情：图片/设施/景点/优惠/房型选择 |
| BookingScreen | 预订填写：入住日期 + 联系人信息 |
| ConfirmScreen | 预订确认 |

### 组件设计（PC 端）

- **Layout**：主布局，含侧边栏菜单（根据角色动态生成）和用户头像下拉菜单
- **RequireAuth**：路由守卫，检查登录状态及角色权限
- **HotelForm**：酒店表单，复用新建和编辑场景，支持嵌套表单和图片上传
- **HotelDetailModal**：酒店详情弹窗

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

### 3. 启动 PC 管理端（Next.js 版）

```bash
cd yisu-hotel-pc
npm install
npm run dev -- -p 3001   # http://localhost:3001
```

> 需先在 `yisu-hotel-pc/.env.local` 设置：
> ```
> NEXT_PUBLIC_API_URL=http://<本机IP>:3000
> ```

### 4. 启动 PC 管理端（React + Vite 版）

```bash
cd admin-web
npm install
npm run dev   # http://localhost:5173
```

### 5. 启动移动端 H5

```bash
cd mobile-web
npm install
npm run dev   # http://localhost:5174
```

### 6. 启动移动端 App（React Native）

```bash
cd mobile-app
npm install
npx expo start --clear
```

用 Expo Go 扫码，或连接 Android 模拟器按 `a`。

> 真机调试需将 `mobile-app/src/api/http.ts` 中的 `192.168.1.28` 改为你电脑的局域网 IP（手机和电脑需在同一 WiFi）。

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

## 数据库设计

### 核心数据模型

**User（用户表）**

| 字段 | 类型 | 约束 | 描述 |
|------|------|------|------|
| id | String | @id | 用户 ID |
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

### 酒店上线流程

```
商户创建酒店（status: pending）
→ 管理员在待审核列表查看
→ 审核通过（status: approved）或拒绝（status: rejected，填写原因）
→ 通过后酒店在移动端可见
→ 管理员可随时下线（status: offline）/ 重新上线
```

### 预订流程

```
移动端用户浏览酒店详情
→ 选择房型 → 跳转预订填写页
→ 填写入住/离店日期、联系人信息
→ 提交 POST /api/reservations
→ 跳转预订确认页
→ 商户在管理端办理入住（check_in）/ 退房（check_out）
```

### 图片上传流程

```
商户拖拽图片到表单
→ 发送 POST /upload（multipart/form-data）
→ 后端 multer 保存到 backend/uploads/ 目录
→ 返回 { url: "/uploads/xxx.jpg" }
→ 提交表单时将 url 数组随酒店数据一起保存到数据库
```

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
- 对用户输入的 HTML 内容进行转义，防止 XSS 攻击

---

## 部署指南

### 后端部署

```bash
cd Ctrip---Fifth-FrontEnd-Bootcamp-main/backend
npm run build
npm run start:prod
```

### 前端部署

```bash
# PC 管理端（Vite）
cd admin-web && npm run build   # 产物在 dist/

# 移动端 H5
cd mobile-web && npm run build  # 产物在 dist/

# PC 管理端（Next.js）
cd yisu-hotel-pc && npm run build && npm start
```

---

## 已知问题与修复记录

| 问题 | 根因 | 修复 |
|------|------|------|
| 移动端搜索无结果 | ValidationPipe 缺少 `transform: true` | main.ts 加 `transform: true, enableImplicitConversion: true` |
| 管理员看不到待审核酒店 | controller 缺少路由，且路由顺序错误 | 添加路由并调整顺序 |
| 移动端酒店详情报错 | `GET /api/hotels/:id` 有 `@UseGuards(AuthGuard)` | 移除该路由的认证守卫 |
| 创建预订 400 报错 | DTO 缺少 `@Type(() => Date)` | 加 `@Type(() => Date)`，改为 `@IsNumber()` |
| 图片上传 404 | `POST /api/upload` 被 Swagger 的 `/api` 路径拦截 | 改为 `POST /upload` |
| App 首页推荐空白 | 酒店 status 为 pending，后端只返回 approved | 批量更新所有酒店 status 为 approved |
| App 图片不显示 | 高德 POI 图片为外链 URL，被拼上本地服务器前缀 | `imgUrl()` 函数判断是否以 http 开头 |
| App 地图空白闪屏 | `key={html}` 导致每次更新 POI 都重新挂载 WebView | 改用 `useRef` + `injectJavaScript` 更新标记 |
| App 地图打不开 | WebView 加载 data URL 时阻止外部 CDN 资源 | 加 `baseUrl` + `mixedContentMode="always"` + `onLoad` |

---

## 项目创新性

- **完整的审核流程**：商户上传酒店信息后，管理员审核通过才能上线，确保信息质量
- **地图找房**：WebView 内嵌 Leaflet.js + 高德瓦片，调用高德 POI API 展示附近酒店价格气泡
- **跨端移动开发**：React Native + Expo，一套代码同时运行 Android 和 iOS
- **多维度筛选**：支持按星级、价格、设施、标签等多维度筛选酒店
- **灵活的优惠系统**：支持折扣、固定金额、套餐等多种优惠类型
- **双重定位策略**：IP 定位（3s）→ GPS 兜底（5s），模拟器和真机均可用

---

## 待优化方向

| 优先级 | 功能 |
|--------|------|
| P1 | 移动端用户登录，支持查看历史预订 |
| P1 | 商户端预订管理按酒店筛选 |
| P2 | 首页骨架屏 loading 效果 |
| P2 | 搜索页价格区间筛选 |
| P2 | 管理员端数据统计 Dashboard |
| P3 | Redis 缓存热点酒店数据 |
| P3 | 移动端 PWA 支持 |

---

## 项目亮点与技术思考

### 1. 一套后端，四端复用

本项目最核心的架构决策是**前后端完全分离**，后端一套 RESTful API 同时服务四个客户端（PC 管理端 ×2、移动端 H5、React Native App）。这要求我们在设计接口时充分考虑通用性，避免为某一端定制逻辑。

实践中遇到的挑战：不同端对同一接口的数据需求不同（例如移动端只需要酒店基本信息，PC 端需要完整关联数据）。我们通过 Prisma 的 `include` 参数按需加载关联数据，而不是每次都返回全量字段，在性能和灵活性之间取得平衡。

### 2. 地图方案的技术选型思考

移动端地图是本项目最大的技术难点。我们调研了三种方案：

| 方案 | 优点 | 缺点 | 结论 |
|------|------|------|------|
| 高德 React Native SDK | 原生性能好 | 需要 `expo eject`，破坏 Expo 托管模式 | 放弃 |
| react-native-maps | 社区成熟 | 国内地图瓦片需额外配置，模拟器问题多 | 放弃 |
| WebView + Leaflet.js | 灵活，国内 CDN 稳定 | JS Bridge 通信有延迟 | **采用** |

最终选择 **WebView 内嵌 Leaflet.js + 高德瓦片**，通过 `injectJavaScript` 实现 React Native 与地图的双向通信。这个方案的关键优化点：

- 用 `useRef + injectJavaScript` 更新 POI 标记，避免 WebView 重新挂载导致的闪屏
- `baseUrl + mixedContentMode="always"` 解决 WebView 加载 data URL 时阻止外部 CDN 资源的问题
- 高德 POI API 返回的价格气泡直接渲染在地图上，无需额外接口

### 3. 定位策略的降级设计

GPS 定位在模拟器和部分 Android 设备上不可靠，我们设计了三级降级策略：

```
IP 定位（3s 超时）→ GPS 定位（5s 超时）→ fallback 到当前选中区域
```

IP 定位优先是因为它在模拟器上更稳定，GPS 作为精度更高的兜底方案。这种 **Promise.race + 超时竞速** 的模式保证了用户体验不会因为定位失败而卡住。

### 4. 审核流程的主动设计

PRD 中没有强制要求审核流程，但我们主动设计了 `pending → approved/rejected → offline/online` 的酒店状态机。

这个决策来自对真实业务场景的思考：如果没有审核机制，任何人都可以上传虚假酒店信息，平台的信息质量无法保证。状态机的设计也让后续扩展（如自动审核、批量操作）更容易实现。

### 5. 图片数据的工程化补充

项目初期 75 家酒店均无图片，影响演示效果。我们编写了三个脚本批量补充：

1. `add-photos.js`：通过高德 POI API 按酒店名称搜索，获取真实图片（补充 59 家）
2. `fix-photos.js`：对搜索失败的酒店用名称+地址二次搜索（再补充 6 家）
3. `fix-photos-fallback.js`：剩余 10 家用备用占位图补全

这种**分层补充策略**体现了工程化思维：优先用真实数据，降级用合理的占位数据，而不是直接跳过。

### 6. 跨端框架的实践对比

本项目同时实现了移动端 H5（React + Vite）和原生 App（React Native + Expo），形成了直接对比：

| 维度 | 移动端 H5 | React Native App |
|------|-----------|-----------------|
| 开发效率 | 高（复用 Web 生态） | 中（需要适配原生组件） |
| 性能 | 受限于 WebView | 接近原生 |
| 地图能力 | 直接用高德 JS SDK | 需要 WebView 桥接 |
| 发布方式 | 直接部署 | 需要打包/Expo Go |
| 定位能力 | 受浏览器限制 | expo-location 原生 API |

实践结论：对于酒店预订这类以信息展示为主的场景，H5 已经足够；但地图找房、GPS 定位等功能在原生 App 上体验明显更好。

同样，PC 端我们也有两套实现（admin-web 用 React + Vite，yisu-hotel-pc 用 Next.js），形成了 **CSR vs SSR** 的直接对比：

| 维度 | admin-web（Vite + CSR） | yisu-hotel-pc（Next.js + SSR） |
|------|------------------------|-------------------------------|
| 首屏速度 | 较慢（JS 全量加载后渲染） | 更快（服务端直出 HTML） |
| SEO | 弱（内容在 JS 里） | 好（HTML 直接可被爬取） |
| 开发体验 | 简单直接，热更新快 | 文件路由约定，上手有一定成本 |
| 部署复杂度 | 静态文件，任意 CDN | 需要 Node.js 服务器 |
| 适合场景 | 管理后台（不需要 SEO） | 面向用户的内容页（需要 SEO） |

**深层思考**：对于管理后台这类场景，CSR 其实是更合适的选择——用户已登录，不需要 SEO，Vite 的开发体验也更轻快。Next.js 的 SSR 优势在面向 C 端用户的页面才能真正发挥。这次同时实现两套让我们对"什么场景用什么框架"有了更具体的判断，而不只是停留在理论层面。



**Bug 1：WebView 地图每次更新 POI 都闪屏**

- 表象：切换城市后地图白屏一下再显示
- 根因：`source={{ html: htmlString }}` 中 `htmlString` 变化时，React 会销毁并重建 WebView 组件
- 修复：将 HTML 用 `useMemo` 固定，通过 `injectJavaScript` 动态注入 POI 数据，WebView 不再重建

**Bug 2：移动端首页推荐酒店空白**

- 表象：首页"为你推荐"区域无内容
- 根因：数据库中所有酒店 status 为 `pending`，后端 `GET /api/hotels` 只返回 `approved` 状态的酒店
- 修复：批量执行 `UPDATE hotels SET status = 'approved'`，同时理解了审核流程的必要性

**Bug 3：App 图片全部显示为本地服务器地址**

- 表象：高德 POI 图片不显示
- 根因：`imgUrl()` 函数无条件拼接本地服务器前缀，导致外链 URL 变成 `http://192.168.1.28:3000/https://...`
- 修复：判断 URL 是否以 `http` 开头，外链直接使用，本地路径才拼接前缀

---

> 携程 - 第五期前端训练营大作业
