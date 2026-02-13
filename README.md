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

### 前端技术栈（待初始化）

- **React**：选择理由 - 组件化开发，虚拟DOM，高效渲染
- **TypeScript**：选择理由 - 类型安全，提升代码质量和可维护性
- **Tailwind CSS**：选择理由 - 实用优先的CSS框架，快速构建响应式界面
- **React Query**：选择理由 - 强大的数据获取和缓存库，简化API调用
- **React Router**：选择理由 - 声明式路由，支持嵌套路由和路由守卫

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
│   ├── package.json          # 后端依赖
│   └── tsconfig.json         # TypeScript配置
├── frontend/                 # 前端项目（待初始化）
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

#### 酒店接口

- `POST /api/hotels`：创建酒店（商户） - 需要认证
- `GET /api/hotels/merchant`：获取商户的酒店列表 - 需要认证
- `GET /api/hotels/:id`：获取酒店详情 - 需要认证
- `PUT /api/hotels/:id`：更新酒店信息 - 需要认证
- `DELETE /api/hotels/:id`：删除酒店 - 需要认证
- `GET /api/hotels`：查询酒店列表（支持筛选） - 公开接口

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

1. **酒店查询页（首页）**
   - 顶部Banner：酒店广告，点击跳转详情页
   - 核心查询区域：地点选择（支持定位）、关键字搜索、日期选择、筛选条件、快捷标签
   - 查询按钮：点击跳转到列表页

2. **酒店列表页**
   - 顶部核心条件筛选头：城市、入住/离店日期、入住间夜
   - 详细筛选区域：按星级、价格、设施等筛选
   - 酒店列表：支持上滑加载，显示酒店基本信息和价格

3. **酒店详情页**
   - 顶部导航头：酒店名称、返回按钮
   - 大图Banner：支持左右滚动查看酒店图片
   - 酒店基础信息：酒店名、星级、设施、地址
   - 日历+人间夜Banner：选择入住日期和人数
   - 酒店房型价格列表：按价格从低到高排序

#### 管理端（PC端）

1. **登录/注册页**
   - 账户注册：选择角色（商户/管理员）
   - 账户登录：自动判断角色

2. **酒店信息录入/编辑页**
   - 酒店基本信息表单：名称、地址、星级、开业时间等
   - 房型信息管理：添加、编辑、删除房型
   - 设施信息管理：选择或添加酒店设施
   - 图片上传：上传酒店图片

3. **酒店信息审核/发布/下线页**
   - 酒店列表：按状态筛选（待审核/已通过/已拒绝/已下线）
   - 审核操作：通过/拒绝，拒绝需填写原因
   - 发布/下线操作：管理酒店上线状态

### 组件设计

- **UI组件**：按钮、输入框、下拉菜单、日期选择器、对话框等
- **功能组件**：酒店卡片、筛选器、图片轮播、价格计算器、日历选择器等
- **布局组件**：顶部导航、底部导航、页面容器、侧边栏等

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

### 前端开发（待初始化）

1. **初始化项目**

   ```bash
   npx create-vite@latest frontend --template react-ts
   ```

2. **安装核心依赖**

   ```bash
   cd frontend
   npm install react-router-dom @tanstack/react-query tailwindcss postcss autoprefixer
   ```

3. **配置Tailwind CSS**

   ```bash
   npx tailwindcss init -p
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

## API文档

本项目使用Nest.js官方的Swagger UI生成API文档，提供交互式的API接口浏览和测试功能。

### 访问API文档

1. 确保后端服务已启动（运行 `npm run start:dev`）
2. 在浏览器中访问：http://localhost:3000/api
3. 即可查看完整的API文档，包括所有接口的详细说明、请求参数和响应格式

### API文档内容

Swagger UI文档包含以下模块的API接口：

- **认证接口**：用户注册、登录和获取个人信息
- **酒店接口**：酒店创建、查询、更新和删除
- **预订接口**：预订创建和管理
- **入住人员接口**：入住人员信息管理
- **标签接口**：酒店标签管理

### 使用说明

- 在Swagger UI中，点击接口名称可以展开查看详细信息
- 点击"Try it out"按钮可以测试接口
- 填写必要的参数后，点击"Execute"按钮发送请求
- 可以查看响应结果和状态码

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

| 字段名          | 数据类型    | 约束            | 描述                                      |
| --------------- | ----------- | --------------- | ----------------------------------------- |
| id              | String      | @id             | 酒店ID                                    |
| nameZh          | String      | -               | 酒店中文名                                |
| nameEn          | String      | -               | 酒店英文名                                |
| address         | String      | -               | 酒店地址                                  |
| starRating      | Int         | -               | 酒店星级                                  |
| openingDate     | DateTime    | -               | 开业时间                                  |
| description     | String      | ?               | 酒店描述                                  |
| status          | HotelStatus | -               | 状态（pending/approved/rejected/offline） |
| rejectionReason | String      | ?               | 拒绝原因                                  |
| merchantId      | String      | -               | 商户ID                                    |
| createdAt       | DateTime    | @default(now()) | 创建时间                                  |
| updatedAt       | DateTime    | @updatedAt      | 更新时间                                  |

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
   npm run build
   ```

2. **启动生产服务器**
   ```bash
   npm run start:prod
   ```

### 前端部署

1. **构建项目**

   ```bash
   cd frontend
   npm run build
   ```

2. **部署静态资源**
   将 `dist` 目录部署到静态文件服务器（如Nginx、Vercel等）

3. **配置Nginx（可选）**
   ```nginx
   server {
     listen 80;
     server_name example.com;

     location / {
       root /path/to/frontend/dist;
       index index.html;
       try_files $uri $uri/ /index.html;
     }

     location /api {
       proxy_pass http://localhost:3000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     }
   }
   ```

## 项目创新性

1. **实时价格计算**：根据入住日期、房型和优惠活动实时计算价格，支持动态定价策略
2. **智能推荐系统**：基于用户搜索历史和偏好推荐酒店，提升用户体验
3. **多维度筛选**：支持按星级、价格、设施、标签等多维度筛选酒店，快速找到符合需求的酒店
4. **响应式设计**：适配PC端和移动端不同屏幕尺寸，提供一致的用户体验
5. **模块化架构**：前后端分离，模块化设计，便于维护和扩展
6. **完整的审核流程**：商户上传酒店信息后，管理员审核通过才能上线，确保酒店信息质量
7. **灵活的优惠系统**：支持多种优惠类型（折扣、固定金额、套餐），满足不同促销需求

## 性能优化策略

### 后端性能优化

1. **数据库索引**：为常用查询字段创建索引，提升查询性能
2. **缓存策略**：使用Redis缓存热点数据，如热门酒店列表
3. **批量操作**：对批量数据操作使用事务，减少数据库连接次数
4. **分页查询**：对列表接口使用分页，避免一次性返回大量数据

### 前端性能优化

1. **代码分割**：使用React.lazy和Suspense进行代码分割，减少初始加载时间
2. **图片优化**：使用适当的图片格式和大小，实现图片懒加载
3. **状态管理**：合理使用React Query缓存，减少重复API调用
4. **渲染优化**：使用React.memo、useMemo和useCallback优化组件渲染

## 开发计划

### 第一阶段：后端开发

1. 完成数据库模型设计
2. 实现认证模块
3. 实现酒店管理模块
4. 实现预订模块
5. 实现入住人员和标签模块
6. 编写API文档

### 第二阶段：前端开发

1. 初始化前端项目
2. 实现管理端页面
3. 实现用户端移动端页面
4. 集成API接口
5. 测试和优化

### 第三阶段：测试和部署

1. 功能测试
2. 性能测试
3. 安全测试
4. 部署到生产环境

## 联系信息

如有问题或建议，请联系项目维护者。

---

_本项目基于大作业要求开发，旨在提供一个完整的酒店预订平台解决方案。_

_团队内开发文档，仅供内部使用和评委评审。_
