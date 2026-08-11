# Security policy

## Supported version

Security fixes are made on the latest `main` branch and the latest release.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability. Contact the maintainer through GitHub's private vulnerability-reporting flow when it is enabled, or open a minimal issue requesting a private contact channel without publishing exploit details.

Please include the affected revision, reproduction steps, impact, and whether the issue needs network access, local files, a build command, or a third-party resource.

## Trust boundaries

HappyBirthday accepts user-owned text and optional image, music, font, and HTTPS resource URLs. The generator writes only to a newly created output directory, never deploys automatically, and does not read credentials. Review third-party pull requests that change scripts, dependencies, external URLs, or generated output with extra care.
