# 生日快乐

<p>
<img src="https://img.shields.io/github/release/abandon888/HappyBirthday" alt="release" />
<img src="https://img.shields.io/github/stars/abandon888/HappyBirthday" alt="stars" />
<img src="https://img.shields.io/github/issues/abandon888/HappyBirthday" alt="issues" />
<img src="https://img.shields.io/github/forks/abandon888/HappyBirthday" alt="forks" />
<img src="https://img.shields.io/github/license/abandon888/HappyBirthday" alt="license" />
<a href="https://app.netlify.com/sites/friendly-paprenjak-ad64b7/deploys"><img src="https://api.netlify.com/api/v1/badges/39d29171-f3b1-4172-932e-1f657058303a/deploy-status" alt="Netlify Status" /></a>
</p>

中文｜[English](./README_EN.md)
以特殊的方式祝某人生日快乐。
本项目预览页面：<https://friendly-paprenjak-ad64b7.netlify.app/>

**项目亮点：**

1. 精心设计的文字动效与浪漫飘逸的气球动画
2. 通过简单修改`customize.json`文件即可自定义所有文字内容、图片素材、背景音乐及字体样式
3. 点击页面任意位置都会绽放绚丽的烟花特效
4. 自动播放优美的背景音乐,营造温馨浪漫的氛围
5. 使用现代化的 rspack 构建项目，性能更优

## 一些你或许想了解的项目背景

用于祝福特别的人或者恋人生日快乐，烘托浪漫气氛,关于项目背后的故事，可以看看我的知乎博客文章：[由庆祝生日所想到的——网站背景音乐播放](https://zhuanlan.zhihu.com/p/677636150)

## 使用方法

fork 本项目，修改 customize.json 文件，将里面的内容替换为你自己的内容，然后在 github pages 或者其它一些托管网站上部署(如 netlify)即可。
> 你不需要向本仓库发起 PR

可以修改文字，图片，背景音乐,字体等，但有一些注意的地方：

1. 仅修改 customize.json 文件，不要修改其它文件，否则可能会导致页面无法正常显示。
2. 音乐替换时注意重命名为相同名称的音乐文件或注意修改 json 文件中路径，如我这里是`bgMusic.mp3`
3. 图片替换时生日帽子可能会偏，建议修剪图片尺寸和原图片相同，以确保最佳观赏效果。
4. 字体替换时修改 json 中 font 配置即可，可采用本地字体或在线字体（如 Google Fonts），项目中已内置`LXGW WenKai`字体文件，可直接使用。同时 font 仅支持一种字体配置。
  使用示例

  ```json
    "fonts": [
      {
        "name": "Ma Shan Zheng",
        "path": "https://fonts.googleapis.com/css?family=Ma+Shan+Zheng&display=swap"
      },
    //或者使用本地字体，但仅能同时使用一种字体
    // {
    //     "name": "LXGW WenKai",
    //     "path":"./fonts/LXGWWenKai-Regular.ttf"
    //   } 
    ]
  ```

## 本地开发/预览

项目使用 npm 作为包管理器，请确保本地已经配置 node 环境，否则请自行安装，node 环境检验如下：

```
$ node -v
v22.2.1
```

然后安装依赖：

```
npm install
```

运行：

```
npm run start
```

## 其它

整体使用的是纯 HTML、CSS 和 JavaScript，以及 GSAP 来制作动画。

感谢原项目作者的开源，本项目基于[happy-birthday](https://github.com/faahim/happy-birthday) 进行修改。

如果你喜欢这个项目，可以给个 star ⭐ 鼓励一下我，谢谢！

## 更新日志

### v2.0（2025-02-03）

1. 使用 rspack 构建项目
2. 添加 font 配置支持
3. 添加烟花特效
4. 优化音乐播放交互
5. 更多的可配置项

### v1.0

1. 增加了音乐播放效果
2. 添加引导页
3. 中文化
4. 优化了一些细节
