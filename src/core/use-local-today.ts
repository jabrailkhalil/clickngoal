import { useEffect, useState } from "react";
const localDateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

/** Update at local midnight and on resume, without polling the network. */
export function useLocalToday(): string {
  const [today, setToday] = useState(() => localDateKey(new Date()));
  useEffect(() => {
    let timer: number;
    const refresh = () => {
      window.clearTimeout(timer);
      const now = new Date();
      setToday(localDateKey(now));
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      timer = window.setTimeout(refresh, Math.max(1, midnight.getTime() - now.getTime() + 10));
    };
    const visible = () => { if (document.visibilityState === "visible") refresh(); };
    refresh();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", visible);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", visible);
    };
  }, []);
  return today;
}
