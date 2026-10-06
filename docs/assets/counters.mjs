export const PACKAGE_NAMES = ["clickngoal.apk", "clickngoal-web.zip", "clickngoal-source.zip"];
export function summarizeDownloads(releases) {
  const counts = Object.fromEntries(PACKAGE_NAMES.map(name => [name, 0]));
  for (const release of releases) {
    if (release.draft) continue;
    for (const asset of release.assets ?? []) {
      if (!PACKAGE_NAMES.includes(asset.name) || asset.state !== "uploaded") continue;
      if (!Number.isSafeInteger(asset.download_count) || asset.download_count < 0) throw new Error("Invalid public count");
      counts[asset.name] += asset.download_count;
    }
  }
  return { ...counts, total: Object.values(counts).reduce((a, b) => a + b, 0) };
}
export async function loadDownloads(fetcher = fetch) {
  const base = "https://api.github.com/repos/jabrailkhalil/clickngoal/releases";
  let next = base + "?per_page=100&page=1";
  const releases = [], visited = new Set();
  while (next) {
    const url = new URL(next);
    if (url.origin !== "https://api.github.com" || url.pathname !== "/repos/jabrailkhalil/clickngoal/releases" || visited.has(next) || visited.size >= 100) throw new Error("Incomplete release pagination");
    visited.add(next);
    const response = await fetcher(next, { headers: { Accept: "application/vnd.github+json" }, signal: AbortSignal.timeout(10_000) });
    if (!response.ok) throw new Error("Public download counts unavailable");
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Invalid release response");
    releases.push(...data);
    const link = response.headers.get("link") ?? "";
    next = link.split(",").find(part => /rel="next"/.test(part))?.match(/<([^>]+)>/)?.[1] ?? "";
  }
  return summarizeDownloads(releases);
}
if (typeof document !== "undefined") {
  loadDownloads().then(counts => {
    for (const node of document.querySelectorAll("[data-download-count]")) {
      const key = node.dataset.downloadCount;
      if (key in counts) node.textContent = new Intl.NumberFormat(document.documentElement.lang).format(counts[key]);
    }
    document.querySelector("#counts-status").textContent = document.documentElement.lang === "ru" ? "По данным GitHub · все релизы" : "From GitHub · all releases";
  }).catch(() => { document.querySelector("#counts-status").textContent = document.documentElement.lang === "ru" ? "Счётчики временно недоступны. Ссылки на загрузку работают." : "Counters are temporarily unavailable. Download links still work."; });
}
