# Sneaks API

<p align="center">
  <img src="https://github.com/druv5319/Sneaks-API/blob/master/Screenshots/Sneaks_Logo.png?raw=true" width=250>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/sneaks-api" alt="Version">
    <img src="https://img.shields.io/npm/v/sneaks-api" /></a>
  <a href="https://www.npmjs.com/package/sneaks-api" alt="Downloads">
    <img src="https://img.shields.io/npm/dt/sneaks-api " /></a>
</p>

| 特性 | 说明 |
|------|------|
| **一句话概括** | 整合 StockX / FlightClub / Goat / Stadium Goods 四大球鞋转售平台 API 的 Node.js 球鞋数据接口 |
| **核心功能** | 搜索球鞋、查询价格、获取热门商品 |
| **技术栈** | Node.js + Express + Got |
| **npm** | `sneaks-api` |

---

## 功能特性

Sneaks API 将四个主流球鞋转售平台的数据合为一体，主要从 StockX 抓取基础信息，再异步从 Stadium Goods、Goat、Flight Club 获取图片和转售价格。

**返回的球鞋对象包含以下字段：**

| 字段 | 说明 |
|------|------|
| Sneaker Name | 球鞋名称 |
| Colorway | 配色 |
| Description | 描述 |
| Release Date | 发售日期 |
| Retail Price | 零售价 |
| Style ID | 款式编号 |
| Image Links | 图片链接 |
| Product links | 各平台商品页面链接 |
| Price Map | 各平台不同尺码对应的转售价格 |

---

## 技术栈

| 技术 | 用途 |
|------|------|
| Node.js | 运行时 |
| Express | HTTP 框架 |
| Got | HTTP 请求库 |
| Request | 备用请求库 |
| Mongoose | 数据库（可选） |

---

## 安装

```bash
# 1. 确保已安装 Node.js (https://nodejs.org/)
# 2. 在项目目录下执行
npm install sneaks-api
```

---

## 快速开始

```js
const SneaksAPI = require('sneaks-api');
const sneaks = new SneaksAPI();

// 搜索商品（关键词 + 数量上限）
sneaks.getProducts("Yeezy Cinder", 10, function(err, products) {
    console.log(products);
});

// 根据 Style ID 查询详细价格（包含价格映射表）
sneaks.getProductPrices("FY2903", function(err, product) {
    console.log(product);
});

// 获取 StockX 当前热门商品
sneaks.getMostPopular(10, function(err, products) {
    console.log(products);
});
```

### 方法说明

| 方法 | 参数 | 返回 |
|------|------|------|
| `getProducts(keyword, limit, callback)` | 关键词、返回数量上限 | 商品数组 |
| `getProductPrices(styleID, callback)` | 款式编号（Style ID） | 完整商品信息 + 各平台价格映射表 |
| `getMostPopular(limit, callback)` | 返回数量上限 | StockX 热门商品数组 |

---

## 演示项目

### Sneaks App

<a href="https://github.com/druv5319/sneaks-app">
  <img src="https://github.com/druv5319/Sneaks-API/blob/master/Screenshots/demo.gif?raw=true" width=700>
</a>

### Twilio 教程：构建球鞋价格追踪器

| 截图 | 截图 |
|------|------|
| <img src="https://github.com/druv5319/Sneaks-API/blob/master/Screenshots/euCdtWvMESTjo9_Smd_wRpoNvhk6XOr3n3QlnHYNRAHHU.width-1000_RWrysBn-2.png" width=350"> | <img src="https://github.com/druv5319/Sneaks-API/blob/master/Screenshots/syHg2FzA1dcFjpp6XlqNq_ZRNDXJPcdWCJzGhBcU2PPXv.width-1000_VZzgt9G.png" width=350"> |

> 教程原文：[Build a Sneaker Price Tracker with Twilio Programmable SMS](https://www.twilio.com/blog/build-price-tracker-twilio-programmable-sms-node)

---

## 历史更新

| 版本 | 更新内容 |
|------|----------|
| **1.2.3** | 修复 Goat API（适配其接口变更），移除本地 Web 服务器（localhost:4000） |

---

## 贡献

欢迎 Fork、提交 Pull Request 或创建 Issue。
