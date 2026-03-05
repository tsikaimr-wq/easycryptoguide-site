# API 数据核对说明

更新日期：2026-03-04

## 1. Twelve Data 行情 API

### 已调用接口
- `GET https://api.twelvedata.com/quote`
- `GET https://api.twelvedata.com/time_series`
- `WS  wss://ws.twelvedata.com/v1/quotes/price`

### 主要调用页面
- `markets.html`
- `mobile.html`
- `delivery_chart.html`

### 字段核对（本次修复后）
- `price / close`：用于最新价显示（市场列表、交易页、K线顶部）。
- `percent_change`：用于涨跌幅显示（红绿颜色）。
- `rolling_24h_volume / volume / day_volume`：用于成交量展示。
- `high / low`：用于 24H 高低价展示（K线顶部/合约页）。
- `previous_close`：用于部分页面计算实时涨跌。

### 本次补充
- `delivery_chart.html`：补充了币种抽屉列表 `volume-cell` 成交量更新（此前大量显示 `--`）。
- `delivery_chart.html`：`header-total` 从模拟值改为“价格 * 成交量”的真实估算值。
- `mobile.html`：24H 高/低/量/额不再随机模拟，优先使用 Twelve Data 实际字段。
- `mobile.html`：币种列表 `Volume` 字段已接入 API 返回数据。

## 2. Firebase API（认证与数据库）

### 已调用服务
- Firebase Authentication（注册、登录、会话）
- Cloud Firestore（用户资料、KYC、订单、充值/提现、客服消息）

### 主要调用文件
- `firebase-config.js`
- `index.html / login.html / signup.html / mobile.html / admin.html / admin_login.html`

### 本次补充
- 登录页已新增“忘记密码”真实重置流程：`sendPasswordResetEmail`。

## 3. 其它 API

- QR Code 生成：`https://api.qrserver.com/v1/create-qr-code`
  - 用于后台充值地址二维码展示与下载。
- 多语言翻译：`https://translate.googleapis.com/translate_a/single`
  - 用于中/德语言自动翻译与缓存。

## 4. 结论

- 行情 API 关键字段目前已覆盖并落地到主要可视区域（价格、涨跌、成交量、24H高低、成交额估算）。
- 之前未展示或模拟展示的数据点（特别是 `delivery_chart` 成交量、`mobile` K线统计）已补齐为真实 API 数据优先。
