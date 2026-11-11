import { useEffect, useRef, useState } from "react";
import { usePrefs } from "@/hooks/usePrefs";

/** Subtle desktop-only cursor glow that grows over interactive elements. */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [big, setBig] = useState(false);
  const { prefs } = usePrefs();

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches || prefs.motion === "reduced") return;
    setEnabled(true);
    let raf = 0;
    const pos = { x: -100, y: -100 };
    const cur = { x: -100, y: -100 };

    const move = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const el = e.target as HTMLElement | null;
      setBig(!!el?.closest("button, a, [role='button'], input, select"));
    };
    const loop = () => {
      cur.x += (pos.x - cur.x) * 0.18;
      cur.y += (pos.y - cur.y) * 0.18;
      if (ref.current) ref.current.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, [prefs.motion]);

  if (!enabled) return null;
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-50 will-change-transform"
    >
      <div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-2xl transition-all duration-300"
        style={{ width: big ? 90 : 46, height: big ? 90 : 46 }}
      />
    </div>
  );
}
