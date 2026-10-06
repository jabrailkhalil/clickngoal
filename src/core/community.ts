import { completedDateStats } from "./progress-days";

export interface Goal { id: string; ownerId: string; title: string; visibility: "private" | "public"; completedDates: string[] }
export interface Comment { id: string; authorId: string; body: string }
export interface Report { id: string; goalId: string; authorId: string; date: string; body: string; visibility: "private" | "public"; likedBy: string[]; comments: Comment[] }
export interface CommunityState { schemaVersion: 1; goals: Goal[]; reports: Report[] }
export const DEMO_USER = "local-viewer";
const validDate = (date: string, today: string) => completedDateStats([date], today).dates.includes(date);

export function setDayCompletion(state: CommunityState, goalId: string, ownerId: string, date: string, done: boolean, today: string): CommunityState {
  if (!validDate(date, today)) throw new Error("Choose a real date that is not in the future.");
  const goal = state.goals.find(item => item.id === goalId && item.ownerId === ownerId);
  if (!goal) throw new Error("This goal is not yours to edit.");
  const completedDates = completedDateStats(done ? [...goal.completedDates, date] : goal.completedDates.filter(value => value !== date), today).dates;
  return { ...state, goals: state.goals.map(item => item.id === goalId ? { ...item, completedDates } : item) };
}
export function writeReport(state: CommunityState, goalId: string, ownerId: string, date: string, body: string, today: string): CommunityState {
  const goal = state.goals.find(item => item.id === goalId && item.ownerId === ownerId);
  if (!goal || !validDate(date, today)) throw new Error("Choose your own goal and a valid date.");
  const text = body.trim();
  if (!text || text.length > 1200) throw new Error("A progress note must contain 1–1200 characters.");
  const id = `${goalId}:${ownerId}:${date}`;
  const previous = state.reports.find(item => item.id === id);
  if (!previous && state.reports.length >= 500) throw new Error("This demo's local note limit has been reached.");
  const report: Report = { id, goalId, authorId: ownerId, date, body: text, visibility: goal.visibility, likedBy: previous?.likedBy ?? [], comments: previous?.comments ?? [] };
  return { ...state, reports: [...state.reports.filter(item => item.id !== id), report] };
}
export function visibleReports(state: CommunityState, viewerId: string, showOwn = true): Report[] {
  return state.reports.filter(report => (report.visibility === "public" || report.authorId === viewerId) && (showOwn || report.authorId !== viewerId)).sort((a, b) => b.date.localeCompare(a.date));
}
export function toggleLike(state: CommunityState, reportId: string, viewerId: string): CommunityState {
  if (!visibleReports(state, viewerId).some(item => item.id === reportId)) throw new Error("Report is not visible.");
  return { ...state, reports: state.reports.map(item => item.id === reportId ? { ...item, likedBy: item.likedBy.includes(viewerId) ? item.likedBy.filter(id => id !== viewerId) : [...item.likedBy, viewerId] } : item) };
}
export function addComment(state: CommunityState, reportId: string, viewerId: string, body: string, id: string): CommunityState {
  const report = visibleReports(state, viewerId).find(item => item.id === reportId);
  if (!report) throw new Error("Report is not visible.");
  if (!body.trim() || body.trim().length > 400) throw new Error("A comment must contain 1–400 characters.");
  if (report.comments.length >= 200) throw new Error("This demo's local comment limit has been reached.");
  return { ...state, reports: state.reports.map(item => item.id === reportId ? { ...item, comments: [...item.comments, { id, authorId: viewerId, body: body.trim() }] } : item) };
}

/** Local storage validation is not a replacement for server authorization. */
export function readCommunity(value: unknown): CommunityState | null {
  if (!value || typeof value !== "object") return null;
  const state = value as Partial<CommunityState>;
  if (state.schemaVersion !== 1 || !Array.isArray(state.goals) || !Array.isArray(state.reports) || state.goals.length > 100 || state.reports.length > 500) return null;
  const text = (item: unknown, max: number): item is string => typeof item === "string" && item.length > 0 && item.length <= max;
  const visibility = (item: unknown) => item === "private" || item === "public";
  const date = (item: unknown): item is string => typeof item === "string" && validDate(item, "9999-12-31");
  if (!state.goals.every(goal => goal && text(goal.id, 200) && text(goal.ownerId, 200) && text(goal.title, 100) && visibility(goal.visibility) && Array.isArray(goal.completedDates) && goal.completedDates.length <= 5000 && goal.completedDates.every(date))) return null;
  if (new Set(state.goals.map(item => item.id)).size !== state.goals.length) return null;
  if (!state.reports.every(report => report && text(report.id, 450) && text(report.goalId, 200) && state.goals!.some(goal => goal.id === report.goalId && goal.ownerId === report.authorId) && text(report.authorId, 200) && date(report.date) && text(report.body, 1200) && visibility(report.visibility) && Array.isArray(report.likedBy) && report.likedBy.length <= 100 && report.likedBy.every(id => text(id, 200)) && Array.isArray(report.comments) && report.comments.length <= 200 && report.comments.every(comment => comment && text(comment.id, 200) && text(comment.authorId, 200) && text(comment.body, 400)))) return null;
  if (new Set(state.reports.map(item => item.id)).size !== state.reports.length) return null;
  return state as CommunityState;
}
