# Releases, hashes and counters

The initial public release pairs official application **1.0.50** with foundation **0.1.0**. They have separate versions because this repository contains only the reviewed public foundation. The Android file is the existing signed production binary; the public web ZIP is built from this repository.

## Stable links

The exact uploaded names `clickngoal.apk`, `clickngoal-web.zip`, `clickngoal-source.zip` and `SHA256SUMS.txt` are retained for future latest links. Older tags keep their packages. [GitHub's stable release-link documentation](https://docs.github.com/en/repositories/releasing-projects-on-github/linking-to-releases).

## Preparing a release

1. Run `npm ci`, `npm run check` and `npm run site`. Review the published source allowlist and browser behaviour.
2. Run `python3 scripts/package.py`; this packages only public source and the demo build. It never reads private application directories.
3. Separately copy a verified official signed APK to `release/clickngoal.apk`. A public-demo build cannot produce the official Android client.
4. Run `python3 scripts/package.py --checksums` after the APK is in place. Verify its expected official version, signing identity and checksum before publishing.
5. Attach the three packages and SHA256SUMS.txt to a new stable GitHub Release, select the reviewed public commit/tag, and describe both app and foundation versions. Never overwrite an older asset just to reset its counter.
6. Follow the latest links and inspect API metadata/hashes. Update project copy if capabilities or installation instructions change.

No credentials or unpublished code belong in release assets. `scripts/package.py` uses an explicit source-path allowlist, excludes `.git`, dependencies, build outputs, local artifacts and hidden secrets, and refuses symlinks.

## Counter semantics

GitHub's release-asset API exposes `download_count` for uploaded files. The page requests every release page and sums only the three package names, excluding checksum downloads and automatically generated Source code archives. Counters count file requests, including repeated downloads, not unique people, working installs or daily active users. [GitHub asset API](https://docs.github.com/en/rest/releases/assets).

Fetching the project page does not increment a package counter. Clicking a package link downloads the actual file from GitHub. A PWA install and a hosted web visit are separate actions and are not included in these counters. Data is read from the public API without tokens; the page has no visitor-tracking script. API errors, incomplete pagination or rate limits show unavailable, not a misleading partial total.

The first release's counts begin when that release is published; past downloads from the website cannot be reconstructed as GitHub downloads. Future release history accumulates instead of resetting an all-release total.
