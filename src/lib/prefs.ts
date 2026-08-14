/** Local, non-sensitive UI preferences (never auth data). */
export type Prefs = {
  theme: "dark" | "light" | "system";
  motion: "full" | "reduced";
  effects3d: "on" | "reduced" | "off";
  notifications: boolean;
  sound: boolean;
  demoMode: boolean;
  lastDashboard: string;
};

export const DEFAULT_PREFS: Prefs = {
  theme: "dark",
  motion: "full",
  effects3d: "on",
  notifications: true,
  sound: false,
  demoMode: false,
  lastDashboard: "/dashboard",
};

const KEY = "nexus.prefs.v1";

export function readPrefs(): Prefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<Prefs>) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

export function writePrefs(p: Prefs) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable */
  }
}

export function applyPrefs(p: Prefs) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const systemDark =
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = p.theme === "dark" || (p.theme === "system" && systemDark);
  root.classList.toggle("dark", dark);
  root.classList.toggle("light", !dark);
  root.classList.toggle("reduce-motion", p.motion === "reduced");
}
