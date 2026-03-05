# EasyCrypto 前端项目

这是一个以交易所为主题的纯前端项目，包含官网首页、登录注册、移动端主站、行情页、永续与交割合约页面，以及后台页面。

## 快速开始

1. 进入项目目录：
   `cd ECPROJECT-main`
2. 本地启动（Windows）：
   `server.bat`
3. 浏览器打开：
   `http://localhost:8000/index.html`

可指定端口：
`server.bat 8080`

## 服务器部署要点

- `server.bat` 仅用于 Windows 本地调试。
- 正式部署（尤其海外服务器）建议使用 Nginx 静态托管。
- 上线后请将页面内的 `https://YOUR_DOMAIN/` 替换为真实域名。
- Firebase Console 中必须将线上域名加入 `Authorized Domains`。

## 文档导航

- 运行说明：`docs/RUNNING.md`
- 部署说明：`docs/DEPLOYMENT.md`
- 项目结构：`docs/PROJECT_STRUCTURE.md`
- 功能说明（中文）：`docs/项目功能说明.md`
- 验收记录（中文）：`docs/验收与运行说明.md`
- Nginx 示例配置：`deploy/nginx.conf.example`
