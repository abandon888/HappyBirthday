# Contributing

Thanks for improving HappyBirthday.

## Before opening a pull request

Run the checks locally:

```bash
npm ci
npm test
npm run build
npm run check-dist
```

Keep personalization (names, photos, private messages, music, and deployment settings) in your fork. Upstream pull requests should improve reusable behavior, documentation, tests, security, or accessibility.

## Contribution guidelines

- Preserve compatibility with existing `customize.json` fields.
- Do not add credentials, trackers, or automatic deployment behavior.
- Do not add remote scripts. New remote resources must be HTTPS and documented.
- Include tests for configuration, generator, or build changes.
- Explain user-visible behavior and security implications in the pull request.
