# Happy Birthday

<p>
<img src="https://img.shields.io/github/release/abandon888/HappyBirthday" alt="release" />
<img src="https://img.shields.io/github/stars/abandon888/HappyBirthday" alt="stars" />
<img src="https://img.shields.io/github/issues/abandon888/HappyBirthday" alt="issues" />
<img src="https://img.shields.io/github/forks/abandon888/HappyBirthday" alt="forks" />
<img src="https://img.shields.io/github/license/abandon888/HappyBirthday" alt="license" />
<a href="https://app.netlify.com/sites/friendly-paprenjak-ad64b7/deploys"><img src="https://api.netlify.com/api/v1/badges/39d29171-f3b1-4172-932e-1f657058303a/deploy-status" alt="Netlify Status" /></a>
</p>

[中文](./README.md) | English
A special way to wish someone happy birthday.
Preview: <https://friendly-paprenjak-ad64b7.netlify.app/>

## Project Highlights

1. Carefully designed text animations and romantic floating balloon animations
2. Customize all text content, images, background music and font styles by simply modifying the `customize.json` file
3. Click anywhere on the page to display gorgeous firework effects
4. Auto-play beautiful background music to create a warm and romantic atmosphere
5. Built with modern rspack for better performance

## Project Background

Used to wish happy birthday to someone special or your lover, creating a romantic atmosphere. For the story behind the project, you can read my Zhihu blog post: [Thoughts on Website Background Music from Birthday Celebrations](https://zhuanlan.zhihu.com/p/677636150)

## Usage

Fork this project, modify the customize.json file by replacing its contents with your own, then deploy it on github pages or other hosting sites (like netlify).
> You don't need to create PR to this repository

You can modify text, images, background music, fonts, etc., but there are some things to note:

1. Only modify the customize.json file, do not modify other files, otherwise the page may not display properly.
2. When replacing music, make sure to rename to the same music filename or modify the path in the json file, like `bgMusic.mp3` here
3. When replacing images, the birthday hat might be offset. It's recommended to crop images to the same size as the original for best viewing effect.
4. For font replacement, just modify the font configuration in json. You can use local fonts or online fonts (like Google Fonts). The project has built-in `LXGW WenKai` font file ready to use. Note that font only supports one font configuration.
  Usage example:

  ```json
    "fonts": [
      {
        "name": "Ma Shan Zheng",
        "path": "https://fonts.googleapis.com/css?family=Ma+Shan+Zheng&display=swap"
      },
    //or use local font, but can only use one font at a time
    // {
    //     "name": "LXGW WenKai",
    //     "path":"./fonts/LXGWWenKai-Regular.ttf"
    //   } 
    ]
  ```

## Local Development/Preview

The project uses npm as package manager. Make sure you have node environment configured locally, otherwise please install it yourself. Verify node environment as follows:

```
$ node -v
v22.2.1
```

Then install dependencies:

```
npm install
```

Run:

```
npm run start
```

## Others

The overall implementation uses pure HTML, CSS and JavaScript, along with GSAP for animations.

Thanks to the original project author for open sourcing. This project is modified based on [happy-birthday](https://github.com/faahim/happy-birthday).

If you like this project, you can give it a star ⭐ to encourage me, thank you!

## Changelog

### v2.0 (2025-02-03)

1. Use rspack to build project
2. Add font configuration support
3. Add firework effects
4. Optimize music playback interaction
5. More configurable options

### v1.0

1. Added music playback effect
2. Added guide page
3. Chinese localization
4. Optimized some details
