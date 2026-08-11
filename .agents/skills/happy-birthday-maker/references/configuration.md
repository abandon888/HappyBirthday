# Configuration reference

`customize.json` remains the public configuration file. Existing text fields, `imagePath`, `music`, and `fonts` continue to work. Add an optional `theme` field with one of:

- `classic` — existing visual treatment and default.
- `warm` — softer celebration colors.
- `minimal` — reduced decorative density.

The recipient name should be assigned to `name`. Use `wishText` for the main message and `textInChatBox` for the short animated message.

## Asset limits

| Asset | Supported types | Limit |
| --- | --- | --- |
| Image | PNG, JPEG, WebP, GIF | 10 MiB |
| Music | MP3, OGG, WAV, M4A | 25 MiB |
| Font | TTF, OTF, WOFF, WOFF2 | 10 MiB |

Use a local path inside the configuration directory whenever possible. Remote resources must be HTTPS. Do not use `data:`, `file:`, `javascript:`, relative parent paths, or arbitrary shell expressions.
