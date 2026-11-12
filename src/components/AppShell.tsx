import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useTable } from "@/lib/api";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  Boxes,
  Bus,
  CalendarClock,
  Command,
  Gauge,
  GraduationCap,
  Home,
  Inbox,
  LogOut,
  Menu,
  Network,
  PlayCircle,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  Table2,
  Workflow,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRole, useSession, useSignOut } from "@/hooks/useAuth";
import { usePrefs } from "@/hooks/usePrefs";
import { GlassPanel } from "@/components/Glass";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type NavItem = { to: string; label: string; icon: typeof Home; roles?: Array<"student" | "faculty" | "admin"> };

const NAV: NavItem[] = [
  // Everyone sees these
  { to: "/dashboard", label: "Overview", icon: Home },
  { to: "/timetable", label: "Timetable", icon: CalendarClock },
  { to: "/resources", label: "Resources", icon: Boxes },
  { to: "/transportation", label: "Transportation", icon: Bus },
  { to: "/requests", label: "My Requests", icon: Inbox },
  { to: "/assistant", label: "AI Assistant", icon: Sparkles },
  
  // Faculty & Admin only
  { to: "/agents", label: "Agent Control", icon: Network, roles: ["faculty", "admin"] },
  { to: "/algorithms", label: "Algorithm Lab", icon: Workflow, roles: ["faculty", "admin"] },
  { to: "/knowledge", label: "Knowledge Graph", icon: Activity, roles: ["faculty", "admin"] },
  { to: "/rules", label: "Rule Engine", icon: Gauge, roles: ["faculty", "admin"] },
  { to: "/conflicts", label: "Conflict Center", icon: ShieldAlert, roles: ["faculty", "admin"] },
  { to: "/decisions", label: "AI Decisions", icon: Bot, roles: ["faculty", "admin"] },
  { to: "/analytics", label: "Analytics", icon: BarChart3, roles: ["faculty", "admin"] },
  
  // Admin only
  { to: "/admin", label: "Admin Modules", icon: Table2, roles: ["admin"] },
  
  // Everyone
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
];

const COMMANDS = [
  { label: "Find available lab", to: "/resources" },
  { label: "Open timetable", to: "/timetable" },
  { label: "Generate timetable", to: "/timetable" },
  { label: "Show conflicts", to: "/conflicts" },
  { label: "Open transportation", to: "/transportation" },
  { label: "Run A*", to: "/algorithms" },
  { label: "Run BFS", to: "/algorithms" },
  { label: "Open AI agents", to: "/agents" },
  { label: "Show analytics", to: "/analytics" },
  { label: "Ask the campus assistant", to: "/assistant" },
  { label: "Start live AI demo", to: "/demo" },
  { label: "Open settings", to: "/settings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  const { data: role = "student" } = useRole(user);
  const signOut = useSignOut();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { prefs, setPref } = usePrefs();
    const { data: notifications } = useTable("notifications");
  const unreadCount = notifications?.filter((n: any) => n.is_read === false).length || 0;
  const [open, setOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    setPref("lastDashboard", pathname);
  }, [pathname, setPref]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const items = useMemo(() => NAV.filter((n) => !n.roles || n.roles.includes(role)), [role]);
  const mobileItems = [
    { to: "/dashboard", label: "Home", icon: Home },
    { to: "/timetable", label: "Timetable", icon: CalendarClock },
    { to: "/requests", label: "Requests", icon: Inbox },
    { to: "/assistant", label: "AI", icon: Sparkles },
    { to: "/settings", label: "Profile", icon: Settings },
  ];

  const go = (to: string) => {
    setPaletteOpen(false);
    setOpen(false);
    navigate({ to } as never);
  };

  return (
    <div className="min-h-screen lg:flex">
      {/* Sidebar */}
      <AnimatePresence>
        {(open || true) && (
          <aside
            className={cn(
              "glass-2 fixed inset-y-0 left-0 z-40 flex w-64 flex-col gap-1 overflow-y-auto p-4 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
              open ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <div className="flex items-center justify-between">
             <Link to="/dashboard" className="flex items-center gap-2.5 px-1 py-2">
  <img
    src="/ai-core.png"
    alt="MITS Campus AI"
    className="size-8 rounded-lg object-cover ring-1 ring-primary/30 shadow-glow"
  />
  <span className="font-display text-sm font-semibold">
    MITS <span className="text-primary">Campus AI</span>
  </span>
</Link>
              <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation">
                <X className="size-4" />
              </button>
            </div>

            <p className="mt-3 px-1 font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
              {role} portal
            </p>

            <nav className="mt-2 flex flex-col gap-0.5">
              {items.map((n) => {
                const active = pathname === n.to || pathname.startsWith(`${n.to}/`);
                return (
                  <Link
                    key={n.to}
                    to={n.to as never}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute left-0 h-6 w-[3px] rounded-full bg-primary"
                      />
                    ) : null}
                    <n.icon className="size-4" />
                    {n.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-2 pt-4">
              <Link
                to="/demo"
                className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-primary transition-all hover:shadow-glow"
              >
                <PlayCircle className="size-4" /> MITS Live demo
              </Link>
              <button
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/auth" });
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-destructive"
              >
                <LogOut className="size-4" /> Sign out
              </button>
            </div>
          </aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 px-4 pt-4">
          <GlassPanel level={2} className="flex items-center gap-3 px-4 py-2.5">
            <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
              <Menu className="size-5" />
            </button>
            <button
              onClick={() => setPaletteOpen(true)}
              className="glass flex flex-1 items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Search className="size-4" />
              <span className="truncate">Search MITS campus…</span>
              <span className="ml-auto hidden items-center gap-1 font-mono text-[10px] sm:flex">
                <Command className="size-3" />K
              </span>
            </button>
            {prefs.demoMode ? (
              <span className="hidden rounded-lg bg-warning/15 px-2 py-1 font-mono text-[10px] tracking-widest text-warning uppercase sm:block">
                Demo data
              </span>
            ) : (
              <span className="hidden rounded-lg bg-success/15 px-2 py-1 font-mono text-[10px] tracking-widest text-success uppercase sm:block">
                Live data
              </span>
            )}
          <Link to="/notifications" className="relative text-muted-foreground hover:text-foreground transition-colors" aria-label="Notifications">
  <Bell className="size-5" />
  {unreadCount > 0 && (
    <span className="absolute -top-0.5 -right-0.5 flex size-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
      <span className="relative inline-flex size-2 rounded-full bg-cyan-400"></span>
    </span>
  )}
</Link>
            <Link to="/settings" aria-label="Profile" className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                {(user?.email ?? "N")[0]!.toUpperCase()}
              </span>
            </Link>
          </GlassPanel>
        </header>

        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.35 }}
          className="px-4 pt-5 pb-28 lg:pb-10"
        >
          {children}
        </motion.main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="glass-3 fixed inset-x-3 bottom-3 z-40 flex items-center justify-between rounded-2xl px-2 py-2 lg:hidden">
        {mobileItems.map((m) => {
          const active = pathname === m.to;
          return (
            <Link
              key={m.to}
              to={m.to as never}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[10px]",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <m.icon className="size-4" />
              {m.label}
            </Link>
          );
        })}
      </nav>

      <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen}>
        <CommandInput placeholder="Search students, rooms, labs, buses or run a command…" />
        <CommandList>
          <CommandEmpty>No campus match found.</CommandEmpty>
          <CommandGroup heading="Commands">
            {COMMANDS.map((c) => (
              <CommandItem key={c.label} value={c.label} onSelect={() => go(c.to)}>
                <Sparkles className="mr-2 size-4 text-primary" />
                {c.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Navigate">
            {items.map((n) => (
              <CommandItem key={n.to} value={n.label} onSelect={() => go(n.to)}>
                <n.icon className="mr-2 size-4" />
                {n.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Directory">
            <CommandItem value="students" onSelect={() => go("/admin")}>
              <GraduationCap className="mr-2 size-4" /> Students, faculty, courses & rooms
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export { Button };
