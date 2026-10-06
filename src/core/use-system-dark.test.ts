import { afterEach, describe, expect, it, vi } from "vitest";
import { readSystemDark, resolveThemeDark, subscribeSystemDark } from "./use-system-dark";

afterEach(() => vi.unstubAllGlobals());

describe("live system theme signal", () => {
  it("uses a safe light fallback before a browser exists", () => {
    expect(readSystemDark()).toBe(false);
    expect(subscribeSystemDark(() => undefined)).not.toThrow();
  });

  it("reads the current preference, then subscribes and cleans up the same listener", () => {
    const query = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() };
    const matchMedia = vi.fn(() => query);
    vi.stubGlobal("window", { matchMedia });
    expect(readSystemDark()).toBe(false);
    const changed = vi.fn();
    const unsubscribe = subscribeSystemDark(changed);
    expect(query.addEventListener).toHaveBeenCalledWith("change", changed);
    query.matches = true;
    query.addEventListener.mock.calls[0][1]();
    expect(changed).toHaveBeenCalledOnce();
    expect(readSystemDark()).toBe(true);
    expect(matchMedia).toHaveBeenCalledWith("(prefers-color-scheme: dark)");
    unsubscribe();
    expect(query.removeEventListener).toHaveBeenCalledWith("change", changed);
  });

  it("supports the legacy WebView media-query API", () => {
    const query = { matches: true, addListener: vi.fn(), removeListener: vi.fn() };
    vi.stubGlobal("window", { matchMedia: () => query });
    const changed = vi.fn();
    const unsubscribe = subscribeSystemDark(changed);
    expect(readSystemDark()).toBe(true);
    expect(query.addListener).toHaveBeenCalledWith(changed);
    unsubscribe();
    expect(query.removeListener).toHaveBeenCalledWith(changed);
  });

  it("keeps explicit light and dark choices independent of the device", () => {
    expect(resolveThemeDark("light", false)).toBe(false);
    expect(resolveThemeDark("light", true)).toBe(false);
    expect(resolveThemeDark("dark", false)).toBe(true);
    expect(resolveThemeDark("dark", true)).toBe(true);
    expect(resolveThemeDark("system", false)).toBe(false);
    expect(resolveThemeDark("system", true)).toBe(true);
  });
});
