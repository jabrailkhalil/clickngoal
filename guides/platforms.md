# Installation and platforms

Use the real application at [goal.clickn.dev](https://goal.clickn.dev/). Sign in with the same account across devices. An installed web app remains connected to the same service; it is not a separate database. Live social updates require internet access.

## iPhone and iPad

Open the site in **Safari**, use Share (or Page Menu → Share), choose **Add to Home Screen**, enable **Open as Web App** if the OS offers that switch, and tap Add. In older versions the wording/layout can differ. On iPhone, if Add to Home Screen is missing, check Edit Actions in the share sheet. Open the resulting icon for the web-app experience.

No IPA file, sideload certificate or App Store package is needed for this path. Installation is done by the person in Safari; the website cannot silently add itself to the home screen. [Apple's iPhone instructions](https://support.apple.com/en-az/guide/iphone/iphea86e5236/26/ios/26).

## Android

Either use a supported browser's **Install app / Add to Home screen** action or download the signed `clickngoal.apk` from [Releases](https://github.com/jabrailkhalil/clickngoal/releases). Android may ask you to permit installations for the browser/file manager you use. Open the downloaded package to install. The release keeps the official signing certificate so compatible previous signed versions can update.

APK downloads and PWA installations are different distributions. Downloading a file does not prove it was installed. Existing older debug-signed applications may not accept a release-signed update.

## Windows, Linux and ChromeOS

The application runs in a modern browser. Supported Chrome/Edge/Chromium installations expose an install icon in the address bar or an **Install app** action in their menu. Firefox can use the browser version; a built-in PWA installation flow is not assumed. Browser and distribution support varies. [Chrome's web-app guide](https://support.google.com/chrome/answer/9658361).

## macOS

Use the browser version, a supported Chrome/Edge installation flow, or Safari's **Add to Dock** on supported macOS versions. There is no separate DMG/PKG promised by this repository. [Apple's Mac web-app guide](https://support.apple.com/en-us/104996).

## Reinstall or download later

The [downloads page](https://jabrailkhalil.github.io/clickngoal/) always has installation instructions and package links. Closing an installation banner only hides that suggestion. If already installed, your browser may replace Install with Open; use its application management tools to remove/reinstall when needed. Never use a download counter as an installation counter.

## Downloadable public web example

`clickngoal-web.zip` is a compiled **local demo of the open foundation**. Extract it, serve the folder with `python3 -m http.server 8080`, and open http://localhost:8080/. It uses relative asset paths and can be hosted under a subdirectory. It does not contain production accounts or a multi-user API. The live social network is accessed through the separate Open web app link.
