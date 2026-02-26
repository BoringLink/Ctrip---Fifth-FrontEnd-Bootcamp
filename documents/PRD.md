# 易宿酒店预订平台 — 产品需求文档 (PRD)

## 1. 项目概述

易宿是一个面向旅游出行场景的酒店预订平台，分为两个独立前端应用：

| 应用 | 平台 | 目标用户 |
|------|------|----------|
| 管理端 (admin-web) | PC 浏览器 | 酒店商户、平台管理员 |
| 用户端 (mobile-web) | 移动端 H5 | 旅行者/消费者 |

后端已完成，基于 NestJS + PostgreSQL + Prisma，提供完整 REST API。

---

## 2. 用户角色

| 角色 | 说明 |
|------|------|
| merchant（商户） | 录入、管理自己的酒店信息 |
| admin（管理员） | 审核商户提交的酒店，管理标签 |
| 游客（未登录用户） | 搜索、浏览、预订酒店 |

---

## 3. 管理端 (admin-web) 功能需求

### 3.1 认证模块
- **登录页**：邮箱 + 密码登录，JWT 存 localStorage，角色路由守卫
- **注册页**：邮箱、密码、姓名、角色选择（merchant/admin）

### 3.2 商户功能
| 页面 | 功能 |
|------|------|
| 酒店列表 | 查看自己的酒店，显示状态（待审核/已上线/已拒绝/已下线） |
| 创建酒店 | 多步骤表单：基本信息 → 房型 → 设施 → 图片 → 优惠 → 附近景点 |
| 编辑酒店 | 同创建，回填已有数据 |
| 酒店详情 | 查看完整信息，含拒绝原因 |
| 预订管理 | 查看本酒店的预订列表，执行入住/退房操作 |
| 在住客人 | 查看当前在住客人列表 |

### 3.3 管理员功能
| 页面 | 功能 |
|------|------|
| 待审核列表 | 查看所有 pending 状态酒店 |
| 审核详情 | 查看酒店完整信息，执行通过/拒绝（填写原因）/下线 |
| 标签管理 | 创建、编辑、删除标签；为酒店关联/取消标签 |

---

## 4. 用户端 (mobile-web) 功能需求

### 4.1 首页
- 搜索栏：目的地关键词、入住/离店日期、人数
- 热门标签快速筛选
- 推荐酒店卡片列表（已上线酒店）

### 4.2 搜索结果页
- 筛选条件：关键词、价格区间、星级、标签
- 酒店卡片列表（图片、名称、星级、最低价格、标签）
- 分页加载

### 4.3 酒店详情页
- 图片轮播
- 基本信息（名称、星级、地址、描述）
- 设施列表
- 附近景点
- 优惠活动
- 房型列表（名称、价格、容量、数量）
- 预订入口

### 4.4 预订页
- 选择房型、入住/离店日期
- 实时计算总价
- 填写联系人信息（姓名、手机、邮箱）
- 添加入住人（姓名、证件类型、证件号）
- 提交预订

### 4.5 预订确认页
- 展示预订号、酒店名、房型、日期、总价
- 状态说明

---

## 5. 技术架构

### 5.1 目录结构
```
├── backend/          # 已完成
├── admin-web/        # PC 管理端
│   ├── src/
│   │   ├── api/      # axios 封装 + 各模块接口
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── merchant/
│   │   │   └── admin/
│   │   ├── router/   # React Router + 路由守卫
│   │   ├── store/    # Zustand 全局状态
│   │   └── types/    # TypeScript 类型定义
│   └── vite.config.ts
├── mobile-web/       # 移动端 H5
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   ├── search/
│   │   │   ├── hotel/
│   │   │   └── booking/
│   │   ├── router/
│   │   ├── store/
│   │   └── types/
│   └── vite.config.ts
└── documents/
```

### 5.2 技术选型

| 项目 | 技术栈 | 理由 |
|------|--------|------|
| admin-web | React 18 + TypeScript + Vite + Ant Design 5 + React Router 6 + Zustand + Axios | Ant Design 适合后台管理系统，组件丰富 |
| mobile-web | React 18 + TypeScript + Vite + Vant 4 + React Router 6 + Zustand + Axios | Vant 是成熟的移动端组件库，H5 友好 |

### 5.3 API 代理配置
开发环境通过 Vite proxy 转发到后端 `http://localhost:3000`

---

## 6. 页面路由设计

### admin-web
```
/login              登录
/register           注册
/merchant/hotels    商户酒店列表
/merchant/hotels/new        创建酒店
/merchant/hotels/:id        酒店详情
/merchant/hotels/:id/edit   编辑酒店
/merchant/reservations      预订管理
/admin/review       待审核列表
/admin/review/:id   审核详情
/admin/tags         标签管理
```

### mobile-web
```
/                   首页
/search             搜索结果
/hotel/:id          酒店详情
/booking/:hotelId/:roomId   预订页
/booking/confirm/:reservationId  预订确认
```

---

## 7. 数据流设计

```
用户操作 → React 组件 → Zustand Action → Axios API → NestJS Backend → PostgreSQL
                                ↓
                         组件响应式更新
```

- **认证状态**：token + user 存 Zustand + localStorage 持久化
- **路由守卫**：检查 token 有效性 + 角色权限
- **错误处理**：Axios 拦截器统一处理 401（跳转登录）、其他错误 toast 提示

---

## 8. 开发优先级

| 优先级 | 功能 |
|--------|------|
| P0 | 登录/注册、商户酒店 CRUD、管理员审核 |
| P0 | 移动端搜索、酒店详情、预订流程 |
| P1 | 预订管理（入住/退房）、在住客人 |
| P1 | 标签管理 |
| P2 | 优惠展示、附近景点 |
