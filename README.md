# HappyBirthday

中文 | [English](./README_EN.md)

HappyBirthday 是一个可配置的 HTML、CSS、JavaScript 生日祝福微型网站。你可以 Fork 后手工定制，也可以使用仓库内置的 Codex Skill，通过一句描述和可选本地素材创建新的、可继续编辑的网站。

## v2.1 新增能力

- 完整静态构建与本地打包的 GSAP，不再依赖第三方动画 CDN。
- `classic`、`warm`、`minimal` 三个主题。
- 基于 Schema 的配置校验和本地素材安全检查。
- 生成独立源码项目和可直接部署的 `dist/` 目录。
- 仓库级 Codex Skill：`happy-birthday-maker`。

## 本地开发

需要 Node.js 20 或更高版本。

```bash
npm ci
npm run dev
```

构建并检查部署产物：

```bash
npm run build
npm run check-dist
```

## 手工配置

编辑 `customize.json` 后执行：

```bash
npm run validate -- --config customize.json
```

原有的文案字段、`imagePath`、`music`、`fonts` 字段都继续支持。`theme` 为可选字段，未填写时使用 `classic`。

```json
{
  "theme": "warm",
  "name": "小雨",
  "imagePath": "./img/lydia2.png",
  "music": "./music/bgMusic.mp3"
}
```

自定义本地图片支持 PNG/JPEG/WebP/GIF，最大 10 MiB；音频支持 MP3/OGG/WAV/M4A，最大 25 MiB；字体支持 TTF/OTF/WOFF/WOFF2，最大 10 MiB。远程资源必须使用 HTTPS。校验器会拒绝危险协议和越出配置目录的相对路径。

## 快速创建独立网站

将配置文件和可选本地素材放在同一目录，然后执行：

```bash
npm run create -- --config ./my-birthday/customize.json --output ./generated/xiaoyu-birthday
npm run preview -- --site ./generated/xiaoyu-birthday
```

生成器不会覆盖已存在目录，会复制本地素材、创建可编辑源码并构建 `dist/`。它不会部署、读取凭证或上传素材。请将 `generated/xiaoyu-birthday/dist/` 手动部署到 GitHub Pages、Netlify、Vercel 或其他静态托管服务。

## 使用 Codex Skill

在本仓库内运行 Codex 后，可直接调用：

```text
$happy-birthday-maker 为小雨制作一个温暖的中文生日页面，使用 ./photo.png 和 ./song.mp3。
```

Skill 位于 `.agents/skills/happy-birthday-maker/`，Codex 会在仓库内自动发现。它将用户文案和本地素材视为数据，只写入新目录；若要保留外部 HTTPS 资源，会先说明域名和网络请求。它不自动部署、不上传素材、不读取密钥，也不直接调用 OpenAI API。

如果要在仓库外复用，可通过 Codex Skill installer 从本公开 GitHub 仓库安装。Plugin 打包会在获得更多真实反馈后再进行。

## 贡献与安全

提交通用改进前请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)。姓名、照片、私密文案、音乐和部署设置请保留在自己的 Fork 中。安全报告和信任边界请见 [SECURITY.md](./SECURITY.md)。

本项目基于 [faahim/happy-birthday](https://github.com/faahim/happy-birthday) 修改，并保留其 MIT 许可证和署名。
