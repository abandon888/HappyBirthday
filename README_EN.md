# HappyBirthday

[中文](./README.md) | English

HappyBirthday is a configurable HTML, CSS, and JavaScript birthday microsite. Fork it for a personal page, or use the included Codex Skill to create a new editable site from a short description and optional local assets.

## What v2.1 adds

- Complete static builds with bundled GSAP; no third-party animation CDN.
- `classic`, `warm`, and `minimal` themes.
- Schema-backed configuration validation and safe local asset checks.
- A generator that creates a separate editable project plus deployable `dist/` output.
- A repository-scoped `happy-birthday-maker` Skill for Codex.

## Local development

Requires Node.js 20 or later.

```bash
npm ci
npm run dev
```

Build and verify the deployable site:

```bash
npm run build
npm run check-dist
```

## Customize directly

Edit `customize.json`, then validate it:

```bash
npm run validate -- --config customize.json
```

All existing text, `imagePath`, `music`, and `fonts` fields remain supported. `theme` is optional and defaults to `classic`.

```json
{
  "theme": "warm",
  "name": "Avery",
  "imagePath": "./img/lydia2.png",
  "music": "./music/bgMusic.mp3"
}
```

For local user assets, use PNG/JPEG/WebP/GIF images up to 10 MiB, MP3/OGG/WAV/M4A audio up to 25 MiB, and TTF/OTF/WOFF/WOFF2 fonts up to 10 MiB. Remote resources must use HTTPS. The validator rejects dangerous protocols and paths that escape the configuration directory.

## Create a separate personalized site

Put your configuration and optional local assets in one directory, then run:

```bash
npm run create -- --config ./my-birthday/customize.json --output ./generated/avery-birthday
npm run preview -- --site ./generated/avery-birthday
```

The generator never overwrites an existing directory. It copies local assets into the generated project, builds `dist/`, and does not deploy or read credentials. Deploy `generated/avery-birthday/dist/` manually to GitHub Pages, Netlify, Vercel, or another static host.

## Use the Codex Skill

When running Codex from this repository, invoke:

```text
$happy-birthday-maker Create a warm Chinese birthday page for Avery using ./photo.png and ./song.mp3.
```

The Skill is stored in `.agents/skills/happy-birthday-maker/`, so Codex discovers it inside the repository. It treats local assets and user text as data, writes only to a new directory, and asks before retaining an external HTTPS resource. It does not deploy, upload assets, read secrets, or call the OpenAI API.

For reusable installation outside this repository, install the Skill from this public GitHub repository with your Codex Skill installer. Plugin packaging is intentionally deferred until the workflow has more public feedback.

## Contributing and security

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before sending a reusable upstream change. Keep personal content in your own fork. See [SECURITY.md](./SECURITY.md) for reporting and trust-boundary guidance.

This project is derived from [faahim/happy-birthday](https://github.com/faahim/happy-birthday) and preserves its MIT license and attribution.
