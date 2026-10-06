/** Calendar keyboard navigation uses date keys, avoiding timezone and DST arithmetic. */
export function calendarFocusTarget(date: string, key: string, shift: boolean, today: string): string | null {
  const current = new Date(`${date}T12:00:00Z`);
  if (!Number.isFinite(current.getTime())) return null;
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(key)) {
    const weekday = (current.getUTCDay() + 6) % 7;
    const deltas: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, Home: -weekday, End: 6 - weekday };
    const delta = deltas[key];
    current.setUTCDate(current.getUTCDate() + delta);
  } else if (key === "PageUp" || key === "PageDown") {
    const day = current.getUTCDate();
    const delta = (key === "PageUp" ? -1 : 1) * (shift ? 12 : 1);
    current.setUTCDate(1);
    current.setUTCMonth(current.getUTCMonth() + delta);
    const last = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() + 1, 0)).getUTCDate();
    current.setUTCDate(Math.min(day, last));
  } else return null;
  const next = current.toISOString().slice(0, 10);
  return next < "1900-01-01" ? "1900-01-01" : next > today ? today : next;
}
