# 易宿酒店预订平台

## 项目概述

易宿酒店预订平台是一个面向现代旅游出行场景的综合服务体系，旨在为酒店商家与终端消费者之间搭建高效、便捷的信息交互桥梁。本项目分为两个核心模块：

- **管理酒店信息系统** (PC站点)：供酒店商家录入管理酒店信息，管理员审核发布酒店信息
- **酒店预订流程** (移动端)：供用户查询、浏览和预订酒店

## 技术栈选择

### 后端技术栈

- **Node.js** + **NestJS**：选择理由 - 模块化架构、TypeScript支持、依赖注入系统，适合构建可维护的企业级应用
- **PostgreSQL**：选择理由 - 强大的关系型数据库，支持复杂查询和事务，适合存储酒店预订等结构化数据
- **Prisma**：选择理由 - TypeScript ORM，提供类型安全的数据库操作，简化数据库交互
- **JWT**：选择理由 - 无状态认证，便于水平扩展，适合前后端分离架构
- **bcrypt**：选择理由 - 安全的密码哈希算法，保护用户密码安全
- **Multer**：用于处理酒店图片上传

### 前端技术栈

#### PC管理端

- **Next.js (React框架)**：选择理由 - 服务端渲染、文件路由、API路由，提升开发效率和SEO
- **TypeScript**：选择理由 - 静态类型检查，提高代码质量和可维护性
- **Ant Design**：选择理由 - 企业级UI组件库，提供丰富的高质量组件，快速搭建后台系统
- **Axios**：选择理由 - 基于Promise的HTTP客户端，支持拦截器，简化API调用
- **Day.js**：选择理由 - 轻量级日期处理库，用于日期格式化与转换
- **@ant-design/nextjs-registry**：用于Ant Design与Next.js的集成

## 项目结构

```
├── backend/                  # 后端项目
│   ├── prisma/               # Prisma配置和数据模型
│   │   └── schema.prisma     # 数据库模型定义
│   ├── src/                  # 后端源码
│   │   ├── auth/             # 认证模块
│   │   │   ├── dto/          # 数据传输对象
│   │   │   ├── guards/       # 认证守卫
│   │   │   ├── auth.controller.ts    # 认证控制器
│   │   │   ├── auth.module.ts        # 认证模块
│   │   │   └── auth.service.ts       # 认证服务
│   │   ├── hotels/           # 酒店管理模块
│   │   │   ├── dto/          # 数据传输对象
│   │   │   ├── hotels.controller.ts    # 酒店控制器
│   │   │   ├── hotels.module.ts        # 酒店模块
│   │   │   └── hotels.service.ts       # 酒店服务
│   │   ├── reservations/     # 预订模块
│   │   ├── guests/           # 入住人员模块
│   │   ├── tags/             # 酒店标签模块
│   │   └── app.module.ts     # 应用主模块
│   ├── uploads/              # 酒店图片存储目录
│   ├── package.json          # 后端依赖
│   └── tsconfig.json         # TypeScript配置
├── yisu-hotel-pc/            # PC端
│   ├── public/               # 静态资源
│   ├── src/
│   │   ├──components/        # 公共组件
│   │   │   ├──HotelDetailModal.tsx    # 酒店详情弹窗
│   │   │   ├──HotelForm.tsx           # 酒店表单
│   │   │   ├──Layout.tsx              # 主布局
│   │   │   ├──RequireAuth.tsx         # 路由权限控制
│   │   ├──lib/               # 工具函数和API封装
│   │   │   ├──api.ts                  # API请求封装
│   │   │   ├──auto.ts                 # 认证相关
│   │   ├──pages/             # 页面文件
│   │   │   ├──admin/                  # 管理员端页面
│   │   │   │   ├── audits/            # 待审核酒店列表
│   │   │   │   │   └── index.tsx
│   │   │   │   └── hotels/            # 所有酒店管理（上线/下线）
│   │   │   │       └── index.tsx
│   │   │   ├──merchant/               # 商户端页面
│   │   │   │   └── hotels/                  # 酒店管理
│   │   │   │       ├── [id]/                # 动态路由
│   │   │   │       │   └── edit.tsx            # 编辑酒店
│   │   │   │       ├── index.tsx            # 我的酒店列表
│   │   │   │       └── new.tsx              # 新建酒店
│   │   │   ├── _app.tsx               # 全局配置
│   │   │   ├── _document.tsx          # 自定义文档
│   │   │   ├── index.tsx              # 根页面（重定向到登录或对应首页）
│   │   │   ├──login.tsx               # 登录页
│   │   │   ├──register.tsx            # 注册页
│   │   ├──styles/            # 全局样式
│   │   ├──types/             # TypeScript类型定义
│   ├── package-lock.json
│   ├── package.json
├── documents/                # 项目文档
└── README.md                 # 项目说明
```

## 后端架构设计

### 模块划分与职责

1. **Auth模块**：负责用户注册、登录和认证，包含JWT令牌生成和验证
2. **Hotels模块**：负责酒店信息管理、查询和审核，支持商户录入和管理员审核
3. **Reservations模块**：负责酒店预订管理，处理预订创建和状态更新
4. **Guests模块**：负责入住人员信息管理，支持添加和查询入住人员
5. **Tags模块**：负责酒店标签管理，支持创建和查询酒店标签

### 数据模型设计

- **User**：用户表（商户和管理员）
- **Hotel**：酒店表
- **HotelRoom**：酒店房型表
- **HotelFacility**：酒店设施表
- **HotelImage**：酒店图片表
- **HotelPromotion**：酒店优惠表
- **HotelNearbyAttraction**：酒店附近景点表
- **HotelTag**：酒店标签表
- **Reservation**：预订表
- **Guest**：入住人员表

### API接口设计

#### 认证接口

- `POST /api/auth/register`：用户注册 - 支持商户和管理员角色注册
- `POST /api/auth/login`：用户登录 - 返回JWT令牌
- `GET /api/auth/profile`：获取用户信息 - 需要认证

#### 酒店接口（商户端）

- `POST /api/hotels`：创建酒店（商户） - 需要认证
- `GET /api/hotels/merchant`：获取商户的酒店列表 - 需要认证
- `GET /api/hotels/:id`：获取酒店详情 - 需要认证
- `PUT /api/hotels/:id`：更新酒店信息 - 需要认证，更新后状态重置为pending
- `DELETE /api/hotels/:id`：删除酒店 - 需要认证
- `POST /api/hotels/:id/images`：上传酒店图片 - 需要认证
- `PUT /api/hotels/:hotelId/images/:imageId`：更新图片信息 - 需要认证
- `DELETE /api/hotels/:hotelId/images/:imageId`：删除图片 - 需要认证

#### 酒店接口（公开查询）

- `GET /api/hotels`：查询酒店列表（支持筛选） - 公开接口

#### 酒店接口（管理员端）

- `GET /api/admin/hotels/pending`：获取待审核酒店列表 - 需要认证
- `POST /api/admin/hotels/:id/approve`：审核通过酒店 - 需要认证
- `POST /api/admin/hotels/:id/reject`：拒绝酒店 - 需要认证
- `POST /api/admin/hotels/:id/offline`：下线酒店 - 需要认证
- `POST /api/admin/hotels/:id/online`：上线酒店 - 需要认证
- `GET /api/admin/hotels/`：获取所有酒店列表 - 需要认证

#### 预订接口

- `POST /api/reservations`：创建预订 - 公开接口
- `GET /api/reservations`：获取预订列表 - 需要认证

#### 入住人员接口

- `POST /api/guests`：创建入住人员信息 - 公开接口
- `GET /api/guests`：获取入住人员列表 - 需要认证

#### 标签接口

- `POST /api/tags`：创建酒店标签 - 需要认证
- `GET /api/tags`：获取酒店标签列表 - 公开接口

## 前端框架设计

### 页面结构设计

#### 用户端（移动端）

#### 管理端（PC端）

##### 页面结构设计

PC管理端面向两类用户：商户和管理员，通过路由权限控制区分访问权限。

###### 商户端

- `/merchant/hotels`：我的酒店列表，展示当前商户的所有酒店，支持查看、编辑、删除操作
- `/merchant/hotels/new`：新增酒店表单，包含酒店基本信息、房型、促销、设施、附近景点、标签和图片上传
- `/merchant/hotels/[id]/edit`：编辑酒店信息，支持更新已有数据和图片管理

###### 管理员端

- `/admin/audits`：待审核酒店列表，展示所有状态为pending的酒店，可查看详情、通过或拒绝（需填写原因）
- `/admin/hotels`：所有酒店管理列表，展示所有酒店，支持查看详情、上线/下线操作

###### 公共页面

- `/login`：用户登录页
- `/register`：用户注册页，可选择商户或管理员角色

### 组件设计

- **Layout**：主布局组件，包含侧边栏菜单（根据角色动态生成）和用户头像下拉菜单（退出登录）
- **RequireAuth**：高阶组件/路由守卫，检查用户是否登录及角色权限，未授权则跳转
- **HotelForm**：酒店表单组件，复用新建和编辑场景，支持嵌套表单（房型、促销等列表）、图片预览与上传
- **HotelDetailModal**：酒店详情弹窗，用于查看完整酒店信息（包括关联数据）

### 状态管理与数据流

- 使用React Hooks管理组件本地状态
- 通过lib/api.ts封装Axios请求，统一添加认证Token，并提供类型化的API方法
- 用户认证信息存储在localStorage中，通过lib/auth.ts提供读写和注销方法

## 开发指南

### 后端开发

1. **环境准备**
   - Node.js 16+
   - PostgreSQL 12+

2. **安装依赖**

   ```bash
   cd backend
   npm install
   ```

3. **配置环境变量**
   创建 `.env` 文件：

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/hotel_booking"
   JWT_SECRET="your-secret-key"
   JWT_EXPIRES_IN="7d"
   ```

4. **数据库迁移**

   ```bash
   npx prisma migrate dev --name init
   ```

5. **启动开发服务器**

   ```bash
   npm run start:dev
   ```

6. **运行测试**
   ```bash
   npm run test
   ```

### 前端开发

#### PC管理端

1. **环境准备**
   - Node.js 16+

2. **安装依赖**

   ```bash
   cd yisu-hotel-pc
   npm install
   ```

3. **配置环境变量**
   创建 `.env` 文件：

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **启动开发服务器**

   ```bash
   npm run dev
   ```

5. **构建生产版本**

   ```bash
   npm run build
   npm start
   ```

## API文档

本项目使用Nest.js官方的Swagger UI生成API文档，提供交互式的API接口浏览和测试功能。

### 访问API文档

1. 确保后端服务已启动（运行 `npm run start`）
2. 在浏览器中访问：http://localhost:<后端port>/api
3. 即可查看完整的API文档，包括所有接口的详细说明、请求参数和响应格式

### 注意事项

- 对于需要认证的接口，需要先登录获取JWT令牌
- 在测试需要认证的接口时，需要在Authorization头中填写获取到的令牌
- 令牌格式为：`Bearer <token>`

## 数据库设计

### 核心数据模型

#### User（用户表）

| 字段名    | 数据类型 | 约束            | 描述                   |
| --------- | -------- | --------------- | ---------------------- |
| id        | String   | @id             | 用户ID                 |
| email     | String   | @unique         | 邮箱                   |
| password  | String   | -               | 密码（加密）           |
| name      | String   | -               | 用户名                 |
| role      | UserRole | -               | 角色（merchant/admin） |
| createdAt | DateTime | @default(now()) | 创建时间               |
| updatedAt | DateTime | @updatedAt      | 更新时间               |

#### Hotel（酒店表）

| 字段名          | 数据类型              | 约束            | 描述                                      |
| --------------- | --------------------- | --------------- | ----------------------------------------- |
| id              | String                | @id             | 酒店ID                                    |
| nameZh          | String                | -               | 酒店中文名                                |
| nameEn          | String                | -               | 酒店英文名                                |
| address         | String                | -               | 酒店地址                                  |
| starRating      | Int                   | -               | 酒店星级                                  |
| openingDate     | DateTime              | -               | 开业时间                                  |
| description     | String                | ?               | 酒店描述                                  |
| status          | HotelStatus           | -               | 状态（pending/approved/rejected/offline） |
| rejectionReason | String                | ?               | 拒绝原因                                  |
| merchantId      | String                | -               | 商户ID                                    |
| location        | GEOMETRY(Point, 4326) | -               | 酒店地理位置（经纬度）                    |
| createdAt       | DateTime              | @default(now()) | 创建时间                                  |
| updatedAt       | DateTime              | @updatedAt      | 更新时间                                  |

#### HotelRoom（酒店房型表）

| 字段名      | 数据类型 | 约束            | 描述     |
| ----------- | -------- | --------------- | -------- |
| id          | String   | @id             | 房型ID   |
| hotelId     | String   | -               | 酒店ID   |
| name        | String   | -               | 房型名称 |
| description | String   | ?               | 房型描述 |
| price       | Decimal  | -               | 价格     |
| capacity    | Int      | -               | 容纳人数 |
| quantity    | Int      | -               | 房间数量 |
| createdAt   | DateTime | @default(now()) | 创建时间 |
| updatedAt   | DateTime | @updatedAt      | 更新时间 |

#### Reservation（预订表）

| 字段名       | 数据类型          | 约束            | 描述     |
| ------------ | ----------------- | --------------- | -------- |
| id           | String            | @id             | 预订ID   |
| hotelId      | String            | -               | 酒店ID   |
| roomId       | String            | -               | 房型ID   |
| checkInDate  | DateTime          | -               | 入住日期 |
| checkOutDate | DateTime          | -               | 离店日期 |
| guestName    | String            | -               | 客人姓名 |
| guestPhone   | String            | -               | 客人电话 |
| guestEmail   | String            | -               | 客人邮箱 |
| status       | ReservationStatus | -               | 状态     |
| totalPrice   | Decimal           | -               | 总价格   |
| createdAt    | DateTime          | @default(now()) | 创建时间 |
| updatedAt    | DateTime          | @updatedAt      | 更新时间 |

## 开发规范

### 代码规范

1. **TypeScript**：使用TypeScript编写所有代码，确保类型安全
2. **ESLint**：遵循项目的ESLint规则，保持代码风格一致
3. **Prettier**：使用Prettier格式化代码，确保代码格式统一
4. **Git提交**：使用语义化的Git提交信息，格式为 `type(scope): description`

### API规范

1. **RESTful设计**：遵循RESTful API设计原则，使用合适的HTTP方法
2. **状态码**：使用标准HTTP状态码，正确表示请求结果
3. **错误处理**：统一的错误响应格式，包含错误码和错误信息
4. **认证**：使用JWT进行身份认证，设置合理的过期时间

### 安全规范

1. **密码加密**：使用bcrypt加密存储密码，设置合适的哈希强度
2. **输入验证**：对所有用户输入进行验证，防止恶意输入
3. **SQL注入防护**：使用Prisma的参数化查询，避免SQL注入攻击
4. **CORS**：合理配置CORS策略，限制跨域请求
5. **XSS防护**：对用户输入的HTML内容进行转义，防止XSS攻击

## 部署指南

### 后端部署

1. **构建项目**

   ```bash
   cd backend
   pnpm build
   ```

2. **启动生产服务器**
   ```bash
   pnpm start:prod
   ```

### 前端部署

## 项目创新性

1. **实时价格计算**：根据入住日期、房型和优惠活动实时计算价格，支持动态定价策略
2. **智能推荐系统**：基于用户搜索历史和偏好推荐酒店，提升用户体验
3. **多维度筛选**：支持按星级、价格、设施、标签等多维度筛选酒店，快速找到符合需求的酒店
4. **响应式设计**：适配PC端和移动端不同屏幕尺寸，提供一致的用户体验
5. **模块化架构**：前后端分离，模块化设计，便于维护和扩展
6. **完整的审核流程**：商户上传酒店信息后，管理员审核通过才能上线，确保酒店信息质量
7. **灵活的优惠系统**：支持多种优惠类型（折扣、固定金额、套餐），满足不同促销需求
8. **酒店图片管理**： 支持多图上传、主图设置、图片描述，丰富酒店展示

## 性能优化策略

### 后端性能优化

1. **数据库索引**：为常用查询字段创建索引，提升查询性能
2. **缓存策略**：使用Redis缓存热点数据，如热门酒店列表
3. **批量操作**：对批量数据操作使用事务，减少数据库连接次数
4. **分页查询**：对列表接口使用分页，避免一次性返回大量数据

### 前端性能优化

## 开发计划

### 第一阶段：后端开发

1. 完成数据库模型设计
2. 实现认证模块
3. 实现酒店管理模块
4. 实现预订模块
5. 实现入住人员和标签模块
6. 编写API文档

### 第二阶段：前端开发

#### PC端

1. 搭建Next.js项目，集成Ant Design
2. 实现登录/注册页面及认证逻辑
3. 实现商户端：我的酒店列表、新增酒店、编辑酒店
4. 实现管理员端：待审核列表、所有酒店管理
5. 实现酒店详情弹窗组件
6. 对接后端API，联调测试

### 第三阶段：测试和部署

---
