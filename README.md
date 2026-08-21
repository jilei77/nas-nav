# NAS 导航站

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个简约、大气、时尚的 NAS 个人导航页。支持内外网自动切换、密码保护、AI 自动生成网站描述等功能。

## 功能特点

- **简约设计**: 采用 Vanilla CSS 构建的磨砂玻璃质感 UI，支持浅色/深色/自动跟随系统主题。
- **动态壁纸**: 每日自动获取必应 (Bing) 壁纸。
- **内外网切换**: 一键切换内网/外网链接，方便在不同网络环境下使用。
- **安全保护**: 首次访问需输入密码，验证通过后 30 天内免登录。
- **AI 智能描述**: 集成 OpenAI 接口，可自动生成网站描述。
- **图标支持**: 自动获取 Favicon，支持拼音首字母 fallback。
- **后台管理**: 内置简单的后台管理面板，可在线添加/编辑网站、分类及系统设置。
- **数据备份**: 支持 JSON 格式的数据备份与恢复。

## 快速开始

1. **安装依赖**

```bash
npm install
```

2. **启动开发服务器**

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)。

## 默认配置

- **默认密码**: `admin`
- **数据存储**: 所有数据存储在 `data/sites.json` 文件中。

## 使用说明

1. **首次登录**: 输入默认密码 `admin` 进入。
2. **修改密码**: 点击右上角的设置图标（齿轮），进入“设置 & 备份”选项卡修改密码。
3. **添加网站**: 在后台管理界面点击“添加网站”，输入名称和链接。
4. **AI 描述**: 在设置中配置 OpenAI API 地址和 Key，添加网站时点击“魔术棒”图标即可自动生成描述。

## 部署指南

### 方法 1：一键部署到 Cloudflare Pages (推荐)

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/fmhgit/nas-nav)

> **注意**: 由于本项目使用本地 JSON 文件存储数据，部署到 Cloudflare Pages 等无服务器环境时，**无法在网页端保存修改**（如添加网站、修改密码）。所有配置必须在代码仓库中的 `data/sites.json` 文件里修改，然后提交代码触发重新部署。

**详细部署步骤：**

1.  **点击上方部署按钮**：这将跳转到 Cloudflare 的部署页面。
2.  **连接 GitHub**：如果你尚未登录，请登录 Cloudflare 并授权访问你的 GitHub 账号。
3.  **配置项目**：
    *   **Project name (项目名称)**: 默认为 `nas-nav`，你可以修改为你喜欢的名字。
    *   **Framework preset (框架预设)**: 选择 `Next.js`。
    *   **Build command (构建命令)**: 保持默认 `npm run build`。
    *   **Build output directory (构建输出目录)**: 保持默认 `.next` (或留空，Cloudflare 会自动识别)。
4.  **环境变量 (Environment Variables)**:
    *   点击 "Add variable" 添加以下变量：
    *   **Variable name**: `NODE_VERSION`
    *   **Value**: `20`
5.  **完成部署**: 点击 "Save and Deploy" 按钮，等待构建完成即可访问。

### 方法 2：Docker 部署到飞牛 NAS (FnOS)

此方法支持完整功能（包括在线修改和保存数据）。

#### 步骤 1：准备文件
在 NAS 上创建一个文件夹（例如 `nas-nav`），并将本项目中的以下文件上传到该文件夹：
- `Dockerfile`
- `docker-compose.yml`
- `package.json`
- `package-lock.json`
- `next.config.ts` (或 .js)
- `tsconfig.json`
- `app/` 目录
- `components/` 目录
- `data/` 目录
- `public/` 目录

*或者，如果你熟悉 git，可以直接在 NAS 上 git clone 本仓库。*

#### 步骤 2：构建并启动
使用 SSH 连接到你的 NAS，进入文件夹，运行：

```bash
docker-compose up -d --build
```

#### 步骤 3：访问
部署完成后，访问 `http://<NAS_IP>:3000` 即可。

> **数据持久化**: `data/` 目录已挂载到容器外部，你在网页上添加的网站和修改的配置都会保存在 NAS 本地的 `data/sites.json` 文件中，重启容器不会丢失。
