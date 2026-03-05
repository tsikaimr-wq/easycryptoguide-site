# 项目结构说明

## 目录总览

- `assets/`
  - `brand/`：favicon 与社交分享预览图
  - `images/`：通用图片资源
  - `images/home/`：首页专用图片资源
- `css/`：附加样式文件
- `js/`：公共脚本
- `admin/`：后台登录页与后台页面副本
- `deploy/`：部署配置示例（Nginx）
- `docs/`：运行、部署、结构、功能说明文档
- `scripts/`：本地开发脚本
  - `dev-server.ps1`：本地 HTTP 服务
  - `legacy/`：历史调试脚本归档

## 页面入口（根目录）

- `index.html`：官网首页
- `login.html`：登录
- `signup.html`：注册
- `mobile.html`：移动端主应用
- `markets.html`：行情页
- `delivery_chart.html`：交割合约
- `admin.html`：后台主页面
- `admin_login.html`：后台登录

## 启动文件

- `server.bat`：Windows 本地一键启动（调用 `scripts/dev-server.ps1`）

## 说明

- 本轮整理以“不改页面路由、不破坏原功能”为原则。
- 主要变化是文档化和资源归类，核心业务页面名称保持不变。
