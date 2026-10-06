const DAY_MS = 86_400_000;

export function localProgressDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function completedDateStats(values: readonly string[], today = localProgressDate()) {
  const dates = [...new Set(values.map((value) => value.slice(0, 10))
    .filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value)
      && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))
      && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value
      && value <= today))].sort();
  let longest = 0;
  let running = 0;
  let previous = 0;
  for (const date of dates) {
    const timestamp = Date.parse(`${date}T00:00:00Z`);
    running = timestamp - previous === DAY_MS ? running + 1 : 1;
    longest = Math.max(longest, running);
    previous = timestamp;
  }
  return {
    dates,
    completedDays: dates.length,
    currentStreak: dates.length > 0 && (Date.parse(`${today}T00:00:00Z`) - previous) / DAY_MS <= 1 ? running : 0,
    longestStreak: longest,
  };
}
