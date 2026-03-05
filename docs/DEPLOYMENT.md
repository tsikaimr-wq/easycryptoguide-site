# 部署说明

## 1. 服务器要不要运行 bat

结论：

- Linux 服务器：不使用 `server.bat`，推荐 Nginx 静态托管。
- Windows 服务器：可临时跑 `server.bat`，但不建议作为正式生产方案。

`server.bat` 是本地开发启动器，不是标准生产部署方式。

## 2. 推荐部署（Linux + Nginx）

1. 把 `ECPROJECT-main` 上传到服务器，例如：
   `/var/www/easycrypto`
2. 复制 `deploy/nginx.conf.example` 到 Nginx 配置目录并改域名。
3. 重载 Nginx：
   `sudo nginx -t && sudo systemctl reload nginx`
4. 浏览器验证：
   `https://你的域名/index.html`

## 3. 上线前必须做

1. 将所有 `https://YOUR_DOMAIN/` 替换成真实域名。
2. 确保 `https://你的域名/assets/brand/og-preview.png` 可公网访问。
3. 在 Firebase Console -> Authentication -> Settings -> Authorized domains 中加入你的线上域名。
4. 如使用短信登录，确认 reCAPTCHA 与 Firebase 域名策略都已放行。

## 4. 分享预览（WhatsApp/Telegram）

项目已写入 Open Graph / Twitter Card 标签。你只需保证：

1. 页面头部里的 `og:url` 与 `og:image` 指向真实线上地址。
2. 线上图片能直接访问且返回 `200`。
3. 首次分享若缓存旧图，可换带查询参数的链接测试（如 `?v=2`）。

## 5. 安全提醒

当前项目为前端直连方式，存在前端可见配置。正式商业使用建议增加后端网关做密钥与权限隔离。
