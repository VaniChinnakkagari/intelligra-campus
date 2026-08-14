import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_PREFS, applyPrefs, readPrefs, writePrefs, type Prefs } from "@/lib/prefs";

type Ctx = {
  prefs: Prefs;
  setPref: <K extends keyof Prefs>(key: K, value: Prefs[K]) => void;
  hydrated: boolean;
};

const PrefsContext = createContext<Ctx>({ prefs: DEFAULT_PREFS, setPref: () => {}, hydrated: false });

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readPrefs();
    setPrefs(stored);
    applyPrefs(stored);
    setHydrated(true);
  }, []);

  const setPref = useCallback(<K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value };
      writePrefs(next);
      applyPrefs(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ prefs, setPref, hydrated }), [prefs, setPref, hydrated]);
  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export const usePrefs = () => useContext(PrefsContext);

export function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return mobile;
}

/** Whether heavy 3D should render, based on preferences and device class. */
export function use3dLevel(): "full" | "light" | "off" {
  const { prefs } = usePrefs();
  const mobile = useIsMobile();
  if (prefs.effects3d === "off") return "off";
  if (prefs.effects3d === "reduced" || mobile || prefs.motion === "reduced") return "light";
  return "full";
}
