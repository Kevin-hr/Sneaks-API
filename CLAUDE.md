# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Sneaks-API 是一个聚合四大球鞋转售平台（StockX / Goat / Stadium Goods / Flight Club）数据的 Node.js 接口包。主要数据来源为 StockX（Algolia 搜索 API），其余三个平台异步补充链接和价格。

**当前状态**：项目存在两套并行结构，需注意：
- **Legacy（v1，原版）**：`controllers/` `routes/` `models/` — Express + got + mongoose，Callback 风格
- **Modern（v2，规划中）**：`src/` — Hono + ofetch + TypeScript，async/await，尚未完成

---

## 常用命令

```bash
# 依赖安装
npm install

# 构建 TypeScript（Modern v2）
npm run build

# 开发模式（热重载，Modern v2）
npm run dev

# 测试
npm test          # watch 模式
npm run test:run  # 单次运行

# 类型检查
npm run lint

# 启动 Legacy 版本
node index.js
```

---

## 架构

### Legacy 架构（当前可运行）

```
controllers/sneaks.controllers.js   ← 核心类 Sneaks，暴露 getProducts / getProductPrices / getMostPopular
    ├── scrapers/stockx-scraper.js      ← Algolia 搜索 + StockX 价格 API
    ├── scrapers/goat-scraper.js        ← Goat 链接/价格/图片
    ├── scrapers/stadiumgoods-scraper.js← Stadium Goods 链接/价格
    └── scrapers/flightclub-scraper.js ← Flight Club 链接/价格
routes/sneaks.routes.js             ← Express 路由
models/Sneaker.js                  ← Mongoose Schema（已废弃，未实际使用）
index.js                           ← Express app 入口
```

**核心接口（Legacy）：**

```js
const SneaksAPI = require('./controllers/sneaks.controllers.js');
const sneaks = new SneaksAPI();

sneaks.getProducts(keyword, limit, callback);      // 搜索球鞋
sneaks.getProductPrices(styleID, callback);        // 价格详情（尺码映射表）
sneaks.getMostPopular(limit, callback);             // StockX 热门
```

### Modern 架构（v2，规划中）

```
src/
├── index.ts          ← Hono 入口
├── types.ts          ← TypeScript 类型定义
├── routes/
│   ├── products.ts   ← GET /products?keyword=&limit=
│   ├── prices.ts     ← GET /prices/:styleID
│   └── popular.ts    ← GET /popular?limit=
├── scrapers/
│   ├── stockx.ts    ← StockX（ofetch，async/await）
│   ├── goat.ts
│   ├── stadiumgoods.ts
│   └── flightclub.ts
├── cli.ts            ← CLI 工具（sneaks search/price/popular）
└── mcp.ts            ← MCP Server（AI Agent 集成）
```

---

## 数据流（Legacy）

1. `getProducts(keyword)` → StockX Algolia API 搜索 → 返回 Sneaker 数组
2. 每个 Sneaker 触发 3 个异步 `getLink()` → 补充 Goat/Stadium/FC 链接
3. 计数器达到 3 时返回完整数组

**Sneaker 对象字段：**

| 字段 | 说明 |
|------|------|
| `shoeName` | 球鞋名称 |
| `styleID` | 款式编号（搜索关键字） |
| `colorway` | 配色 |
| `retailPrice` | 发售价 |
| `thumbnail` | 缩略图 URL |
| `resellLinks` | 各平台商品链接 |
| `lowestResellPrice` | 各平台最低转售价 |
| `resellPrices` | 各平台各尺码价格映射表 |

---

## 升级计划（v2）

已制定完整重写计划：`docs/superpowers/plans/2026-04-16-sneaks-api-modernize.md`

核心技术替换：

| 旧（废弃） | 新 |
|-----------|---|
| `express@4` | `hono@4` |
| `got@11`（callback）| `ofetch`（async-await）|
| `request@2`（废弃）| 已移除 |
| 回调 `cb(err, data)` | `Promise / async-await` |
| 无 | `MCP Server` + `sneaks-cli` |

---

## 文档

| 文件 | 说明 |
|------|------|
| `docs/index.html` | 交互式 API 文档（暗黑工业风，带 Demo）|
| `readme.zh.md` | 中文 README |
| `docs/superpowers/plans/2026-04-16-sneaks-api-modernize.md` | v2 重写计划 |
