import { useSyncExternalStore } from "react";

const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

/** The OS signal stays live even while the user is previewing a theme. */
export function readSystemDark(): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(DARK_SCHEME_QUERY).matches
    : false;
}

export function subscribeSystemDark(onChange: () => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => undefined;
  }
  const query = window.matchMedia(DARK_SCHEME_QUERY);
  if (typeof query.addEventListener === "function") {
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }
  // Older embedded WebViews expose the original MediaQueryList API.
  query.addListener(onChange);
  return () => query.removeListener(onChange);
}

export function useSystemDark(): boolean {
  return useSyncExternalStore(subscribeSystemDark, readSystemDark, () => false);
}

export function resolveThemeDark(mode: "light" | "dark" | "system", systemDark: boolean): boolean {
  return mode === "dark" || (mode === "system" && systemDark);
}
