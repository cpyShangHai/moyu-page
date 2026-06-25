# 笔记

Electron 桌面应用：上半屏嵌入真实技术文档（MDN、React 官方文档等），下半屏通过内嵌浏览器访问视频站点。界面简洁，适合分屏阅读与浏览。

## 功能特性

- **真实文档**：侧边栏切换 MDN、react.dev、TypeScript 手册等官方页面
- **多平台视频**：哔哩哔哩、YouTube、优酷、爱奇艺、腾讯视频及自定义网址
- **Electron 内嵌**：通过 `<webview>` 直接加载各站官网，支持登录与完整功能
- **可拖拽分隔条**：上下区域高度可调
- **视频全屏**：一键全屏，Esc 退出
- **专注阅读**：隐藏视频区，只保留文档（Esc 切换）
- **全局 Esc**：文档内多级跳转后仍可切回视频区

## 项目结构

```
moyu-page/
├── desktop/
│   ├── main.js       # Electron 主进程
│   ├── preload.js    # 预加载脚本
│   ├── nav-handler.js
│   └── launch.js     # 启动入口
├── index.html        # 主界面
├── server.js         # 本地静态服务（供 Electron 加载页面）
├── package.json
├── dist/             # 打包产物（build 后生成）
└── README.md
```

## 环境要求

- Node.js >= 18
- macOS / Windows / Linux

> 本项目为 **Electron 桌面应用**，不支持浏览器独立运行。

## 快速开始

```bash
cd moyu-page
npm install
npm start          # 或 npm run electron
```

## 打包为独立 App

```bash
# macOS
npm run build:mac

# Windows（需在 Windows 环境执行）
npm run build:win
```

打包产物位于 `dist/` 目录：

| 文件 | 说明 |
|------|------|
| `笔记-1.0.0-arm64.dmg` | macOS 安装包 |
| `dist/mac-arm64/笔记.app` | macOS 可直接运行 |
| `笔记-1.0.0-arm64-mac.zip` | macOS 压缩包 |

安装后将 **笔记** 拖入「应用程序」文件夹即可。

> 首次打开若提示「无法验证开发者」，请到 **系统设置 → 隐私与安全性** 点击「仍要打开」。

## 使用说明

### 快捷键

| 按键 | 作用 |
|------|------|
| `Esc` | 退出视频全屏；或切换「专注阅读」/ 显示视频 |
| 拖拽分隔条 | 调整上下区域高度 |

### 顶栏按钮（鼠标悬停顶栏显示）

| 按钮 | 作用 |
|------|------|
| 专注阅读 | 隐藏视频区 |
| 视频 | 显示 / 隐藏视频区 |

### 视频区

- 切换标签自动打开各平台官网
- 输入 BV 号或视频链接后点击「加载」
- 「全屏」使视频区占满窗口
- 「新窗口」在系统浏览器中打开

## 自定义配置

### 修改文档列表

编辑 `index.html` 中的 `DOC_PAGES`：

```javascript
const DOC_PAGES = {
  useEffect: {
    title: 'useEffect',
    url: 'https://react.dev/reference/react/useEffect',
  },
};
```

侧边栏增加对应项：

```html
<div class="sidebar-item" data-doc="useEffect">useEffect</div>
```

### 修改应用名称

修改 `package.json` 中 `build.productName`，重新打包。

## 技术说明

- **前端**：HTML / CSS / JavaScript
- **桌面**：Electron + electron-builder
- **内嵌方式**：`<webview>` 加载外部网页（等同内嵌 Chromium 标签页）
- **本地服务**：Express 仅用于向 Electron 提供 `index.html` 静态资源

## 免责声明

> **本软件仅供个人学习与技术研究使用，不构成任何法律意见。**

1. **遵守法律法规**：使用者应遵守所在地区法律法规，以及所访问网站（MDN、B 站、优酷等）的[服务条款](https://www.bilibili.com/protocal/licence)与版权声明。
2. **内容版权**：文档与视频内容的著作权归各平台及原作者所有。本软件仅提供分屏浏览框架，**不提供、不存储、不分发任何第三方内容**。
3. **账号与付费**：请使用本人账号访问各平台。付费、会员内容的使用规则以各平台规定为准。
4. **工作场景**：在工作场所使用本软件可能违反用人单位规章制度，相关后果由使用者自行承担。
5. **开源责任**：本项目按「原样」提供，作者不对因使用本软件产生的任何直接或间接损失承担责任。

### 启动后显示「请使用桌面版运行」？

1. 必须在 **`moyu-page` 目录**下执行 `npm start`（不是上级 `cpy开源` 目录）
2. 不要手动用浏览器打开 `http://localhost:3456`，请等待 Electron 窗口自动弹出
3. 若仍异常，执行 `npm install` 后重试

> Cursor 终端可能设置 `ELECTRON_RUN_AS_NODE=1`，项目已通过 `desktop/launch.js` 自动处理。

## 常见问题

**Q: Esc 在文档多级页面后无效？**  
A: Electron 主进程会全局捕获 Esc。请确保使用桌面版而非直接在浏览器打开。

**Q: 如何更换应用图标？**  
A: 准备 `icon.icns`（macOS）或 `icon.ico`（Windows），配置 `package.json` 的 `build.mac.icon` / `build.win.icon` 后重新打包。

## 脚本一览

| 命令 | 说明 |
|------|------|
| `npm start` | 启动桌面版 |
| `npm run build:mac` | 打包 macOS 应用 |
| `npm run build:win` | 打包 Windows 安装包 |

## 许可

MIT License — 仅供个人学习使用，请勿用于侵犯他人知识产权或违反平台服务条款的行为。
