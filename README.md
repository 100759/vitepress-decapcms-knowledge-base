# VitePress + Decap CMS Knowledge Base

这是一个面向 GitHub 存储、Cloudflare Pages 部署的知识库模板。站点由 VitePress 生成，内容通过 Decap CMS 在 `/admin/` 管理，Markdown 文件保存在仓库中。

## 本地开发

先安装 Node.js 20 或更高版本，然后运行：

```bash
npm install
npm run docs:dev
```

访问本地站点：

```text
http://localhost:5173/
```

本地调试 Decap CMS 时，另开一个终端运行：

```bash
npm run cms:proxy
```

然后访问：

```text
http://localhost:5173/admin/
```

## GitHub 设置

1. 在 GitHub 创建仓库。
2. 把本项目推送到仓库的 `main` 分支。
3. 打开 `docs/public/admin/config.yml`，替换：

```yaml
repo: 100759/vitepress-decapcms-knowledge-base
```

如果仓库默认分支不是 `main`，也要同步修改 `branch`。

## Cloudflare Pages 设置

在 Cloudflare Pages 中连接这个 GitHub 仓库，构建设置填写：

```text
Framework preset: VitePress
Build command: npm run docs:build
Build output directory: docs/.vitepress/dist
Root directory: /
Node.js version: 20
```

不要开启会改写 HTML 注释的 HTML Auto Minify，避免影响 Vue hydration。

## Decap CMS 登录

Decap CMS 的 GitHub 后端需要 OAuth 登录。部署在 Cloudflare Pages 时，常见做法是额外部署一个 GitHub OAuth proxy，然后在 `docs/public/admin/config.yml` 中填写：

```yaml
backend:
  name: github
  repo: 100759/vitepress-decapcms-knowledge-base
  branch: main
  base_url: https://your-oauth-proxy.example.com
  auth_endpoint: auth
```

如果你只想本地测试 CMS，当前配置已经启用了 `local_backend: true`，配合 `npm run cms:proxy` 即可。Decap 的本地代理不支持 editorial workflow，建议先用当前的简单发布模式跑通链路。

## 内容结构

- `docs/index.md`：首页。
- `docs/knowledge/index.md`：知识库目录页。
- `docs/knowledge/articles/*.md`：Decap CMS 管理的知识条目。
- `docs/public/images/uploads/`：CMS 上传图片保存位置，发布后访问路径为 `/images/uploads/...`。

新增文章时，只要保存在 `docs/knowledge/articles` 目录，侧边栏会在构建时自动读取并排序。
