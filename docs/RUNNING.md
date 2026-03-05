# 运行说明

## 1. 本地运行（Windows）

1. 打开终端进入项目目录：
   `cd ECPROJECT-main`
2. 启动本地服务：
   `server.bat`
3. 浏览器打开：
   `http://localhost:8000/index.html`

可指定端口：
`server.bat 8080`

## 2. 常见问题

### 2.1 运行了 bat 但网页打不开

按顺序检查：

1. 确认访问地址是 `http://localhost:8000/index.html`（不是空白协议地址）。
2. 若端口被占用，改端口启动：
   `server.bat 8080`
3. 关闭旧的 bat 窗口后再启动，避免旧进程占用端口。
4. 终端看到 `Failed to start local server` 时，通常是端口冲突或权限问题。

### 2.2 直接双击 html 文件打不开数据/接口

必须通过 HTTP 访问（`server.bat` 或 Nginx），不要用 `file:///` 方式直接打开页面。

## 3. 常用入口

- 首页：`/index.html`
- 登录：`/login.html`
- 注册：`/signup.html`
- 移动端：`/mobile.html`
- 行情：`/markets.html`
- 交割合约：`/delivery_chart.html`
- 后台：`/admin.html`
