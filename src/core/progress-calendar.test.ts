import { expect, it } from "vitest";
import { calendarFocusTarget } from "./progress-calendar";
it("clamps month moves without losing the day around leap years", () => {
  expect(calendarFocusTarget("2024-01-31", "PageDown", false, "2026-10-07")).toBe("2024-02-29");
  expect(calendarFocusTarget("2024-02-29", "PageDown", true, "2026-10-07")).toBe("2025-02-28");
});
it("moves by date keys across DST and stops at today", () => {
  expect(calendarFocusTarget("2026-03-29", "ArrowRight", false, "2026-10-07")).toBe("2026-03-30");
  expect(calendarFocusTarget("2026-10-07", "ArrowRight", false, "2026-10-07")).toBe("2026-10-07");
  expect(calendarFocusTarget("2026-10-07", "Escape", false, "2026-10-07")).toBeNull();
});
