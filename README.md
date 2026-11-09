# Car Rental Web

Git 仓库：https://github.com/rick-peng-li/Car-Rental-web

一套前后端分离的汽车租赁系统，覆盖车辆浏览与可用时段筛选、在线下单支付、个人订单管理、后台车辆与订单管理。前端基于 React 19 + Vite 构建为单页应用，后端提供基于 JWT 鉴权的 Express REST API，数据存储使用 MongoDB。

## 技术栈

### 前端 client/

| 技术 | 版本 | 用途 |
| --- | --- | --- |
| React | 19 | 视图层，全部使用函数组件与 Hooks |
| Vite | 8 | 开发服务器与生产构建，配置 `@/` 路径别名 |
| React Router | 7 | 路由与路由守卫（登录守卫、管理员守卫） |
| Redux Toolkit | 2 | 全局状态管理，`createAsyncThunk` 处理异步请求 |
| Ant Design | 6 | UI 组件库，主题定制与响应式布局 |
| Axios | 1 | HTTP 请求，统一拦截器注入 Token 与错误处理 |
| Day.js | 1 | 时间计算与时段冲突判断 |

### 后端 server/

| 技术 | 版本 | 用途 |
| --- | --- | --- |
| Node.js | ≥ 20.19 | 运行时，全量使用 ES Module |
| Express | 5 | REST API 路由与中间件 |
| Mongoose | 9 | MongoDB 数据建模，Schema 校验与钩子 |
| JSON Web Token | 9 | 无状态登录鉴权 |
| bcryptjs | 3 | 密码加盐哈希存储 |
| express-validator | 7 | 请求参数校验 |
| Helmet / CORS / Morgan | - | 安全响应头、跨域与请求日志 |

## 目录结构

```
Car-Rental-web/
├── client/                        # 前端
│   ├── index.html
│   ├── vite.config.js             # 别名 @ -> src，/api 代理到 5000
│   └── src/
│       ├── main.jsx               # 应用入口
│       ├── App.jsx                # 主题配置 + 路由挂载
│       ├── router/                # 路由表与守卫
│       ├── layouts/               # 主布局（导航、页脚）
│       ├── pages/                 # 页面：home / auth / booking / admin
│       ├── components/            # 拆分后的业务组件
│       │   ├── auth/
│       │   ├── cars/
│       │   ├── booking/
│       │   └── common/
│       ├── store/                 # Redux store 与 slices
│       ├── services/              # 接口层（axios 封装）
│       ├── hooks/                 # 复用逻辑（认证、车辆、报价）
│       ├── utils/                 # 常量、时间计算、本地存储
│       └── styles/                # 全局样式
│
├── server/                        # 后端
│   ├── .env.example
│   └── src/
│       ├── server.js              # 启动入口：连库 -> 初始化数据 -> 监听
│       ├── app.js                 # Express 应用装配
│       ├── config/                # 环境变量与数据库连接
│       ├── routes/                # 路由定义与参数校验
│       ├── controllers/           # 业务处理
│       ├── models/                # Mongoose 数据模型
│       ├── middleware/            # 鉴权、校验、错误处理
│       └── utils/                 # Token、价格计算、种子数据
│
├── Dockerfile                     # 多阶段构建（前端构建 + 后端运行）
├── docker-compose.yml             # app + mongo 编排
└── README.md
```

## 页面功能

| 路径 | 页面 | 说明 |
| --- | --- | --- |
| `/login` | 登录 | 账号密码登录，成功后写入 Token 并跳回原访问页 |
| `/register` | 注册 | 用户名唯一校验、密码长度与二次确认 |
| `/` | 首页 | Hero 展示车辆统计；支持取还车时间与燃料类型筛选，实时剔除已被预订的车辆 |
| `/booking/:carId` | 预订详情 | 展示车辆信息与已订时段；预填取还车时间，实时计算时长与总价，需完成模拟支付后下单 |
| `/my-bookings` | 我的订单 | 展示订单车辆、时段、时长、金额与状态，可取消订单并释放时段 |
| `/admin` | 管理后台 | 管理员专属，Tab 切换车辆管理与全部订单；车辆表格支持编辑、删除 |
| `/admin/add-car` | 添加车辆 | 录入名称、图片、时租、座位数、燃料类型 |
| `/admin/edit-car/:carId` | 编辑车辆 | 修改已有车辆信息 |
| `*` | 404 | 未匹配路由兜底页 |

登录态与管理员权限由路由守卫控制：未登录访问业务页面会重定向至 `/login`，普通用户访问 `/admin` 会回到首页。

## 接口设计

统一响应格式：成功 `{ success, data, count? }`，失败 `{ success: false, message }`。

### 认证 `/api/auth`

| 方法 | 路径 | 权限 | 说明 |
| --- | --- | --- | --- |
| POST | `/register` | 公开 | 注册普通用户，返回用户信息与 Token |
| POST | `/login` | 公开 | 登录，返回用户信息与 Token |
| GET | `/me` | 登录 | 获取当前登录用户 |

### 车辆 `/api/cars`

| 方法 | 路径 | 权限 | 说明 |
| --- | --- | --- | --- |
| GET | `/` | 公开 | 获取全部车辆 |
| GET | `/:id` | 公开 | 获取单车详情 |
| POST | `/` | 管理员 | 新增车辆 |
| PUT | `/:id` | 管理员 | 更新车辆 |
| DELETE | `/:id` | 管理员 | 删除车辆 |

### 订单 `/api/bookings`

| 方法 | 路径 | 权限 | 说明 |
| --- | --- | --- | --- |
| POST | `/` | 登录 | 创建订单，服务端校验时段冲突并重新计算金额 |
| GET | `/my` | 登录 | 当前用户的订单列表 |
| GET | `/` | 管理员 | 全部订单（含用户、车辆） |
| DELETE | `/:id` | 本人/管理员 | 取消订单并释放车辆占用时段 |

另有 `GET /api/health` 用于服务健康检查。

## 启动方式

### 方式一：Docker Compose（推荐）

```bash
docker compose up --build -d
```

访问 http://localhost:8080 。

- 容器：`car-rental-app`（Express + 前端静态产物）、`car-rental-mongo`（MongoDB 7）
- macOS 的 AirPlay 接收器会占用 5000 端口，因此宿主机映射为 8080；若本机 5000 空闲，可改为 `5000:5000`
- 停止：`docker compose down`（加 `-v` 同时清空数据库）

### 方式二：本地开发

前置要求：Node.js ≥ 20.19，MongoDB 已运行。

后端：

```bash
cd server
npm install
cp .env.example .env        # 按需修改 MONGO_URL / JWT_SECRET
npm run dev                 # http://localhost:5000
```

前端：

```bash
cd client
npm install
npm run dev                 # http://localhost:5173，/api 自动代理到 5000
```

生产构建：

```bash
cd client && npm run build  # 产物输出到 client/dist
cd ../server && npm start   # NODE_ENV=production 时由后端托管前端产物
```

## 环境变量

`server/.env` 支持的配置项：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `NODE_ENV` | `development` | 生产模式会托管前端构建产物 |
| `PORT` | `5000` | API 监听端口 |
| `MONGO_URL` | `mongodb://127.0.0.1:27017/car_rental` | MongoDB 连接串 |
| `JWT_SECRET` | 开发默认值 | Token 签名密钥，生产环境必须替换 |
| `JWT_EXPIRES_IN` | `7d` | Token 有效期 |
| `CLIENT_ORIGIN` | `http://localhost:5173` | 开发环境允许的跨域来源 |
| `ADMIN_USERNAME` | `admin` | 首次启动创建的管理员账号 |
| `ADMIN_PASSWORD` | `admin123` | 首次启动创建的管理员密码 |

## 演示账号

首次启动时自动初始化管理员账号与 6 辆示例车辆（仅在数据为空时执行）：

- 用户名：`admin`
- 密码：`admin123`
- 权限：管理员，可访问车辆管理、全部订单等后台功能

也可在注册页创建普通用户账号，用于体验浏览、预订与订单管理。
