import { expect, it } from "vitest";
// @ts-expect-error Standalone browser module also runs without a bundler.
import { loadDownloads, summarizeDownloads } from "../../docs/assets/counters.mjs";
const asset = (name: string, count: number) => ({name, download_count: count, state: "uploaded"});
it("accumulates only actual packages across releases, including repeat downloads", () => {
  expect(summarizeDownloads([{assets:[asset("clickngoal.apk", 4),asset("SHA256SUMS.txt", 99)]},{assets:[asset("clickngoal.apk", 8),asset("clickngoal-web.zip", 3),asset("clickngoal-source.zip", 2)]}])).toEqual({"clickngoal.apk":12,"clickngoal-web.zip":3,"clickngoal-source.zip":2,total:17});
});
it("follows pagination rather than quietly losing older release counts", async () => {
  let calls = 0;
  const fetcher = async () => {calls++;return new Response(JSON.stringify([{assets:[asset("clickngoal.apk", calls)]}]), {headers: calls === 1 ? {link:'<https://api.github.com/repos/jabrailkhalil/clickngoal/releases?per_page=100&page=2>; rel="next"'} : {}});};
  expect((await loadDownloads(fetcher)).total).toBe(3);
  expect(calls).toBe(2);
});
it("refuses partial totals and invalid counts on API failure", async () => {
  await expect(loadDownloads(async () => new Response("{}", {status:403}))).rejects.toThrow();
  expect(() => summarizeDownloads([{assets:[asset("clickngoal.apk", -2)]}])).toThrow();
});
