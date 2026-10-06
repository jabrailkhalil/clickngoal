import { describe, expect, it } from "vitest";
import { addComment, readCommunity, setDayCompletion, toggleLike, visibleReports, writeReport, type CommunityState } from "./community";
const makeState = (): CommunityState => ({ schemaVersion: 1, goals: [{ id: "goal", ownerId: "me", title: "Read", visibility: "private", completedDates: [] }], reports: [] });
describe("community foundation boundaries", () => {
  it("does not mutate the previous state or double-count a saved day", () => {
    const initial = makeState();
    const once = setDayCompletion(initial, "goal", "me", "2026-10-06", true, "2026-10-07");
    const twice = setDayCompletion(once, "goal", "me", "2026-10-06", true, "2026-10-07");
    expect(initial.goals[0].completedDates).toEqual([]);
    expect(twice.goals[0].completedDates).toEqual(["2026-10-06"]);
    expect(setDayCompletion(twice, "goal", "me", "2026-10-06", false, "2026-10-07").goals[0].completedDates).toEqual([]);
  });
  it("keeps notes separate from completion and edits the same daily note", () => {
    const first = writeReport(makeState(), "goal", "me", "2026-10-07", "First", "2026-10-07");
    const updated = writeReport(first, "goal", "me", "2026-10-07", "Updated", "2026-10-07");
    expect(updated.reports).toHaveLength(1);
    expect(updated.reports[0].body).toBe("Updated");
    expect(updated.goals[0].completedDates).toEqual([]);
  });
  it("rejects another owner's edits and impossible or future dates", () => {
    expect(() => setDayCompletion(makeState(), "goal", "other", "2026-10-07", true, "2026-10-07")).toThrow();
    for (const date of ["2026-02-30", "2026-10-08", "bad"]) expect(() => writeReport(makeState(), "goal", "me", date, "Note", "2026-10-07")).toThrow();
  });
  it("respects private reports and the hide-own preference", () => {
    const state = writeReport(makeState(), "goal", "me", "2026-10-07", "Private", "2026-10-07");
    expect(visibleReports(state, "other")).toEqual([]);
    expect(visibleReports(state, "me", false)).toEqual([]);
    expect(() => toggleLike(state, state.reports[0].id, "other")).toThrow();
    expect(() => addComment(state, state.reports[0].id, "other", "Comment", "c1")).toThrow();
  });
  it("toggles one reaction and preserves comments when a note is edited", () => {
    let state = writeReport(makeState(), "goal", "me", "2026-10-07", "Note", "2026-10-07");
    const id = state.reports[0].id;
    state = toggleLike(state, id, "me");
    expect(state.reports[0].likedBy).toEqual(["me"]);
    state = toggleLike(state, id, "me");
    state = addComment(state, id, "me", " Good step ", "c1");
    state = writeReport(state, "goal", "me", "2026-10-07", "Revised", "2026-10-07");
    expect(state.reports[0].likedBy).toEqual([]);
    expect(state.reports[0].comments[0].body).toBe("Good step");
  });
  it("rejects stale, corrupt, duplicate and orphaned local data", () => {
    expect(readCommunity(null)).toBeNull();
    expect(readCommunity({ schemaVersion: 2 })).toBeNull();
    expect(readCommunity({ ...makeState(), reports: [null] })).toBeNull();
    expect(readCommunity({ ...makeState(), goals: [makeState().goals[0], makeState().goals[0]] })).toBeNull();
    expect(readCommunity(makeState())).toEqual(makeState());
  });
});
