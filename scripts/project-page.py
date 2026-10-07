"""Generate static EN/RU project pages. No production or user data is read."""
import html, json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
ORIGIN = 'https://jabrailkhalil.github.io/clickngoal/'
REPO = 'https://github.com/jabrailkhalil/clickngoal'
LIVE = 'https://goal.clickn.dev/'
copy = {
 'en': {
  'title':'clickngoal — social goal tracker, web app and open-source core',
  'description':'Track goals and habits, share daily progress and find your community. Install clickngoal on iPhone, Android, Windows, macOS, Linux and ChromeOS. Public MIT core and downloads.',
  'eyebrow':'GOALS · PROGRESS · PEOPLE', 'headline':'A small step.<br>A shared journey.',
  'intro':'A social network for your goals. Make daily progress, find people with shared interests, and support each other.',
  'open':'Open web app','install':'Install on your device','source':'Public source',
  'features':[('Your next step','Personal or shared goals, daily marks and notes.'),('Progress you can see','A calendar, completed days and streaks that mean something.'),('People around you','Profiles, communities, comments and support.')],
  'platforms':'One account. Your devices.', 'platformIntro':'The real application runs in a modern browser. Installation adds convenient access to the same service.',
  'steps':[
   ('iPhone · iPad','Safari → Share → Add to Home Screen → Open as Web App (if offered) → Add.','Web app installed from the website; no App Store package.'),
   ('Android','Use Chrome’s Install app action, or download the official signed APK below.','The browser/PWA and APK connect to the same hosted account.'),
   ('Windows · Linux · ChromeOS','Open in a modern browser. Supported Chrome/Edge/Chromium browsers offer Install app.','Firefox can use the browser version; installation availability varies.'),
   ('macOS','Use the browser, supported Chrome/Edge installation, or Safari → Add to Dock on supported macOS.','There is no separate DMG/PKG distribution promised.')],
  'later':'Install whenever you want. These instructions stay here even after you dismiss a suggestion in the app.',
  'downloads':'Downloads, always within reach.', 'downloadIntro':'The live social network and the downloadable local demo serve different purposes. Choose the one you need.',
  'files':[('Official Android app','Latest signed clickngoal APK for your real account.','clickngoal.apk','Download APK'),('Public web demo','Compiled local demo of the open foundation; fictional community, browser storage.','clickngoal-web.zip','Download web ZIP'),('Open foundation source','MIT source, tests and guides. The complete production service is outside this repository.','clickngoal-source.zip','Download source ZIP')],
  'countLabel':'file downloads', 'total':'Package downloads in total','loading':'Loading public GitHub counts…',
  'countNote':'Counts come from GitHub release assets, include repeated downloads and cover all releases. They are file downloads, not people or PWA installations. No visitor-tracking script is used.',
  'release':'All releases','hashes':'Verify SHA-256 hashes','fallback':'Website APK mirror',
  'core':'An open foundation. Room to build.',
  'coreIntro':'Real progress, calendar and theme modules from clickngoal are published under MIT, alongside a small runnable community demo. You can study, reuse and improve them.',
  'boundary':'The complete hosted application source, its authentication backend, user database and infrastructure are not included. The official APK follows the application terms; MIT covers this public foundation.',
  'demo':'Try the local demo','contribute':'Contribute on GitHub','run':'Run the public source locally',
  'docs':'Product and developer documentation','docLinks':[('Product features','features.md'),('Installation details','platforms.md'),('Architecture','architecture.md'),('Roadmap','roadmap.md'),('Releases and counters','releases.md')],
  'footer':'Created by Jabrail Khalilov · Part of clickn.dev','privacy':'App privacy','terms':'App terms'
 },
 'ru': {
  'title':'clickngoal — социальная сеть для целей, веб-приложение и открытая основа',
  'description':'Цели, привычки, ежедневный прогресс и сообщества. Установите clickngoal на iPhone, Android, Windows, macOS, Linux и ChromeOS. Открытая основа MIT и постоянные загрузки.',
  'eyebrow':'ЦЕЛИ · ПРОГРЕСС · ЛЮДИ','headline':'Небольшой шаг.<br>Общий путь.',
  'intro':'Социальная сеть для ваших целей. Отмечайте прогресс, находите единомышленников и поддерживайте друг друга.',
  'open':'Открыть веб-приложение','install':'Установить на устройство','source':'Открытый код',
  'features':[('Ваш следующий шаг','Личные и совместные цели, отметки дней и заметки.'),('Видимый прогресс','Календарь, выполненные дни и понятные серии.'),('Люди рядом','Профили, сообщества, комментарии и поддержка.')],
  'platforms':'Один аккаунт. Ваши устройства.','platformIntro':'Рабочая соцсеть открывается в современном браузере. Установка добавляет удобный доступ к тому же сервису.',
  'steps':[
   ('iPhone · iPad','Safari → «Поделиться» → «На экран Домой» → «Открывать как веб-приложение», если есть → «Добавить».','Веб-приложение с сайта; отдельного пакета App Store нет.'),
   ('Android','Используйте «Установить приложение» в Chrome либо скачайте официальный подписанный APK ниже.','Браузер, PWA и APK используют ваш аккаунт рабочей платформы.'),
   ('Windows · Linux · ChromeOS','Откройте в современном браузере. Поддерживаемый Chrome/Edge/Chromium предлагает установку.','Firefox работает как браузерная версия; установка зависит от браузера.'),
   ('macOS','Браузер, установка через подходящий Chrome/Edge либо Safari → «Добавить в Dock» на поддерживаемой macOS.','Отдельная сборка DMG/PKG здесь не предлагается.')],
  'later':'Установить можно позже. Инструкции остаются здесь, даже если вы закрыли предложение установки в приложении.',
  'downloads':'Загрузки всегда под рукой.','downloadIntro':'Рабочая соцсеть и скачиваемый локальный пример решают разные задачи. Выберите нужный вариант.',
  'files':[('Приложение Android','Последняя подписанная сборка APK clickngoal для вашего настоящего аккаунта.','clickngoal.apk','Скачать APK'),('Открытое веб-демо','Собранный локальный пример: вымышленное сообщество и хранение в браузере.','clickngoal-web.zip','Скачать веб-ZIP'),('Код открытой основы','Исходники MIT, тесты и документация. Полный рабочий сервис остаётся вне репозитория.','clickngoal-source.zip','Скачать исходники')],
  'countLabel':'скачиваний файла','total':'Всего скачиваний пакетов','loading':'Загружаем счётчики GitHub…',
  'countNote':'Данные из GitHub Releases, включая повторные скачивания и все релизы. Это загрузки файлов, а не число людей или установок PWA. Скрипта слежения за посетителями нет.',
  'release':'Все релизы','hashes':'Проверить SHA-256','fallback':'Зеркало APK на сайте',
  'core':'Открытая основа. Можно развивать.',
  'coreIntro':'Настоящие модули прогресса, календаря и темы из clickngoal открыты под MIT. Рядом — небольшой запускаемый пример сообщества. Изучайте, используйте и улучшайте.',
  'boundary':'Полный код рабочей соцсети, сервер входа, база пользователей и инфраструктура не опубликованы. Официальный APK использует условия приложения; MIT относится к этой открытой основе.',
  'demo':'Попробовать локальное демо','contribute':'Участвовать на GitHub','run':'Запустить открытый код локально',
  'docs':'О продукте и разработке','docLinks':[('Возможности','features.md'),('Установка на устройства','platforms.md'),('Архитектура','architecture.md'),('План развития','roadmap.md'),('Релизы и счётчики','releases.md')],
  'footer':'Автор — Джабраил Халилов · Проект clickn.dev','privacy':'Конфиденциальность','terms':'Условия приложения'
 }
}
def esc(value):return html.escape(value,quote=True)
for lang,t in copy.items():
    folder=ROOT/'docs'/('ru' if lang=='ru' else '')
    folder.mkdir(parents=True,exist_ok=True)
    prefix='../' if lang=='ru' else './'
    canonical=ORIGIN+('ru/' if lang=='ru' else '')
    features=''.join('<article><span class="feature-number">0'+str(i+1)+'</span><h3>'+esc(title)+'</h3><p>'+esc(body)+'</p></article>' for i,(title,body) in enumerate(t['features']))
    steps=''.join('<article class="platform"><h3>'+esc(title)+'</h3><div><p>'+esc(body)+'</p><small>'+esc(note)+'</small></div></article>' for title,body,note in t['steps'])
    files=''.join('<article class="package"><h3>'+esc(title)+'</h3><p>'+esc(body)+'</p><a class="button secondary" href="'+REPO+'/releases/latest/download/'+name+'">'+esc(action)+' ↓</a><p class="file-count"><strong data-download-count="'+name+'">—</strong> '+t['countLabel']+'</p></article>' for title,body,name,action in t['files'])
    links=''.join('<a href="'+REPO+'/blob/main/guides/'+path+'">'+esc(label)+' ↗</a>' for label,path in t['docLinks'])
    schema={ '@context':'https://schema.org','@graph':[
      {'@type':'WebPage','@id':canonical+'#page','url':canonical,'name':t['title'],'description':t['description'],'inLanguage':lang},
      {'@type':'WebApplication','name':'clickngoal','url':LIVE,'applicationCategory':'SocialNetworkingApplication','operatingSystem':'iOS, iPadOS, Android, Windows, macOS, Linux, ChromeOS, Web browser','installUrl':LIVE,'sameAs':REPO},
      {'@type':'SoftwareSourceCode','name':'clickngoal community foundation','codeRepository':REPO,'programmingLanguage':['TypeScript','JavaScript'],'license':REPO+'/blob/main/LICENSE','version':'0.1.0','description':'Reviewed open modules and a local demo; not the full production service.'}
    ]}
    page='''<!doctype html><html lang="LANG"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TITLE</title><meta name="description" content="DESCRIPTION"><link rel="canonical" href="CANONICAL"><link rel="alternate" hreflang="en" href="ORIGIN"><link rel="alternate" hreflang="ru" href="ORIGINru/"><link rel="alternate" hreflang="x-default" href="ORIGIN"><meta property="og:type" content="website"><meta property="og:site_name" content="clickngoal"><meta property="og:title" content="TITLE"><meta property="og:description" content="DESCRIPTION"><meta property="og:url" content="CANONICAL"><meta property="og:image" content="ORIGINassets/cover.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="TITLE"><meta name="twitter:description" content="DESCRIPTION"><meta name="twitter:image" content="ORIGINassets/cover.png"><link rel="icon" href="PREFIXassets/icon.png"><link rel="apple-touch-icon" href="PREFIXassets/icon.png"><link rel="stylesheet" href="PREFIXassets/project.css"><script type="application/ld+json">SCHEMA</script><script type="module" src="PREFIXassets/counters.mjs"></script></head><body>
<a class="skip" href="#main">Skip to content</a><div class="wrap"><header class="site-header"><a class="brand" href="CANONICAL"><img src="PREFIXassets/icon.png" width="34" height="34" alt="">clickngoal</a><nav aria-label="Navigation"><a href="#install">INSTALL</a><a href="#downloads">DOWNLOADS_SHORT</a><a href="REPO">GitHub ↗</a><a href="LANGURL" lang="OTHERLANG">LANGNAME</a></nav></header>
<main id="main"><section class="hero"><div><p class="eyebrow">EYEBROW</p><h1>HEADLINE</h1><p class="intro">INTRO</p><div class="actions"><a class="button primary" href="LIVE">OPEN ↗</a><a class="text-link" href="#install">INSTALL →</a></div><p class="platform-line">iPhone · iPad · Android · Windows · macOS · Linux · ChromeOS</p></div><div class="hero-visual" aria-hidden="true"><div class="visual-brand">clickngoal</div><div class="visual-rule"></div><span class="visual-label">NEXT STEP</span><div class="visual-title">A little,<br>every day.</div><div class="visual-days"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="visual-caption">GOALS / PROGRESS / PEOPLE</div></div></section>
<section class="features" aria-label="Features">FEATURES</section>
<section id="install" class="section"><p class="eyebrow">WEB / PWA / ANDROID</p><h2>PLATFORMS</h2><p class="section-intro">PLATFORMINTRO</p><div class="platforms">STEPS</div><p class="note">LATER</p><a href="LIVE" class="button primary">OPEN ↗</a></section>
<section id="downloads" class="section"><p class="eyebrow">GITHUB RELEASES</p><h2>DOWNLOADS</h2><p class="section-intro">DOWNLOADINTRO</p><div class="packages">FILES</div><div class="count-total"><strong data-download-count="total">—</strong><span>TOTAL</span><small id="counts-status" role="status">LOADING</small></div><p class="note">COUNTNOTE</p><div class="download-links"><a href="REPO/releases">RELEASE ↗</a><a href="REPO/releases/latest/download/SHA256SUMS.txt">HASHES</a><a href="LIVEapi/goallog.apk">FALLBACK</a></div></section>
<section id="source" class="section source"><div><p class="eyebrow">MIT / COMMUNITY FOUNDATION</p><h2>CORE</h2><p>COREINTRO</p><p class="note">BOUNDARY</p><div class="actions"><a class="button secondary" href="PREFIXdemo/">DEMO →</a><a href="REPO">CONTRIBUTE ↗</a></div></div><div class="code-card"><h3>RUN</h3><pre><code>git clone https://github.com/jabrailkhalil/clickngoal.git
cd clickngoal
npm ci
npm run dev
npm run check</code></pre></div></section>
<section class="section documentation"><h2>DOCS</h2><div>LINKS</div></section></main><footer><p>FOOTER</p><a href="https://clickn.dev/">clickn.dev</a> · <a href="REPO">GitHub</a> · <a href="LIVEprivacy.html">PRIVACY</a> · <a href="LIVEterms.html">TERMS</a></footer></div></body></html>'''
    values={'LANG':lang,'TITLE':esc(t['title']),'DESCRIPTION':esc(t['description']),'CANONICAL':canonical,'ORIGIN':ORIGIN,'PREFIX':prefix,'SCHEMA':json.dumps(schema,ensure_ascii=False).replace('<','\\u003c'),'REPO':REPO,'LIVE':LIVE,
      'LANGURL':ORIGIN if lang=='ru' else ORIGIN+'ru/','OTHERLANG':'en' if lang=='ru' else 'ru','LANGNAME':'English' if lang=='ru' else 'Русский',
      'FEATURES':features,'STEPS':steps,'FILES':files,'LINKS':links,'DOWNLOADS_SHORT':'Загрузки' if lang=='ru' else 'Downloads',
      **{key.upper().replace('PLATFORMINTRO','PLATFORMINTRO'):esc(value) for key,value in t.items() if isinstance(value,str)}}
    values['HEADLINE']=t['headline'];values['PLATFORMINTRO']=esc(t['platformIntro']);values['DOWNLOADINTRO']=esc(t['downloadIntro']);values['COUNTNOTE']=esc(t['countNote']);values['COREINTRO']=esc(t['coreIntro'])
    # One pass avoids replacement inside content or URLs.
    import re
    tokens='|'.join(re.escape(key) for key in sorted(values,key=len,reverse=True))
    page=re.sub(r'(?<![A-Z_])(?:'+tokens+r')(?![A-Z_])',lambda m:values[m[0]],page)
    (folder/'index.html').write_text(page+'\n',encoding='utf8')
(ROOT/'docs/.nojekyll').write_text('',encoding='utf8')
(ROOT/'docs/robots.txt').write_text('User-agent: *\nAllow: /clickngoal/\nDisallow: /clickngoal/demo/\nSitemap: '+ORIGIN+'sitemap.xml\n',encoding='utf8')
(ROOT/'docs/sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'+''.join('<url><loc>'+ORIGIN+path+'</loc><xhtml:link rel="alternate" hreflang="en" href="'+ORIGIN+'"/><xhtml:link rel="alternate" hreflang="ru" href="'+ORIGIN+'ru/"/></url>' for path in ['','ru/'])+'</urlset>\n',encoding='utf8')
print('Generated static English/Russian project pages and sitemap.')
