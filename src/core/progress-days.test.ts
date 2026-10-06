import { describe, expect, it } from "vitest";
import { completedDateStats } from "./progress-days";

describe("calendar and goal card completion dates", () => {
  it("counts each saved date once, retaining older dates beyond a feed window", () => {
    const dates = Array.from({ length: 120 }, (_, index) => new Date(Date.UTC(2026, 0, index + 1)).toISOString().slice(0, 10));
    const stats = completedDateStats([...dates, ...dates.slice(-30)], "2026-04-30");
    expect(stats.completedDays).toBe(120);
    expect(stats.currentStreak).toBe(120);
    expect(stats.longestStreak).toBe(120);
  });
  it("uses calendar dates across daylight-saving boundaries", () => {
    expect(completedDateStats(["2026-03-28", "2026-03-29", "2026-03-30"], "2026-03-30").currentStreak).toBe(3);
    expect(completedDateStats(["2026-10-24", "2026-10-25", "2026-10-26"], "2026-10-26").currentStreak).toBe(3);
  });
  it("keeps best streak while the current streak ends after a missed day", () => {
    expect(completedDateStats(["2026-10-01", "2026-10-02", "2026-10-03"], "2026-10-05")).toMatchObject({ currentStreak: 0, longestStreak: 3 });
    expect(completedDateStats(["2026-10-06", "2026-10-07", "2026-02-30"], "2026-10-06")).toMatchObject({ completedDays: 1 });
  });
});
