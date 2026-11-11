import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { GlassPanel } from "@/components/Glass";
<<<<<<< HEAD
import { useTable } from "@/lib/api";
import { useMemo, useState } from "react";
import {
  Bell, BellOff, CheckCircle, AlertCircle, Sparkles, Clock,
  Bus, CalendarClock, Shield, Megaphone, Filter, Check,
  Trash2, X, Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
=======
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87

export const Route = createFileRoute("/_authenticated/notifications")({
  component: Page,
});

<<<<<<< HEAD
// 🚨 EXACT MATCH FOR THE DATABASE COLUMNS
type Notification = {
  id: string;
  user_id: string | null;
  type: string;      // matches db 'type'
  title: string;
  message: string | null; // matches db 'message'
  is_read: boolean;  // matches db 'is_read'
  created_at: string;
};

const CATEGORY_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  ai: { icon: Sparkles, color: "text-cyan-400 bg-cyan-400/10", label: "AI" },
  decision: { icon: Cpu, color: "text-cyan-400 bg-cyan-400/10", label: "Decision" },
  request: { icon: CheckCircle, color: "text-green-400 bg-green-400/10", label: "Request" },
  timetable: { icon: CalendarClock, color: "text-violet-400 bg-violet-400/10", label: "Timetable" },
  transportation: { icon: Bus, color: "text-yellow-400 bg-yellow-400/10", label: "Transport" },
  conflict: { icon: AlertCircle, color: "text-red-400 bg-red-400/10", label: "Conflict" },
  system: { icon: Shield, color: "text-blue-400 bg-blue-400/10", label: "System" },
  announcement: { icon: Megaphone, color: "text-pink-400 bg-pink-400/10", label: "Announcement" },
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "ai", label: "AI" },
  { key: "request", label: "Requests" },
  { key: "conflict", label: "Conflicts" },
  { key: "system", label: "System" },
];

function Page() {
  const { data: notifications, isLoading, refetch } = useTable("notifications", {
    order: "created_at",
    ascending: false,
  });
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Notification | null>(null);

  const filtered = useMemo(() => {
    let list = (notifications as Notification[]) || [];

    if (filter === "unread") {
      list = list.filter((n) => n.is_read === false);
    } else if (filter !== "all") {
      list = list.filter((n) => (n.type || "").toLowerCase().includes(filter));
    }

    return list;
  }, [notifications, filter]);

  const stats = useMemo(() => {
    const list = (notifications as Notification[]) || [];
    return {
      total: list.length,
      unread: list.filter((n) => n.is_read === false).length,
      categories: new Set(list.map((n) => n.type)).size,
    };
  }, [notifications]);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true }) // 🚨 Matches DB column
      .eq("id", id);
    if (error) {
      toast.error("Failed to mark as read");
    } else {
      refetch();
    }
  };

  const markAllAsRead = async () => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true }) // 🚨 Matches DB column
      .eq("is_read", false);
    if (error) {
      toast.error("Failed to mark all as read");
    } else {
      toast.success("All marked as read");
      refetch();
    }
  };

  const deleteNotification = async (id: string) => {
    const { error } = await supabase.from("notifications").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Notification deleted");
      setSelected(null);
      refetch();
    }
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        title="Notifications"
        subtitle="Agent alerts, approvals and campus announcements."
        actions={
          <div className="flex gap-2">
            {stats.unread > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={markAllAsRead}
                className="gap-1.5 rounded-xl"
              >
                <Check className="size-3.5" /> Mark all read
              </Button>
            )}
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <GlassPanel hover className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Bell className="size-4 text-primary" />
            <span className="text-2xl font-semibold">{stats.total}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Total</p>
        </GlassPanel>

        <GlassPanel hover className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            <span className="text-2xl font-semibold text-cyan-400">{stats.unread}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Unread</p>
        </GlassPanel>

        <GlassPanel hover className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Filter className="size-4 text-primary" />
            <span className="text-2xl font-semibold">{stats.categories}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Categories</p>
        </GlassPanel>
      </div>

      {/* Filters */}
      <GlassPanel className="mb-4 p-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs transition-all",
                filter === f.key
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "bg-background/40 text-muted-foreground border border-border/40 hover:border-primary/30"
              )}
            >
              {f.label}
              {f.key === "unread" && stats.unread > 0 && (
                <span className="ml-1.5 rounded bg-primary/20 px-1 text-[10px] font-semibold">
                  {stats.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </GlassPanel>

      {/* Notification list */}
      <div className="space-y-2">
        {isLoading ? (
          <GlassPanel className="p-12 text-center text-muted-foreground">
            Loading notifications…
          </GlassPanel>
        ) : filtered.length === 0 ? (
          <GlassPanel className="p-12 text-center text-muted-foreground">
            <BellOff className="size-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">
              {filter === "unread" ? "All caught up!" : "No notifications"}
            </p>
            <p className="text-sm mt-1">
              {filter === "unread"
                ? "You have no unread notifications"
                : "Notifications from agents will appear here"}
            </p>
          </GlassPanel>
        ) : (
          filtered.map((notif) => {
            const config = CATEGORY_CONFIG[(notif.type || "").toLowerCase()] || CATEGORY_CONFIG.system;
            const Icon = config.icon;

            return (
              <GlassPanel
                key={notif.id}
                hover
                className={cn(
                  "p-4 cursor-pointer transition-all relative overflow-hidden",
                  !notif.is_read && "border-cyan-500/30 bg-cyan-500/[0.02]",
                  !notif.is_read && notif.type?.toLowerCase().includes("conflict") && "border-red-500/30 bg-red-500/[0.02]"
                )}
                onClick={() => setSelected(notif)}
              >
                {/* Unread Indicator bar */}
                {!notif.is_read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400" />
                )}

                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-xl shrink-0",
                      config.color
                    )}
                  >
                    <Icon className="size-5" />
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className={cn("font-semibold text-sm truncate", !notif.is_read ? "text-white" : "text-muted-foreground")}>{notif.title}</p>
                        {!notif.is_read && (
                          <span className="size-2 rounded-full bg-cyan-400 shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatTime(notif.created_at)}
                      </span>
                    </div>

                    {notif.message && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notif.message}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-medium",
                          config.color
                        )}
                      >
                        {config.label}
                      </span>
                      {!notif.is_read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notif.id);
                          }}
                          className="text-[10px] text-cyan-400 hover:underline"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </GlassPanel>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => {
            if (!selected.is_read) markAsRead(selected.id);
            setSelected(null);
          }}
        >
          <GlassPanel
            level={3}
            className="w-full max-w-lg p-6 border-cyan-500/20 shadow-[0_0_50px_rgba(34,211,238,0.1)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                {(() => {
                  const config = CATEGORY_CONFIG[(selected.type || "").toLowerCase()] || CATEGORY_CONFIG.system;
                  const Icon = config.icon;
                  return (
                    <span className={cn("grid size-12 place-items-center rounded-xl", config.color)}>
                      <Icon className="size-6" />
                    </span>
                  );
                })()}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {CATEGORY_CONFIG[(selected.type || "").toLowerCase()]?.label || "Notification"}
                  </p>
                  <h3 className="font-semibold mt-0.5 text-lg text-white">{selected.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/10 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {selected.message && (
              <div className="rounded-lg bg-black/40 p-4 mb-4 border border-white/5">
                <p className="text-sm leading-relaxed text-gray-300">{selected.message}</p>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {new Date(selected.created_at).toLocaleString("en-IN", {
                    hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata"
                })}
              </span>
              <span className={selected.is_read ? "text-green-400" : "text-cyan-400"}>
                {selected.is_read ? "✓ Read" : "● Unread"}
              </span>
            </div>

            <div className="flex gap-2">
              {!selected.is_read && (
                <Button
                  size="sm"
                  onClick={() => {
                    markAsRead(selected.id);
                    setSelected(null);
                  }}
                  className="flex-1 gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                >
                  <Check className="size-3.5" /> Mark as read
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => deleteNotification(selected.id)}
                className="gap-1.5 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-3.5" /> Delete
              </Button>
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
}
=======
function Page() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader title="Notifications" subtitle="Agent alerts, approvals and campus announcements." />
      <GlassPanel level={2} className="p-6">
        <p className="text-sm text-muted-foreground">
          This module is wired to the campus database and agent pipeline.
        </p>
      </GlassPanel>
    </div>
  );
}
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
