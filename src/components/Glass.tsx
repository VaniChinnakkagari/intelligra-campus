import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function GlassPanel({
  className,
  children,
  level = 1,
  hover = false,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { level?: 1 | 2 | 3; hover?: boolean }) {
  const levels = { 1: "glass", 2: "glass-2", 3: "glass-3" } as const;
  return (
    <div
      className={cn(
        levels[level],
        "glass-inset rounded-2xl",
        hover &&
          "transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {eyebrow ? (
        <p className="font-mono text-[11px] tracking-[0.28em] text-primary uppercase">{eyebrow}</p>
      ) : null}
      <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
      {subtitle ? <p className="max-w-2xl text-sm text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}

export function AnimatedCounter({
  value,
  suffix = "",
  duration = 1100,
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (t < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [value, duration]);

  return (
    <span className={className}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatCard({
  label,
  value,
  suffix,
  icon: Icon,
  hint,
  delay = 0,
}: {
  label: string;
  value: number;
  suffix?: string;
  icon?: LucideIcon;
  hint?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay }}
    >
      <GlassPanel hover className="p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
            {label}
          </p>
          {Icon ? <Icon className="size-4 text-primary" aria-hidden /> : null}
        </div>
        <p className="mt-3 text-3xl font-semibold">
          <AnimatedCounter value={value} suffix={suffix ?? ""} />
        </p>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </GlassPanel>
    </motion.div>
  );
}

export function StatusDot({ status }: { status: string }) {
  const tone =
    status === "active" || status === "available" || status === "en-route" || status === "approved"
      ? "bg-success"
      : status === "busy" || status === "processing" || status === "occupied" || status === "pending"
        ? "bg-warning"
        : status === "maintenance" || status === "critical"
          ? "bg-destructive"
          : "bg-muted-foreground";
  return (
    <span className="inline-flex items-center gap-2 text-xs capitalize">
      <span className={cn("animate-pulse-glow size-2 rounded-full", tone)} />
      {status}
    </span>
  );
}

export function EmptyState({
  title,
  body,
  icon: Icon,
}: {
  title: string;
  body: string;
  icon?: LucideIcon;
}) {
  return (
    <GlassPanel className="flex flex-col items-center gap-3 p-12 text-center">
      {Icon ? <Icon className="animate-float-slow size-8 text-primary/70" aria-hidden /> : null}
      <p className="text-lg font-medium">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{body}</p>
    </GlassPanel>
  );
}

export function Ring({ value, label }: { value: number; label?: string }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="relative grid size-[68px] place-items-center">
      <svg viewBox="0 0 68 68" className="size-full -rotate-90">
        <circle cx="34" cy="34" r={r} fill="none" stroke="var(--glass-3)" strokeWidth="6" />
        <circle
          cx="34"
          cy="34"
          r={r}
          fill="none"
          stroke="var(--cyan)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (pct / 100) * c}
          style={{ transition: "stroke-dashoffset 700ms ease" }}
        />
      </svg>
      <span className="absolute text-xs font-semibold">{Math.round(pct)}%</span>
      {label ? <span className="sr-only">{label}</span> : null}
    </div>
  );
}

export const fadeUp = {
  initial: { opacity: 0, y: 22, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.45 },
};
