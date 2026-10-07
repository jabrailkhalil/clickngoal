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

## Android updates from GitHub

The official **1.0.52+ Android APK** includes an updater. Install 1.0.52 once from the release download if your current APK predates it. Keep the app installed: the same permanent signing identity updates it in place, preserving local settings and the account.

1. On opening the app, it checks the public latest stable GitHub Release at most once daily. No account token is sent to GitHub. Failed automatic checks back off for 15 minutes. A manual check is available under **Settings → Account & access → App & open source**.
2. A new version offers **Download update**, with **Later** available. Checking metadata does not download an APK. Downloading the real asset contributes to GitHub's APK file-request counter.
3. Before installation, the client verifies the GitHub SHA-256 digest, declared size, package ID, release version, increasing Android version code, and the permanent signing certificate. Only HTTPS downloads from specified GitHub release hosts are accepted.
4. Tap **Install update** after download. Android may first ask to allow clickngoal to install unknown apps, then displays its installation confirmation. No silent installation or background APK download occurs.
5. If you cancel the installer, the verified cached APK can be used without downloading again. Installing a later version clears obsolete updater files. Android controls permission and installation.

Downloads are file requests, not proof of installation or unique users. Web/PWA updates continue through the browser and do not need an APK.

## Web app installations

The separate **Web app installs** badge uses the hosted application's public aggregate at `https://goal.clickn.dev/api/public/pwa-installs.json`, rendered by [Shields endpoint badges](https://shields.io/badges/endpoint-badge). It appears on GitHub and the project page alongside release-file counters, with its own meaning.

- A successful `appinstalled` browser event or the first actual standalone PWA launch records an observation. iPhone/iPad are observed on first home-screen launch, since `appinstalled` is not supported everywhere.
- The existing anonymous browser installation ID deduplicates observations on the server. Opening again, updating, signing in or changing accounts does not add an installation for that same ID.
- Prompt acceptance alone, normal browser visits and native Android shell launches are excluded. No background GitHub asset downloads are generated.
- The badge contains only the total, with a five-minute server cache. No IDs, account fields, private content or per-person statistics are exposed. If statistics are unavailable, the badge says so.
- This is an observed installation estimate, not an OS store counter or unique-person count. Clearing browser storage creates a new ID, and separate browser/PWA storage can represent separate installations. An iOS install never launched cannot be seen. Some historical installations have no observation and cannot be reconstructed reliably.
- GitHub's built-in release `download_count` continues to count uploaded files; it cannot be set to the PWA total. These two metrics are displayed separately.
