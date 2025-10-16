# Supabase 全栈 SaaS 模板

你好，我叫 Adam (Razikus) - 我正在学习中文，但这个 README 已被翻译。如果你发现错误 - 请报告！

一个生产就绪的 SaaS 模板，使用 Next.js 15、Supabase 和 Tailwind CSS 构建。此模板提供了快速启动 SaaS 产品所需的一切，包括身份验证、用户管理、文件存储等。

> **🎉 新功能：移动应用现已推出！** 查看 [README_MOBILE_ZH.md](./README_MOBILE_ZH.md) 了解与同一 Supabase 后端共享的完整 React Native + Expo 移动应用！
> https://youtube.com/shorts/qcASa0Ywsy4?feature=share

## 在线演示

演示和项目信息请见本仓库： https://github.com/Nimboo3/ai-code-reviewer

## 关于
本项目（AI Code Reviewer）托管于： https://github.com/Nimboo3/ai-code-reviewer

## 部署视频

视频地址 - https://www.youtube.com/watch?v=kzbXavLndmE

## 从 auth 架构迁移

请参阅本仓库中的迁移说明和 migrations 文件夹以获取详细信息。如果需要从旧版本迁移，请查看本仓库的 `supabase/migrations_for_old/20250525183944_auth_removal.sql`。


## 🚀 功能特性

- **身份验证**
    - 邮箱/密码身份验证
    - 多因素身份验证（MFA）支持
    - OAuth/SSO 集成就绪
    - 密码重置和邮箱验证

- **用户管理**
    - 用户配置文件和设置
    - 安全密码管理
    - 会话处理

- **文件管理演示（支持 2FA）**
    - 安全文件上传和存储
    - 文件共享功能
    - 拖放界面
    - 进度跟踪

- **任务管理演示（支持 2FA）**
    - CRUD 操作示例
    - 实时更新
    - 过滤和排序
    - 行级安全性

- **安全性**
    - 行级安全（RLS）策略
    - 安全文件存储策略
    - 受保护的 API 路由
    - MFA 实现

- **UI/UX**
    - 现代、响应式设计
    - 深色模式支持
    - 加载状态
    - 错误处理
    - Toast 通知
    - 彩纸动画

- **法律与合规**
    - 隐私政策模板
    - 服务条款模板
    - 退款政策模板
    - GDPR 就绪的 Cookie 同意

## 🛠️ 技术栈

- **前端**
    - Next.js 15（App Router）
    - React 19
    - Tailwind CSS
    - shadcn/ui 组件
    - Lucide 图标

- **后端**
    - Supabase
    - PostgreSQL
    - 行级安全
    - 存储桶

- **身份验证**
    - Supabase Auth
    - MFA 支持
    - OAuth 提供商

## 📦 开始使用 - 本地开发

1. Fork 或克隆仓库
2. 准备 Supabase 项目 URL（从 `项目设置` -> `API` -> `项目 URL` 获取）
3. 准备 Supabase Anon 和 Service 密钥（从 `项目设置` -> `API` -> `anon public` 和 `service_role` 获取 `Anon Key`、`Service Key`）
4. 准备 Supabase 数据库密码（你可以在 `项目设置` -> `数据库` -> `数据库密码` 中重置）
5. 如果你已经知道你的应用 URL -> 调整 supabase/config.toml 中的 `site_url` 和 `additional_redirect_urls`，你也可以稍后再做
6. 运行以下命令（在 fork/下载的仓库根目录内）：

```bash
# 登录 supabase
npx supabase login
# 将项目链接到 supabase（需要数据库密码）- 你会得到选择器提示
npx supabase link

# 将配置发送到服务器 - 可能需要确认（y）
npx supabase config push

# 运行迁移
npx supabase migrations up --linked
```

7. 进入 next/js 文件夹并运行 `yarn`
8. 将 .env.template 复制为 .env.local
9. 调整 .env.local
```
NEXT_PUBLIC_SUPABASE_URL=https://APIURL
NEXT_PUBLIC_SUPABASE_ANON_KEY=ANONKEY
PRIVATE_SUPABASE_SERVICE_KEY=SERVICEROLEKEY
```
10. 运行 yarn dev
11. 访问 http://localhost:3000 🎉

## 🚀 开始使用 - 部署到 Vercel

1. Fork 或克隆仓库
2. 在 Vercel 中创建项目 - 选择你的仓库
3. 将 .env.local 的内容粘贴到环境变量中
4. 点击部署
5. 调整 supabase/config.toml 中的 site_url 和 additional_redirect_urls（重要的是在 additional_redirect_urls 中要有 https://YOURURL/** - 这两个 **）
6. 完成！

## 📄 法律文档

模板包含可自定义的法律文档 - 这些是 markdown 格式，所以你可以根据需要调整：

- 隐私政策（`/public/terms/privacy-notice.md`）
- 服务条款（`/public/terms/terms-of-service.md`）
- 退款政策（`/public/terms/refund-policy.md`）

## 🎨 主题

模板包含几个预构建主题：
- `theme-sass`（默认）
- `theme-blue`
- `theme-purple`
- `theme-green`

通过更新 `NEXT_PUBLIC_THEME` 环境变量来更改主题。

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

## 需要多租户、计费（Paddle）和基于角色的访问控制？

有关高级功能（多租户、计费、基于角色的访问控制）的选项，请在仓库和 issue 跟踪中查看可用的集成方案。

## 📝 许可证

本项目根据 Apache 许可证授权 - 详见 LICENSE 文件。

## 💪 支持

如果你觉得这个项目有帮助，请在 GitHub 上给本仓库一个 star：

- [GitHub](https://github.com/Nimboo3/ai-code-reviewer)

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)